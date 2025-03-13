async function consultarCNPJ() {
  const cnpj = document.getElementById('cnpj').value.trim();


  if (!cnpj || cnpj.length !== 14 || isNaN(cnpj)) {
    alert('Por favor, insira um CNPJ válido (somente números).');
    return;
  }
  document.getElementById('result').style.display = 'none';
  document.getElementById('error').style.display = 'none';

  try {

    const response = await fetch(`https://api.allorigins.win/raw?url=https://receitaws.com.br/v1/cnpj/${cnpj}`, {
      headers: {
        'Accept': 'application/json'
      }
    });

    const data = await response.json();

    if (response.status === 200 && data.status === 'OK') {

      document.getElementById('nome').textContent = data.nome;
      document.getElementById('fantasia').textContent = data.fantasia;
      document.getElementById('situacao').textContent = data.situacao;
      document.getElementById('atividade').textContent = data.atividade_principal[0].text;

      document.getElementById('result').style.display = 'block';
    } else {

      document.getElementById('error').textContent = 'CNPJ não encontrado ou inválido.';
      document.getElementById('error').style.display = 'block';
    }
  } catch (error) {
    console.error('Erro ao consultar a API:', error);
    document.getElementById('error').textContent = 'Erro ao consultar a API. Tente novamente mais tarde.';
    document.getElementById('error').style.display = 'block';
  }
}
