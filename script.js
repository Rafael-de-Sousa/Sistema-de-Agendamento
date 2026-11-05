const form = document.getElementById('formAgendamento');
const lista = document.getElementById('listaAgendamentos');
const apenasLetras = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
const apenasNumeros = /^[0-1-2-3-4-5-6-7-8-9]+$/;

function obterAgendamentos() {
  return JSON.parse(localStorage.getItem('agendamentos')) || [];
}

function salvarLocalStorage(agendamentos) {
  localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
}

function formatarData(data) {
  const partes = data.split('-');
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function existeConflito(data, hora) {
  const agendamentos = obterAgendamentos();

	console.log('Comparando com:', agendamentos);
	
  return agendamentos.some(item =>
    item.data === data && item.hora === hora
  );
}

function renderizarTabela() {
  const agendamentos = obterAgendamentos();
  lista.innerHTML = '';

  agendamentos.forEach((item, index) => {
    const linha = document.createElement('tr');

    linha.innerHTML = `
      <td>${item.nome}</td>
      <td>${item.telefone}</td>
      <td>${formatarData(item.data)}</td>
      <td>${item.hora}</td>
      <td>${item.especialidade}</td>
      <td>
        <button 
          class="btn-remove" 
          data-cy="btn-excluir"
          onclick="removerAgendamento(${index})">
          Excluir
        </button>
      </td>
    `;

    lista.appendChild(linha);
  });
}

form.addEventListener('submit', function(e) {
  e.preventDefault();

  const nome = document.getElementById('nome').value;
  const telefone = document.getElementById('telefone').value;
  const data = document.getElementById('data').value;
  const hora = document.getElementById('hora').value;
  const especialidade = document.getElementById('especialidade').value;

  if (existeConflito(data, hora)) {
    alert('Já existe uma consulta nesse horário!');
    return;
  }
  
  // Se o nome NÃO passar no teste (ou seja, se tiver números ou símbolos)
  if (!apenasLetras.test(nome)) {
    alert('Preencha o campo com o formato correto! O campo nome não deve conter números.');
    return;
  }
  
  if (!apenasNumeros.test(telefone)) {
    alert('Preencha o campo com o formato correto! O campo telefone não deve conter letras.');
    return;
  }

  const agendamentos = obterAgendamentos();

  const novoAgendamento = { nome, telefone, data, hora, especialidade };

  agendamentos.push(novoAgendamento);

  salvarLocalStorage(agendamentos);
  renderizarTabela();

  form.reset();
  alert('Consulta agendada com sucesso!');
});

function removerAgendamento(index) {
  if (confirm('Deseja realmente excluir este agendamento?')) {

    const agendamentos = obterAgendamentos();

    agendamentos.splice(index, 1);

    salvarLocalStorage(agendamentos);
    renderizarTabela();
  }
}

renderizarTabela();
