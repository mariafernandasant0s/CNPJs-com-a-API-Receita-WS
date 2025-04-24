document.addEventListener('DOMContentLoaded', () => {
  const cnpjInput = document.getElementById('cnpj');
  const consultarButton = document.getElementById('consultar');
  const resultDiv = document.getElementById('result');
  const errorDiv = document.getElementById('error');
  const loadingDiv = document.getElementById('loading');

  consultarButton.addEventListener('click', consultarCNPJ);

  async function consultarCNPJ() {
    const cnpj = cnpjInput.value.trim();

    resultDiv.style.display = 'none';
    errorDiv.style.display = 'none';

    if (!validarCNPJ(cnpj)) {
      exibirErro('Por favor, insira um CNPJ válido.');
      return;
    }

    exibirLoading();

    try {
      const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
      ocultarLoading();

      if (!response.ok) {
        exibirErro(`Erro ${response.status}: ${response.statusText}`);
        return;
      }

      const data = await response.json();
      exibirResultado(data);
    } catch (error) {
      ocultarLoading();
      console.error(error);
      exibirErro('Erro ao consultar a API. Verifique sua conexão.');
    }
  }

  function validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g, '');
    if (cnpj.length !== 14) return false;

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado != digitos.charAt(0)) return false;

    tamanho++;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    return resultado == digitos.charAt(1);
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
    document.getElementById('nome').textContent = data.razao_social;
    document.getElementById('fantasia').textContent = data.nome_fantasia || 'Não informado';
    document.getElementById('situacao').textContent = data.descricao_situacao_cadastral;
    document.getElementById('atividade').textContent = data.cnae_fiscal_descricao;
    resultDiv.style.display = 'block';
  }

  function exibirErro(mensagem) {
    errorDiv.textContent = mensagem;
    errorDiv.style.display = 'block';
  }
});
