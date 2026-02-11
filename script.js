let agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];

const form = document.getElementById('formAgendamento');
const lista = document.getElementById('listaAgendamentos');

function salvarLocalStorage() {
  localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
}

function formatarData(data) {
  const partes = data.split('-');
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function existeConflito(data, hora) {
  return agendamentos.some(item => item.data === data && item.hora === hora);
}

function renderizarTabela() {
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

  const novoAgendamento = { nome, telefone, data, hora, especialidade };

  agendamentos.push(novoAgendamento);
  salvarLocalStorage();
  renderizarTabela();

  form.reset();
  alert('Consulta agendada com sucesso!');
});

function removerAgendamento(index) {
  if (confirm('Deseja realmente excluir este agendamento?')) {
    agendamentos.splice(index, 1);
    salvarLocalStorage();
    renderizarTabela();
  }
}

renderizarTabela();
