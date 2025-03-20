document.addEventListener('DOMContentLoaded', () => {
  const cnpjInput = document.getElementById('cnpj');
  const consultarButton = document.getElementById('consultar');
  const resultDiv = document.getElementById('result');
  const errorDiv = document.getElementById('error');
  const loadingDiv = document.getElementById('loading');

  consultarButton.addEventListener('click', consultarCNPJ);

  async function consultarCNPJ() {
    const cnpj = cnpjInput.value.trim();

    // Limpa mensagens anteriores
    resultDiv.style.display = 'none';
    errorDiv.style.display = 'none';

    if (!validarCNPJ(cnpj)) {
      exibirErro('Por favor, insira um CNPJ válido.');
      return;
    }

    exibirLoading();

    try {
      const response = await fetch(
        `https://api.allorigins.win/raw?url=https://receitaws.com.br/v1/cnpj/${cnpj}`,
        {
          headers: {
            Accept: 'application/json',
          },
        }
      );

      ocultarLoading();

      if (!response.ok) {

        if (response.status === 429) {
          exibirErro('Limite de requisições excedido. Tente novamente mais tarde.');
        } else if (response.status === 404) {

          exibirErro('CNPJ não encontrado.');

        }
        else {
          exibirErro(`Erro na requisição: ${response.status} - ${response.statusText}`);
        }
        return;
      }

      const data = await response.json();

      if (data.status === 'OK') {
        exibirResultado(data);
      } else {
        exibirErro(data.message || 'CNPJ não encontrado ou inválido.');
      }
    } catch (error) {


      if (error.value=="400")
 {
  ('Erro 400')
 }
      ocultarLoading();
      console.error('Erro ao consultar a API:', error);
      exibirErro('Erro ao consultar a API.');
    }
  }

  function validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g, '');

    if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) {
      return false;
    }

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) {
        pos = 9;
      }
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);

    if (resultado != digitos.charAt(0)) {
      return false;
    }

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) {
        pos = 9;
      }
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);

    if (resultado != digitos.charAt(1)) {
      return false;
    }

    return true;
  }

  function exibirLoading() {
    loadingDiv.style.display = 'block';
    consultarButton.disabled = true;
  }

  function ocultarLoading() {
    loadingDiv.style.display = 'none';
    consultarButton.disabled = false;
  }

  function exibirResultado(data) {
    document.getElementById('nome').textContent = data.nome;
    document.getElementById('fantasia').textContent = data.fantasia;
    document.getElementById('situacao').textContent = data.situacao;
    document.getElementById('atividade').textContent = data.atividade_principal[0].text;
    resultDiv.style.display = 'block';
  }

  function exibirErro(mensagem) {
    errorDiv.textContent = mensagem;
    errorDiv.style.display = 'block';
  }
});