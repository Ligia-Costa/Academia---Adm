const ENDPOINT_ACADEMIA = 'https://aplica-o-2-api-bd.vercel.app/alunos';
const ENDPOINT_ALUNOS = 'https://aplica-o-2-api-bd.vercel.app/alunos/lista';

const inputNomeAluno = document.getElementById('inputNomeAluno');
const inputCpfAluno = document.getElementById('inputCpfAluno');
const selectStatus = document.getElementById('selectStatus');

const inputAtualizacaoId = document.getElementById('update-id');
const inputAtualizacaoNome = document.getElementById('update-name');
const inputAtualizacaoCpf = document.getElementById('update-cpf');
const inputAtualizacaoStatus = document.getElementById('update-status');

const listaAlunos = document.getElementById('lista-alunos');

const status = selectStatus.value === "Ativo";

async function buscarListarAlunos() {
  console.log('oi')
  try {
    const respostaHttp = await fetch(ENDPOINT_ALUNOS);
    const alunos = await respostaHttp.json();
    console.log(alunos)
    exibirAlunosNaTela(alunos);
  } catch (erro) {
    listaAlunos.innerHTML = `<p class='text-red-500'>Erro ao carregar alunos: ${erro.message}</p>`;
  }
};

document.addEventListener('DOMContentLoaded', buscarListarAlunos);

// Função para exibir os alunos
function exibirAlunosNaTela(alunos) {
  listaAlunos.innerHTML = '';
  const listaBloqueados = document.getElementById('lista-bloqueados');
  listaBloqueados.innerHTML = '';

  for (const aluno of alunos) {
    const card = document.createElement('div');
    card.className = 'bg-white p-4 rounded shadow';

    card.innerHTML = `
      <p><strong>Nome:</strong> ${aluno.nome}</p>
      <p><strong>CPF:</strong> ${aluno.cpf}</p>
      <p><strong>ID:</strong> ${aluno.id}</p>
      <div class="mt-2 flex gap-2">
        ${aluno.status === 'Bloqueado' ? `
          <button onclick="reativarAluno(${aluno.id}, '${aluno.nome}', '${aluno.cpf}')" class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">
            Reativar
          </button>
        ` : `
          <button onclick="editarAluno(${aluno.id}, '${aluno.nome}', '${aluno.cpf}', '${aluno.status}')" class="bg-yellow-300 hover:bg-yellow-400 px-3 py-1 rounded flex items-center gap-1">
            <i data-lucide="edit" class="w-4 h-4"></i> Editar
          </button>
          <button onclick="excluirMatricula(${aluno.id})" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1">
            <i data-lucide="trash-2" class="w-4 h-4"></i> Excluir
          </button>
        `}
      </div>
    `;

    if (aluno.status === 'Bloqueado') {
      listaBloqueados.appendChild(card);
    } else {
      listaAlunos.appendChild(card);
    }
  }

  lucide.createIcons(); // Atualiza os ícones do Lucide
}

//Função para reativar aluno
async function reativarAluno(id, nome, cpf) {
  const status = "Ativo";
  const dadosMatriculaAtualizado = { nome, cpf, status };

  try {
    const respostaHttp = await fetch(`${ENDPOINT_ACADEMIA}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dadosMatriculaAtualizado)
    });
    const resultadoApi = await respostaHttp.json();
    alert(resultadoApi.mensagem || 'Aluno reativado!');
    buscarListarAlunos();
  } catch (erro) {
    alert("Erro ao reativar aluno: " + erro.message);
  }
};

// Função para matricular alunos
async function matricularAluno() {
  const nome = inputNomeAluno.value;
  const cpf = inputCpfAluno.value;
  const status = selectStatus.value;
  if (!nome || !cpf || !status) {
    alert("Por favor, preencha todos os campos.");
    return;
  }
  const novoAluno = { 
    nome: nome, 
    cpf: cpf, 
    status: status
  };

  try {
    const respostaHttp = await fetch(ENDPOINT_ACADEMIA, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoAluno)
    });
    const resultadoApi = await respostaHttp.json();
    if (!respostaHttp.ok) {
      throw new Error(resultadoApi.mensagem || `Erro ao matricular aluno: ${respostaHttp.status}`);
    };

    console.log("Matrícula criada com sucesso!", resultadoApi);
    alert(resultadoApi.mensagem);

    inputNomeAluno.value = '';
    inputCpfAluno.value = '';
    selectStatus.value = '';
    await buscarListarAlunos();

  } catch (erro) {
    console.error("Falha ao matricular aluno:", erro);
    alert("Erro ao cadastrar aluno: " + erro.message);
  };
};

// Função para editar alunos
function editarAluno(id, nome, cpf, status) {
  inputAtualizacaoId.value = id;
  inputAtualizacaoNome.value = nome;
  inputAtualizacaoCpf.value = cpf;
  inputAtualizacaoStatus.value = status;
  document.getElementById('editarAluno').classList.remove('hidden');
  document.getElementById('adicionarAluno').classList.add('hidden');
};

// Função para esconder formulário de atualização
function cancelarAtualizacao() {
  document.getElementById('editarAluno').classList.add('hidden');
  document.getElementById('adicionarAluno').classList.remove('hidden');
};

// Função para atualizar
async function atualizarAluno() {
  console.log("Tentando atualizar matrícula...");

  const id = inputAtualizacaoId.value;
  const nome = inputAtualizacaoNome.value;
  const cpf = inputAtualizacaoCpf.value;
  const status = inputAtualizacaoStatus.value;

  const dadosMatriculaAtualizado ={
    nome: nome,
    cpf: cpf,
    status: status
  };

  if (!id) {
    console.error("ID da matrícula para atualização não encontrado!");
    alert("Erro interno: ID da matrícula não encontrado para atualizar.");
    return;
}

  if (!nome || !cpf || !status) {
      alert("Por favor, preencha o nome, o CPF e o status para atualizar.");
      return;
  };

    try {
      const respostaHttp = await fetch(`${ENDPOINT_ACADEMIA}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosMatriculaAtualizado)
      });
      const resultadoApi = await respostaHttp.json();
      alert(resultadoApi.mensagem || 'Aluno atualizado!');
      cancelarAtualizacao();
      buscarListarAlunos();
    } catch (erro) {
      alert("Erro ao atualizar aluno: " + erro.message);
    ;}
  };

// Função para excluir matrícula
async function excluirMatricula(id) {
  console.log(`Tentando excluir matrícula com ID: ${id}`);

  if (!confirm(`Tem certeza que deseja excluir este aluno com ID ${id}? Esta ação não pode ser desfeita.`)){
    return;
  };

  try {
    const respostaHttp = await fetch(`${ENDPOINT_ACADEMIA}/${id}`, { method: 'DELETE' });
  
    const resultadoApi = await respostaHttp.json();
  
    if (!respostaHttp.ok) {
      throw new Error(resultadoApi.mensagem || `Erro ao excluir Matrícula: ${respostaHttp.status}`);
    }
  
    alert(resultadoApi.mensagem || 'Aluno excluído!');
    await buscarListarAlunos();
  
  } catch (erro) {
    alert("Erro ao excluir aluno: " + erro.message);
};  

document.querySelector('input[type="text"]').addEventListener('input', function (e) {
  const termo = e.target.value.toLowerCase();
  const cards = document.querySelectorAll('#lista-alunos > div');
  cards.forEach(card => {
    const nome = card.textContent.toLowerCase();
    card.style.display = nome.includes(termo) ? '' : 'none';
  });
});
}