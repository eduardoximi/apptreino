// ===== Meu Treino — app de academia (HTML/CSS/JS + localStorage) =====

const STORAGE = {
  treinos: 'mt_treinos',
  historico: 'mt_historico',
  dieta: 'mt_dieta',
  metaKcal: 'mt_meta_kcal',
  descansoAlvo: 'mt_descanso_alvo',
};

// Grupos musculares disponíveis (escolhidos por menu, sem digitar)
const GRUPOS = [
  'Peito', 'Costas', 'Quadríceps', 'Glúteos', 'Ombros',
  'Bíceps', 'Tríceps', 'Abdômen', 'Panturrilha', 'Cardio',
];

// Catálogo de exercícios por grupo (lista pronta para selecionar sem digitar)
const EXERCICIOS_POR_GRUPO = {
  'Peito': {
    'Halteres / Barra': [
      'Supino Reto com Barra', 'Supino Inclinado com Barra', 'Supino Declinado com Barra',
      'Supino Reto com Halteres', 'Supino Inclinado com Halteres', 'Supino Declinado com Halteres',
      'Crucifixo Reto com Halteres', 'Crucifixo Inclinado com Halteres', 'Crucifixo Declinado com Halteres',
      'Pullover com Halter',
    ],
    'Máquina': [
      'Chest Press Horizontal', 'Chest Press Inclinado', 'Chest Press Declinado',
      'Peck Deck (Voador)', 'Máquina Convergente para Peitoral',
      'Supino na Smith Machine', 'Supino Inclinado na Smith Machine',
    ],
    'Polia': [
      'Cross Over na Polia Alta', 'Cross Over na Polia Média', 'Cross Over na Polia Baixa',
      'Crucifixo na Polia',
    ],
  },
  'Costas': {
    'Halteres / Barra': [
      'Remada Curvada com Barra', 'Remada Cavalinho', 'Remada Unilateral com Halter',
      'Levantamento Terra', 'Barra Fixa',
    ],
    'Máquina e Polia': [
      'Puxada Frontal', 'Puxada Supinada', 'Puxada Neutra', 'Remada Baixa',
      'Remada Articulada', 'Pulldown na Polia', 'Pullover na Máquina',
    ],
  },
  'Quadríceps': {
    'Halteres / Barra': [
      'Agachamento Livre', 'Agachamento Frontal', 'Afundo', 'Passada', 'Agachamento Búlgaro',
    ],
    'Máquina': [
      'Leg Press 45°', 'Leg Press Horizontal', 'Hack Squat', 'Cadeira Extensora', 'Smith Machine Agachamento',
    ],
  },
  'Glúteos': {
    'Halteres / Barra': ['Hip Thrust', 'Elevação Pélvica'],
    'Máquina': ['Máquina Glúteo', 'Abdutora', 'Adutora'],
    'Polia': [
      'Glúteo na Polia', 'Coice na Polia', 'Abdução de Quadril na Polia',
      'Adução de Quadril na Polia', 'Hip Thrust na Polia', 'Pull Through',
    ],
  },
  'Ombros': {
    'Halteres / Barra': [
      'Desenvolvimento com Barra', 'Desenvolvimento com Halteres', 'Elevação Lateral',
      'Elevação Frontal', 'Crucifixo Invertido', 'Encolhimento com Barra', 'Encolhimento com Halteres',
    ],
    'Máquina': ['Desenvolvimento na Máquina', 'Elevação Lateral na Máquina', 'Peck Deck Invertido'],
    'Polia': [
      'Elevação Lateral na Polia', 'Elevação Frontal na Polia', 'Crucifixo Invertido na Polia',
      'Desenvolvimento na Polia', 'Remada Alta na Polia', 'Y Raise na Polia',
    ],
  },
  'Bíceps': {
    'Halteres / Barra': [
      'Rosca Direta', 'Rosca W', 'Rosca Alternada', 'Rosca Martelo', 'Rosca Concentrada', 'Rosca Scott com Barra',
    ],
    'Máquina': ['Rosca Scott na Máquina', 'Rosca na Polia Baixa', 'Rosca Unilateral na Polia'],
    'Polia': [
      'Rosca Direta na Polia', 'Rosca Barra Reta na Polia', 'Rosca Barra W na Polia', 'Rosca Corda',
      'Rosca Martelo na Polia', 'Rosca Scott na Polia', 'Rosca Alta na Polia',
    ],
  },
  'Tríceps': {
    'Halteres / Barra': ['Tríceps Francês', 'Tríceps Testa', 'Supino Fechado', 'Mergulho entre Bancos'],
    'Máquina': ['Tríceps Máquina', 'Tríceps Corda', 'Tríceps Barra Reta na Polia', 'Tríceps Unilateral na Polia'],
    'Polia': [
      'Tríceps Barra Reta', 'Tríceps Barra W', 'Tríceps Corda na Polia',
      'Tríceps Unilateral', 'Tríceps Francês na Polia',
    ],
  },
  'Abdômen': ['Abdominal supra', 'Prancha', 'Elevação de pernas', 'Abdominal infra', 'Russian twist', 'Abdominal na roda'],
  'Panturrilha': ['Panturrilha em pé', 'Panturrilha sentado', 'Panturrilha no leg press'],
  'Cardio': ['Esteira', 'Bicicleta', 'Elíptico', 'Pular corda', 'Escada (stair)', 'Remo ergômetro'],
};

// Treinos sugeridos (modelos prontos) — agrupados por objetivo
const TREINOS_SUGERIDOS = [
  {
    nome: 'Push — Peito, Ombro e Tríceps', categoria: 'Hipertrofia',
    exercicios: [
      { nome: 'Supino reto', grupo: 'Peito', series: 4, reps: 10 },
      { nome: 'Supino inclinado', grupo: 'Peito', series: 3, reps: 10 },
      { nome: 'Desenvolvimento', grupo: 'Ombros', series: 3, reps: 12 },
      { nome: 'Elevação lateral', grupo: 'Ombros', series: 3, reps: 15 },
      { nome: 'Tríceps corda', grupo: 'Tríceps', series: 3, reps: 12 },
      { nome: 'Tríceps testa', grupo: 'Tríceps', series: 3, reps: 12 },
    ],
  },
  {
    nome: 'Pull — Costas e Bíceps', categoria: 'Hipertrofia',
    exercicios: [
      { nome: 'Puxada frontal', grupo: 'Costas', series: 4, reps: 10 },
      { nome: 'Remada curvada', grupo: 'Costas', series: 3, reps: 10 },
      { nome: 'Remada baixa', grupo: 'Costas', series: 3, reps: 12 },
      { nome: 'Rosca direta', grupo: 'Bíceps', series: 3, reps: 12 },
      { nome: 'Rosca martelo', grupo: 'Bíceps', series: 3, reps: 12 },
    ],
  },
  {
    nome: 'Legs — Pernas e Glúteos', categoria: 'Hipertrofia',
    exercicios: [
      { nome: 'Agachamento livre', grupo: 'Quadríceps', series: 4, reps: 10 },
      { nome: 'Leg press', grupo: 'Quadríceps', series: 4, reps: 12 },
      { nome: 'Cadeira extensora', grupo: 'Quadríceps', series: 3, reps: 15 },
      { nome: 'Cadeira flexora', grupo: 'Quadríceps', series: 3, reps: 15 },
      { nome: 'Elevação pélvica', grupo: 'Glúteos', series: 3, reps: 12 },
      { nome: 'Panturrilha em pé', grupo: 'Panturrilha', series: 4, reps: 20 },
    ],
  },
  {
    nome: 'Full Body Iniciante', categoria: 'Iniciante',
    exercicios: [
      { nome: 'Agachamento livre', grupo: 'Quadríceps', series: 3, reps: 12 },
      { nome: 'Supino máquina', grupo: 'Peito', series: 3, reps: 12 },
      { nome: 'Puxada frontal', grupo: 'Costas', series: 3, reps: 12 },
      { nome: 'Desenvolvimento', grupo: 'Ombros', series: 3, reps: 12 },
      { nome: 'Abdominal supra', grupo: 'Abdômen', series: 3, reps: 15 },
    ],
  },
  {
    nome: 'Peito e Tríceps (ABC - A)', categoria: 'Hipertrofia',
    exercicios: [
      { nome: 'Supino reto', grupo: 'Peito', series: 4, reps: 10 },
      { nome: 'Supino inclinado', grupo: 'Peito', series: 3, reps: 10 },
      { nome: 'Crossover', grupo: 'Peito', series: 3, reps: 15 },
      { nome: 'Tríceps corda', grupo: 'Tríceps', series: 3, reps: 12 },
      { nome: 'Mergulho', grupo: 'Tríceps', series: 3, reps: 12 },
    ],
  },
  {
    nome: 'Cardio + Abdômen', categoria: 'Cardio',
    exercicios: [
      { nome: 'Esteira', grupo: 'Cardio', series: 1, reps: 20 },
      { nome: 'Bicicleta', grupo: 'Cardio', series: 1, reps: 15 },
      { nome: 'Prancha', grupo: 'Abdômen', series: 3, reps: 1 },
      { nome: 'Abdominal supra', grupo: 'Abdômen', series: 3, reps: 20 },
      { nome: 'Elevação de pernas', grupo: 'Abdômen', series: 3, reps: 15 },
    ],
  },
];

// Retorna a lista plana de exercícios de um grupo (com ou sem subgrupos)
function listaExercicios(grupo) {
  const dados = EXERCICIOS_POR_GRUPO[grupo];
  if (!dados) return [];
  return Array.isArray(dados) ? dados : Object.values(dados).flat();
}

// Monta o HTML de <option>/<optgroup> de um grupo para um <select>
function opcoesExercicios(grupo, selecionado, placeholder) {
  const dados = EXERCICIOS_POR_GRUPO[grupo];
  const opt = (e) => `<option value="${escapar(e)}" ${selecionado === e ? 'selected' : ''}>${escapar(e)}</option>`;
  let html = `<option value="">${placeholder}</option>`;
  if (!dados) return html;
  if (Array.isArray(dados)) {
    html += dados.map(opt).join('');
  } else {
    html += Object.entries(dados)
      .map(([sub, lista]) => `<optgroup label="${escapar(sub)}">${lista.map(opt).join('')}</optgroup>`)
      .join('');
  }
  return html;
}

// ---- Estado em memória ----
let treinos = carregar(STORAGE.treinos, []);
let historico = carregar(STORAGE.historico, []);
let dieta = carregar(STORAGE.dieta, []);
let metaKcal = carregar(STORAGE.metaKcal, 0);
let sessaoAtual = null;      // { treinoId, nome, inicio, exercicios: [...] }
let cronometroId = null;
let filtroGrupo = null;      // null = todos
let filtroSugestao = null;   // categoria de sugestão; null = todas
let busca = '';

// ---- Persistência ----
function carregar(chave, padrao) {
  try {
    const raw = localStorage.getItem(chave);
    return raw ? JSON.parse(raw) : padrao;
  } catch {
    return padrao;
  }
}
function salvar(chave, valor) {
  localStorage.setItem(chave, JSON.stringify(valor));
}
function novoId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// =====================================================================
// Navegação pela coluna lateral
// =====================================================================
document.querySelectorAll('.nav-item').forEach((btn) => {
  btn.addEventListener('click', () => trocarAba(btn.dataset.tab));
});
function trocarAba(nome) {
  document.querySelectorAll('.nav-item').forEach((b) =>
    b.classList.toggle('active', b.dataset.tab === nome)
  );
  document.querySelectorAll('.tab-panel').forEach((p) =>
    p.classList.toggle('active', p.id === nome)
  );
  if (nome === 'hoje') renderTreinos();
  if (nome === 'sugestoes') renderSugestoes();
  if (nome === 'concluidos') renderHistorico();
  if (nome === 'resultados') renderResultados();
  if (nome === 'dieta') renderDieta();
}

// ---- Busca (filtra treinos por nome) ----
document.getElementById('busca').addEventListener('input', (e) => {
  busca = e.target.value.trim().toLowerCase();
  trocarAba('hoje');
  renderTreinos();
});

// =====================================================================
// TREINO DE HOJE — listagem, filtro, busca, criação e início de sessão
// =====================================================================
const listaTreinosEl = document.getElementById('lista-treinos');
const treinosVazioEl = document.getElementById('treinos-vazio');
const buscaVazioEl = document.getElementById('busca-vazio');
const filtroGruposEl = document.getElementById('filtro-grupos');

function gruposDoTreino(t) {
  return [...new Set(t.exercicios.map((ex) => ex.grupo).filter(Boolean))];
}

function renderFiltroGrupos() {
  const presentes = [...new Set(treinos.flatMap(gruposDoTreino))];
  const ordenados = GRUPOS.filter((g) => presentes.includes(g));
  filtroGruposEl.innerHTML = '';
  if (ordenados.length === 0) {
    filtroGruposEl.classList.add('hidden');
    return;
  }
  filtroGruposEl.classList.remove('hidden');

  const criarChip = (rotulo, valor) => {
    const chip = document.createElement('button');
    chip.className = 'chip' + (filtroGrupo === valor ? ' active' : '');
    chip.textContent = rotulo;
    chip.onclick = () => { filtroGrupo = valor; renderTreinos(); };
    filtroGruposEl.appendChild(chip);
  };
  criarChip('Todos', null);
  ordenados.forEach((g) => criarChip(g, g));
}

function renderTreinos() {
  renderFiltroGrupos();
  listaTreinosEl.innerHTML = '';

  if (filtroGrupo && !treinos.some((t) => gruposDoTreino(t).includes(filtroGrupo))) {
    filtroGrupo = null;
    renderFiltroGrupos();
  }

  let visiveis = filtroGrupo
    ? treinos.filter((t) => gruposDoTreino(t).includes(filtroGrupo))
    : treinos.slice();
  if (busca) {
    visiveis = visiveis.filter((t) => t.nome.toLowerCase().includes(busca));
  }

  treinosVazioEl.classList.toggle('hidden', treinos.length > 0);
  buscaVazioEl.classList.toggle('hidden', !(treinos.length > 0 && visiveis.length === 0));

  visiveis.forEach((t) => {
    const card = document.createElement('div');
    card.className = 'card';
    const itens = t.exercicios
      .map(
        (ex) =>
          `<li><span>${escapar(ex.nome)}${ex.grupo ? `<span class="grupo-tag">${escapar(ex.grupo)}</span>` : ''}</span> <span>${ex.series}×${ex.reps} • ${ex.carga || 0}kg${ex.pesoMaquina ? ` • máq.${ex.pesoMaquina}` : ''}</span></li>`
      )
      .join('');
    card.innerHTML = `
      <div class="card-head">
        <div>
          <h3>${escapar(t.nome)}</h3>
          <div class="card-meta">${t.exercicios.length} exercício(s)</div>
        </div>
        <div class="card-actions">
          <button class="btn primary small" data-acao="iniciar">Iniciar ▶</button>
          <button class="btn small" data-acao="editar">Editar</button>
          <button class="btn small danger" data-acao="excluir">×</button>
        </div>
      </div>
      <ul class="exercicio-resumo">${itens}</ul>
    `;
    card.querySelector('[data-acao="iniciar"]').onclick = () => iniciarSessao(t);
    card.querySelector('[data-acao="editar"]').onclick = () => abrirEditor(t.id);
    card.querySelector('[data-acao="excluir"]').onclick = () => excluirTreino(t.id);
    listaTreinosEl.appendChild(card);
  });

  atualizarReabrirHoje();
}

// Botão "Reabrir treino de hoje" — aparece se houver sessão concluída hoje
const reabrirHojeBtn = document.getElementById('reabrir-hoje-btn');
reabrirHojeBtn.onclick = () => {
  const sessaoHoje = sessaoConcluidaHoje();
  if (sessaoHoje) reabrirSessao(sessaoHoje);
};

function sessaoConcluidaHoje() {
  const hoje = new Date();
  const hojeK = `${hoje.getFullYear()}-${hoje.getMonth()}-${hoje.getDate()}`;
  return historico.find((h) => chaveDia(h.data) === hojeK) || null;
}

function atualizarReabrirHoje() {
  const tem = !sessaoAtual && !!sessaoConcluidaHoje();
  reabrirHojeBtn.classList.toggle('hidden', !tem);
}

function excluirTreino(id) {
  if (!confirm('Excluir este treino?')) return;
  treinos = treinos.filter((t) => t.id !== id);
  salvar(STORAGE.treinos, treinos);
  renderTreinos();
}

// =====================================================================
// MODAL — editor de treino
// =====================================================================
const modal = document.getElementById('modal-treino');
const modalTitulo = document.getElementById('modal-treino-titulo');
const inputNome = document.getElementById('treino-nome');
const editorExerciciosEl = document.getElementById('editor-exercicios');
let editandoId = null;

document.getElementById('novo-treino-btn').onclick = () => abrirEditor(null);
document.getElementById('add-exercicio-btn').onclick = () => adicionarLinhaExercicio();
document.getElementById('cancelar-treino-btn').onclick = fecharEditor;
document.getElementById('salvar-treino-btn').onclick = salvarTreino;

function abrirEditor(id) {
  editandoId = id;
  editorExerciciosEl.innerHTML = '';
  if (id) {
    const t = treinos.find((x) => x.id === id);
    modalTitulo.textContent = 'Editar treino';
    inputNome.value = t.nome;
    t.exercicios.forEach((ex) => adicionarLinhaExercicio(ex));
  } else {
    modalTitulo.textContent = 'Novo treino';
    inputNome.value = '';
    adicionarLinhaExercicio();
  }
  modal.classList.remove('hidden');
  inputNome.focus();
}

function fecharEditor() {
  modal.classList.add('hidden');
  editandoId = null;
}

function adicionarLinhaExercicio(dados = {}) {
  const div = document.createElement('div');
  div.className = 'exercicio-editor';
  const opcoesGrupo = GRUPOS.map(
    (g) => `<option value="${g}" ${dados.grupo === g ? 'selected' : ''}>${g}</option>`
  ).join('');
  div.innerHTML = `
    <div class="linha">
      <input type="text" class="ex-nome" placeholder="Nome do exercício" value="${escapar(dados.nome || '')}" />
      <button class="remover-ex" title="Remover">×</button>
    </div>
    <div class="campo-duplo">
      <label class="campo-grupo">Grupo muscular
        <select class="ex-grupo">
          <option value="">— selecione —</option>
          ${opcoesGrupo}
        </select>
      </label>
      <label class="campo-grupo">Exercício (lista)
        <select class="ex-sugestao"></select>
      </label>
    </div>
    <div class="nums">
      <label>Séries<input type="number" class="ex-series" min="1" value="${dados.series ?? 3}" /></label>
      <label>Reps<input type="number" class="ex-reps" min="1" value="${dados.reps ?? 10}" /></label>
      <label>Carga (kg)<input type="number" class="ex-carga" min="0" step="0.5" value="${dados.carga ?? 0}" /></label>
      <label>Peso da máquina<input type="number" class="ex-maquina" min="0" step="0.5" value="${dados.pesoMaquina ?? 0}" /></label>
    </div>
  `;

  const grupoSel = div.querySelector('.ex-grupo');
  const sugestaoSel = div.querySelector('.ex-sugestao');
  const nomeInput = div.querySelector('.ex-nome');

  // Preenche a lista de exercícios conforme o grupo selecionado
  function popularSugestoes() {
    sugestaoSel.innerHTML = opcoesExercicios(grupoSel.value, dados.nome, '— escolher da lista —');
    sugestaoSel.disabled = listaExercicios(grupoSel.value).length === 0;
  }
  popularSugestoes();

  grupoSel.onchange = () => { popularSugestoes(); };
  // Ao escolher da lista, preenche o nome (mas o campo de texto continua editável)
  sugestaoSel.onchange = () => {
    if (sugestaoSel.value) nomeInput.value = sugestaoSel.value;
  };

  div.querySelector('.remover-ex').onclick = () => div.remove();
  editorExerciciosEl.appendChild(div);
}

function salvarTreino() {
  const nome = inputNome.value.trim();
  if (!nome) { alert('Dê um nome ao treino.'); return; }
  const exercicios = [];
  editorExerciciosEl.querySelectorAll('.exercicio-editor').forEach((el) => {
    const exNome = el.querySelector('.ex-nome').value.trim();
    if (!exNome) return;
    exercicios.push({
      nome: exNome,
      grupo: el.querySelector('.ex-grupo').value,
      series: Math.max(1, parseInt(el.querySelector('.ex-series').value) || 1),
      reps: Math.max(1, parseInt(el.querySelector('.ex-reps').value) || 1),
      carga: Math.max(0, parseFloat(el.querySelector('.ex-carga').value) || 0),
      pesoMaquina: Math.max(0, parseFloat(el.querySelector('.ex-maquina').value) || 0),
    });
  });
  if (exercicios.length === 0) { alert('Adicione ao menos um exercício.'); return; }

  if (editandoId) {
    const t = treinos.find((x) => x.id === editandoId);
    t.nome = nome;
    t.exercicios = exercicios;
  } else {
    treinos.push({ id: novoId(), nome, exercicios });
  }
  salvar(STORAGE.treinos, treinos);
  fecharEditor();
  renderTreinos();
  toast('Treino salvo!');
}

// =====================================================================
// SESSÃO — executar treino (dentro de "Treino de Hoje")
// =====================================================================
const seletorEl = document.getElementById('hoje-seletor');
const sessaoAtivaEl = document.getElementById('sessao-ativa');
const sessaoExerciciosEl = document.getElementById('sessao-exercicios');
const cronTotalEl = document.getElementById('cron-total');
const cronDescansoEl = document.getElementById('cron-descanso');
const descansoBtn = document.getElementById('descanso-btn');
const sessGrupoSel = document.getElementById('sess-grupo');
const sessSugestaoSel = document.getElementById('sess-sugestao');

const PASSO_DESCANSO = 15; // segundos por clique nas setas
let descansoAlvo = Math.max(15, carregar(STORAGE.descansoAlvo, 90)); // segundos (padrão 1:30)
let descansoFim = null;   // timestamp em que a contagem regressiva termina

document.getElementById('cancelar-sessao-btn').onclick = cancelarSessao;
document.getElementById('finalizar-sessao-btn').onclick = finalizarSessao;
document.getElementById('treino-livre-btn').onclick = iniciarSessaoLivre;
descansoBtn.onclick = iniciarDescanso;
document.getElementById('add-ex-sessao-btn').onclick = adicionarExercicioSessao;
const descansoMaisBtn = document.getElementById('descanso-mais');
const descansoMenosBtn = document.getElementById('descanso-menos');
const descansoResetBtn = document.getElementById('descanso-reset');
descansoMaisBtn.onclick = () => ajustarDescanso(PASSO_DESCANSO);
descansoMenosBtn.onclick = () => ajustarDescanso(-PASSO_DESCANSO);
descansoResetBtn.onclick = resetarDescanso;
setDescansoEditavel(true);

// Aumenta/diminui o tempo de descanso pelas setas (só quando está parado)
function ajustarDescanso(delta) {
  descansoAlvo = Math.max(15, descansoAlvo + delta);
  salvar(STORAGE.descansoAlvo, descansoAlvo);
  descansoBtn.classList.remove('fim');
  mostrarDescansoParado();
}

// Habilita/bloqueia a edição: enquanto conta, não dá pra editar; o reset fica ativo
function setDescansoEditavel(editavel) {
  descansoMaisBtn.disabled = !editavel;
  descansoMenosBtn.disabled = !editavel;
  descansoResetBtn.disabled = editavel;
}

// Reseta a contagem regressiva, voltando ao tempo alvo (parado)
function resetarDescanso() {
  descansoFim = null;
  descansoBtn.classList.remove('ativo', 'fim');
  setDescansoEditavel(true);
  mostrarDescansoParado();
}

// Preenche o seletor de grupo da sessão e popula os exercícios conforme o grupo
sessGrupoSel.innerHTML = '<option value="">Grupo muscular</option>' +
  GRUPOS.map((g) => `<option value="${g}">${g}</option>`).join('');
sessGrupoSel.onchange = () => {
  sessSugestaoSel.innerHTML = opcoesExercicios(sessGrupoSel.value, '', 'Exercício');
  sessSugestaoSel.disabled = listaExercicios(sessGrupoSel.value).length === 0;
};

function fmtTempo(seg) {
  const m = String(Math.floor(seg / 60)).padStart(2, '0');
  const s = String(seg % 60).padStart(2, '0');
  return `${m}:${s}`;
}

// Inicia a partir de um treino salvo
function iniciarSessao(treino) {
  sessaoAtual = {
    treinoId: treino.id,
    nome: treino.nome,
    inicio: Date.now(),
    exercicios: treino.exercicios.map((ex) => ({
      nome: ex.nome,
      grupo: ex.grupo || '',
      reps: ex.reps,
      cargaAlvo: ex.carga,
      pesoMaquina: ex.pesoMaquina || 0,
      series: Array.from({ length: ex.series }, () => ({
        reps: ex.reps,
        carga: ex.carga,
        feita: false,
      })),
    })),
  };
  abrirSessao(treino.nome);
}

// Inicia um treino livre, sem nome e sem exercícios
function iniciarSessaoLivre() {
  sessaoAtual = {
    treinoId: null,
    nome: 'Treino livre',
    inicio: Date.now(),
    exercicios: [],
  };
  abrirSessao('Treino livre');
}

function abrirSessao(titulo) {
  document.getElementById('sessao-titulo').textContent = titulo;
  sessGrupoSel.value = '';
  sessSugestaoSel.innerHTML = '<option value="">Exercício</option>';
  sessSugestaoSel.disabled = true;
  descansoFim = null;
  descansoBtn.classList.remove('ativo', 'fim');
  setDescansoEditavel(true);
  mostrarDescansoParado();
  trocarAba('hoje');
  renderSessaoAtiva();
  iniciarCronometro();
}

// Adiciona um exercício escolhido na lista durante a sessão
function adicionarExercicioSessao() {
  const nome = sessSugestaoSel.value;
  if (!nome) { alert('Escolha o grupo e o exercício na lista.'); return; }
  sessaoAtual.exercicios.push({
    nome,
    grupo: sessGrupoSel.value,
    reps: 10,
    cargaAlvo: 0,
    pesoMaquina: 0,
    series: [{ reps: 10, carga: 0, feita: false }],
  });
  sessGrupoSel.value = '';
  sessSugestaoSel.innerHTML = '<option value="">Exercício</option>';
  sessSugestaoSel.disabled = true;
  renderSessaoAtiva();
}

// Adiciona uma série (faixa) ao exercício, repetindo os valores da última
function adicionarSerie(ei) {
  const ex = sessaoAtual.exercicios[ei];
  const ult = ex.series[ex.series.length - 1] || { reps: ex.reps || 10, carga: 0 };
  ex.series.push({ reps: ult.reps, carga: ult.carga, feita: false });
  renderSessaoAtiva();
}

function removerSerie(ei, si) {
  sessaoAtual.exercicios[ei].series.splice(si, 1);
  renderSessaoAtiva();
}

function removerExercicioSessao(ei) {
  sessaoAtual.exercicios.splice(ei, 1);
  renderSessaoAtiva();
}

function renderSessaoAtiva() {
  seletorEl.classList.add('hidden');
  sessaoAtivaEl.classList.remove('hidden');
  sessaoExerciciosEl.innerHTML = '';

  if (sessaoAtual.exercicios.length === 0) {
    sessaoExerciciosEl.innerHTML =
      '<p class="muted" style="text-align:center">Adicione um exercício abaixo para começar ↓</p>';
  }

  sessaoAtual.exercicios.forEach((ex, ei) => {
    const bloco = document.createElement('div');
    bloco.className = 'sessao-ex';
    const series = ex.series
      .map(
        (s, si) => `
        <div class="serie-row ${s.feita ? 'done' : ''}">
          <span class="idx">${si + 1}</span>
          <input type="number" class="s-carga" data-ei="${ei}" data-si="${si}" value="${s.carga}" min="0" step="0.5" />
          <input type="number" class="s-reps" data-ei="${ei}" data-si="${si}" value="${s.reps}" min="0" />
          <input type="checkbox" class="serie-check" data-ei="${ei}" data-si="${si}" ${s.feita ? 'checked' : ''} />
          <button class="remover-serie" data-ei="${ei}" data-si="${si}" title="Remover série">×</button>
        </div>`
      )
      .join('');
    bloco.innerHTML = `
      <div class="card-head">
        <h3>${escapar(ex.nome)}${ex.grupo ? `<span class="grupo-tag">${escapar(ex.grupo)}</span>` : ''}</h3>
        <button class="btn small danger remover-ex-sessao" data-ei="${ei}" title="Remover exercício">×</button>
      </div>
      <div class="serie-row cab"><span></span><span>carga (kg)</span><span>reps</span><span>ok</span><span></span></div>
      ${series}
      <div class="serie-add">
        <button class="btn small add-serie" data-ei="${ei}">+ série</button>
      </div>
    `;
    sessaoExerciciosEl.appendChild(bloco);
  });

  // Inputs de carga/reps
  sessaoExerciciosEl.querySelectorAll('.s-carga, .s-reps').forEach((inp) => {
    inp.onchange = () => {
      const s = sessaoAtual.exercicios[inp.dataset.ei].series[inp.dataset.si];
      if (inp.classList.contains('s-carga')) s.carga = parseFloat(inp.value) || 0;
      else s.reps = parseInt(inp.value) || 0;
    };
  });
  // Marcar série feita -> reinicia o cronômetro de descanso
  sessaoExerciciosEl.querySelectorAll('.serie-check').forEach((chk) => {
    chk.onchange = () => {
      sessaoAtual.exercicios[chk.dataset.ei].series[chk.dataset.si].feita = chk.checked;
      chk.closest('.serie-row').classList.toggle('done', chk.checked);
      if (chk.checked) iniciarDescanso();
    };
  });
  // Botões de série / exercício
  sessaoExerciciosEl.querySelectorAll('.add-serie').forEach((b) => {
    b.onclick = () => adicionarSerie(+b.dataset.ei);
  });
  sessaoExerciciosEl.querySelectorAll('.remover-serie').forEach((b) => {
    b.onclick = () => removerSerie(+b.dataset.ei, +b.dataset.si);
  });
  sessaoExerciciosEl.querySelectorAll('.remover-ex-sessao').forEach((b) => {
    b.onclick = () => removerExercicioSessao(+b.dataset.ei);
  });
}

// ---- Cronômetros: total do treino (progressivo) + descanso (regressivo) ----
function iniciarCronometro() {
  clearInterval(cronometroId);
  tickCronometros();
  cronometroId = setInterval(tickCronometros, 250);
}
function tickCronometros() {
  if (!sessaoAtual) return;
  cronTotalEl.textContent = fmtTempo(Math.floor((Date.now() - sessaoAtual.inicio) / 1000));
  if (descansoFim) {
    const restanteMs = descansoFim - Date.now();
    if (restanteMs <= 0) {
      cronDescansoEl.textContent = '00:00';
      finalizarDescanso();
    } else {
      cronDescansoEl.textContent = fmtTempo(Math.ceil(restanteMs / 1000));
    }
  }
  if (pipAtivo) desenharPip();
}

// Inicia/reinicia a contagem regressiva do descanso a partir do tempo alvo
function iniciarDescanso() {
  descansoFim = Date.now() + descansoAlvo * 1000;
  descansoBtn.classList.add('ativo');
  descansoBtn.classList.remove('fim');
  cronDescansoEl.textContent = fmtTempo(descansoAlvo);
  setDescansoEditavel(false);
}

// Chamado quando a contagem chega a zero
function finalizarDescanso() {
  descansoFim = null;
  descansoBtn.classList.remove('ativo');
  descansoBtn.classList.add('fim');
  setDescansoEditavel(true);
  beepDescanso();
  toast('Descanso acabou! Bora pra próxima');
}

// Mostra o tempo alvo parado (quando não está em contagem)
function mostrarDescansoParado() {
  if (!descansoFim) cronDescansoEl.textContent = fmtTempo(descansoAlvo);
}

// Bip + vibração ao terminar o descanso
function beepDescanso() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.type = 'sine';
    o.frequency.value = 880;
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
    o.start();
    o.stop(ctx.currentTime + 0.6);
  } catch { /* navegador sem áudio */ }
  if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
}

// ---- Cronômetro flutuante (Picture-in-Picture) sobre outros apps ----
const pipBtn = document.getElementById('pip-btn');
const pipCanvas = document.getElementById('pip-canvas');
const pipVideo = document.getElementById('pip-video');
const pipCtx = pipCanvas.getContext('2d');
let pipAtivo = false;

pipBtn.onclick = alternarPip;
pipVideo.addEventListener('leavepictureinpicture', () => { pipAtivo = false; });

async function alternarPip() {
  if (!document.pictureInPictureEnabled) {
    alert('Seu navegador não suporta o cronômetro flutuante. Use o Chrome no Android.');
    return;
  }
  try {
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
      pipAtivo = false;
      return;
    }
    desenharPip();
    if (!pipVideo.srcObject) pipVideo.srcObject = pipCanvas.captureStream(2);
    await pipVideo.play();
    await pipVideo.requestPictureInPicture();
    pipAtivo = true;
  } catch (e) {
    alert('Não consegui abrir o cronômetro flutuante: ' + e.message);
  }
}

// Desenha o cronômetro na mini-janela flutuante
function desenharPip() {
  const w = pipCanvas.width, h = pipCanvas.height;
  const ativo = descansoBtn.classList.contains('ativo');
  const fim = descansoBtn.classList.contains('fim');

  pipCtx.fillStyle = '#000000';
  pipCtx.fillRect(0, 0, w, h);
  pipCtx.textAlign = 'center';

  pipCtx.fillStyle = '#a8794f';
  pipCtx.font = '700 26px Nunito, sans-serif';
  pipCtx.fillText('DESCANSO', w / 2, 50);

  pipCtx.fillStyle = fim ? '#ff5a6e' : (ativo ? '#ffb24f' : '#ff7a18');
  if (fim) {
    pipCtx.font = '800 66px Nunito, sans-serif';
    pipCtx.fillText('ACABOU', w / 2, h / 2 + 28);
  } else {
    pipCtx.font = '800 96px Nunito, sans-serif';
    pipCtx.fillText(cronDescansoEl.textContent, w / 2, h / 2 + 34);
  }

  pipCtx.fillStyle = '#a8794f';
  pipCtx.font = '600 26px Nunito, sans-serif';
  pipCtx.fillText('Treino  ' + cronTotalEl.textContent, w / 2, h - 28);
}

function cancelarSessao() {
  if (!confirm('Cancelar a sessão? O progresso não será salvo.')) return;
  encerrarSessao();
  renderTreinos();
}

function finalizarSessao() {
  if (sessaoAtual.exercicios.length === 0) {
    alert('Adicione ao menos um exercício antes de finalizar.');
    return;
  }
  if (!confirm('Deseja finalizar e salvar este treino?')) return;
  const totalSeries = sessaoAtual.exercicios.reduce((acc, ex) => acc + ex.series.length, 0);
  const feitas = sessaoAtual.exercicios.reduce(
    (acc, ex) => acc + ex.series.filter((s) => s.feita).length, 0
  );
  const volume = sessaoAtual.exercicios.reduce(
    (acc, ex) => acc + ex.series.filter((s) => s.feita).reduce((a, s) => a + s.carga * s.reps, 0), 0
  );

  historico.unshift({
    id: novoId(),
    nome: sessaoAtual.nome || 'Treino livre',
    data: Date.now(),
    duracaoSeg: Math.floor((Date.now() - sessaoAtual.inicio) / 1000),
    seriesFeitas: feitas,
    seriesTotal: totalSeries,
    volume: Math.round(volume),
    exercicios: sessaoAtual.exercicios.map((ex) => ({
      nome: ex.nome,
      grupo: ex.grupo || '',
      series: ex.series.map((s) => ({ carga: s.carga, reps: s.reps, feita: s.feita })),
    })),
  });
  salvar(STORAGE.historico, historico);
  encerrarSessao();
  trocarAba('concluidos');
  toast('Sessão registrada!');
}

// Reabre uma sessão concluída para continuar de onde parou
function reabrirSessao(h) {
  if (sessaoAtual) {
    alert('Finalize ou cancele o treino atual antes de reabrir outro.');
    return;
  }
  if (!confirm('Reabrir este treino para continuar?')) return;

  // Tira do histórico e reconstrói como sessão ativa (mantendo o tempo já decorrido)
  historico = historico.filter((x) => x.id !== h.id);
  salvar(STORAGE.historico, historico);

  sessaoAtual = {
    treinoId: null,
    nome: h.nome,
    inicio: Date.now() - (h.duracaoSeg || 0) * 1000,
    exercicios: h.exercicios.map((ex) => ({
      nome: ex.nome,
      grupo: ex.grupo || '',
      reps: ex.series[0] ? ex.series[0].reps : 10,
      cargaAlvo: ex.series[0] ? ex.series[0].carga : 0,
      pesoMaquina: 0,
      series: ex.series.map((s) => ({ carga: s.carga, reps: s.reps, feita: s.feita })),
    })),
  };
  abrirSessao(h.nome);
}

function encerrarSessao() {
  clearInterval(cronometroId);
  cronometroId = null;
  sessaoAtual = null;
  descansoFim = null;
  cronTotalEl.textContent = '00:00';
  descansoBtn.classList.remove('ativo', 'fim');
  setDescansoEditavel(true);
  mostrarDescansoParado();
  sessaoAtivaEl.classList.add('hidden');
  seletorEl.classList.remove('hidden');
}

// =====================================================================
// SUGESTÃO DE TREINO — modelos prontos
// =====================================================================
const listaSugestoesEl = document.getElementById('lista-sugestoes');
const filtroSugestoesEl = document.getElementById('filtro-sugestoes');

function renderFiltroSugestoes() {
  const categorias = [...new Set(TREINOS_SUGERIDOS.map((s) => s.categoria))];
  filtroSugestoesEl.innerHTML = '';
  const criarChip = (rotulo, valor) => {
    const chip = document.createElement('button');
    chip.className = 'chip' + (filtroSugestao === valor ? ' active' : '');
    chip.textContent = rotulo;
    chip.onclick = () => { filtroSugestao = valor; renderSugestoes(); };
    filtroSugestoesEl.appendChild(chip);
  };
  criarChip('Todas', null);
  categorias.forEach((c) => criarChip(c, c));
}

function renderSugestoes() {
  renderFiltroSugestoes();
  listaSugestoesEl.innerHTML = '';

  const visiveis = filtroSugestao
    ? TREINOS_SUGERIDOS.filter((s) => s.categoria === filtroSugestao)
    : TREINOS_SUGERIDOS;

  visiveis.forEach((s) => {
    const card = document.createElement('div');
    card.className = 'card';
    const itens = s.exercicios
      .map(
        (ex) =>
          `<li><span>${escapar(ex.nome)}<span class="grupo-tag">${escapar(ex.grupo)}</span></span> <span>${ex.series}×${ex.reps}</span></li>`
      )
      .join('');
    card.innerHTML = `
      <div class="card-head">
        <div>
          <h3>${escapar(s.nome)}</h3>
          <div class="card-meta">${escapar(s.categoria)} • ${s.exercicios.length} exercício(s)</div>
        </div>
        <button class="btn primary small">+ Adicionar</button>
      </div>
      <ul class="exercicio-resumo">${itens}</ul>
    `;
    card.querySelector('button').onclick = () => adicionarSugestao(s);
    listaSugestoesEl.appendChild(card);
  });
}

function adicionarSugestao(sugestao) {
  treinos.push({
    id: novoId(),
    nome: sugestao.nome,
    exercicios: sugestao.exercicios.map((ex) => ({
      nome: ex.nome,
      grupo: ex.grupo,
      series: ex.series,
      reps: ex.reps,
      carga: 0,
      pesoMaquina: 0,
    })),
  });
  salvar(STORAGE.treinos, treinos);
  renderTreinos();
  toast('Treino adicionado aos seus! Ajuste as cargas no editor.');
}

// =====================================================================
// TREINOS CONCLUÍDOS (histórico)
// =====================================================================
const listaHistoricoEl = document.getElementById('lista-historico');
const historicoVazioEl = document.getElementById('historico-vazio');

document.getElementById('limpar-historico-btn').onclick = () => {
  if (!historico.length) return;
  if (!confirm('Apagar todo o histórico?')) return;
  historico = [];
  salvar(STORAGE.historico, historico);
  renderHistorico();
};

// ---- Dashboard (calendário do mês + faixa da semana) ----
const _agora = new Date();
let calAno = _agora.getFullYear();
let calMes = _agora.getMonth();

const NOMES_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

document.getElementById('mes-anterior').onclick = () => {
  if (--calMes < 0) { calMes = 11; calAno--; }
  renderDashboard();
};
document.getElementById('mes-proximo').onclick = () => {
  if (++calMes > 11) { calMes = 0; calAno++; }
  renderDashboard();
};

function chaveDia(ts) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

// Mapa: chaveDia -> lista de nomes de treinos concluídos naquele dia
function sessoesPorDia() {
  const mapa = {};
  historico.forEach((h) => {
    const k = chaveDia(h.data);
    (mapa[k] = mapa[k] || []).push(h.nome);
  });
  return mapa;
}

function renderDashboard() {
  const mapa = sessoesPorDia();
  const hoje = new Date();
  const hojeK = `${hoje.getFullYear()}-${hoje.getMonth()}-${hoje.getDate()}`;

  // --- Calendário do mês ---
  const titulo = new Date(calAno, calMes, 1).toLocaleDateString('pt-BR', {
    month: 'long', year: 'numeric',
  });
  document.getElementById('mes-titulo').textContent = titulo;

  const primeiroDia = new Date(calAno, calMes, 1).getDay();
  const diasNoMes = new Date(calAno, calMes + 1, 0).getDate();
  const cal = document.getElementById('calendario');
  cal.innerHTML = '';

  for (let i = 0; i < primeiroDia; i++) {
    const vazio = document.createElement('div');
    vazio.className = 'cal-cell empty';
    cal.appendChild(vazio);
  }

  let totalMes = 0;
  for (let dia = 1; dia <= diasNoMes; dia++) {
    const k = `${calAno}-${calMes}-${dia}`;
    const treinou = !!mapa[k];
    if (treinou) totalMes += mapa[k].length;
    const cell = document.createElement('div');
    cell.className = 'cal-cell' + (treinou ? ' treinou' : '') + (k === hojeK ? ' hoje' : '');
    cell.innerHTML = `${dia}${treinou ? '<span class="dot">●</span>' : ''}`;
    if (treinou) cell.title = mapa[k].join(', ');
    cal.appendChild(cell);
  }

  document.getElementById('mes-resumo').textContent =
    totalMes > 0 ? `${totalMes} treino(s) concluído(s) neste mês` : 'Nenhum treino concluído neste mês';

  // --- Faixa da semana atual ---
  const inicioSemana = new Date(hoje);
  inicioSemana.setHours(0, 0, 0, 0);
  inicioSemana.setDate(hoje.getDate() - hoje.getDay()); // domingo
  const semanaEl = document.getElementById('semana');
  semanaEl.innerHTML = '';

  for (let i = 0; i < 7; i++) {
    const d = new Date(inicioSemana);
    d.setDate(inicioSemana.getDate() + i);
    const k = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    const nomes = [...new Set(mapa[k] || [])];
    const ehHoje = k === hojeK;
    const div = document.createElement('div');
    div.className = 'week-day' + (nomes.length ? ' treinou' : '') + (ehHoje ? ' hoje' : '');
    div.innerHTML = `
      <div class="wd-nome">${NOMES_SEMANA[i]}</div>
      <div class="wd-num">${d.getDate()}</div>
      ${nomes.length
        ? `<div class="wd-treinos">${nomes.map((n) => escapar(n)).join('<br>')}</div>`
        : '<div class="wd-vazio">–</div>'}
    `;
    semanaEl.appendChild(div);
  }
}

function renderHistorico() {
  renderDashboard();
  listaHistoricoEl.innerHTML = '';
  historicoVazioEl.classList.toggle('hidden', historico.length > 0);

  historico.forEach((h) => {
    const card = document.createElement('div');
    card.className = 'card';
    const min = Math.floor(h.duracaoSeg / 60);
    const seg = h.duracaoSeg % 60;
    const exItens = h.exercicios
      .map((ex) => {
        const feitas = ex.series.filter((s) => s.feita).length;
        return `<li><span>${escapar(ex.nome)}</span> <span>${feitas}/${ex.series.length} séries</span></li>`;
      })
      .join('');
    card.innerHTML = `
      <div class="card-head">
        <div>
          <h3>${escapar(h.nome)}</h3>
          <div class="card-meta">${formatarData(h.data)} • ${min}m${seg}s</div>
        </div>
        <div class="card-actions">
          <button class="btn small" data-acao="reabrir">Reabrir</button>
          <button class="btn small danger" data-acao="excluir" title="Excluir">×</button>
        </div>
      </div>
      <div class="card-meta" style="margin-top:8px">
        ${h.seriesFeitas}/${h.seriesTotal} séries &nbsp;•&nbsp; ${h.volume} kg de volume
      </div>
      <ul class="exercicio-resumo">${exItens}</ul>
    `;
    card.querySelector('[data-acao="reabrir"]').onclick = () => reabrirSessao(h);
    card.querySelector('[data-acao="excluir"]').onclick = () => {
      historico = historico.filter((x) => x.id !== h.id);
      salvar(STORAGE.historico, historico);
      renderHistorico();
    };
    listaHistoricoEl.appendChild(card);
  });
}

// =====================================================================
// RESULTADOS — estatísticas
// =====================================================================
const resumoStatsEl = document.getElementById('resumo-stats');
const volumeGruposEl = document.getElementById('volume-grupos');
const recordesEl = document.getElementById('recordes');
const resultadosVazioEl = document.getElementById('resultados-vazio');

function renderResultados() {
  const vazio = historico.length === 0;
  resultadosVazioEl.classList.toggle('hidden', !vazio);
  resumoStatsEl.classList.toggle('hidden', vazio);
  document.querySelectorAll('#resultados h3').forEach((h) => h.classList.toggle('hidden', vazio));
  if (vazio) {
    resumoStatsEl.innerHTML = '';
    volumeGruposEl.innerHTML = '';
    recordesEl.innerHTML = '';
    return;
  }

  const totalSessoes = historico.length;
  const volumeTotal = historico.reduce((a, h) => a + (h.volume || 0), 0);
  const tempoTotal = historico.reduce((a, h) => a + (h.duracaoSeg || 0), 0);
  const seriesTotal = historico.reduce((a, h) => a + (h.seriesFeitas || 0), 0);

  resumoStatsEl.innerHTML = `
    ${statCard(totalSessoes, 'Sessões')}
    ${statCard(volumeTotal.toLocaleString('pt-BR') + ' kg', 'Volume total')}
    ${statCard(Math.round(tempoTotal / 60) + ' min', 'Tempo total')}
    ${statCard(seriesTotal, 'Séries feitas')}
  `;

  // Volume por grupo muscular
  const porGrupo = {};
  historico.forEach((h) =>
    h.exercicios.forEach((ex) => {
      const g = ex.grupo || 'Sem grupo';
      const vol = ex.series.filter((s) => s.feita).reduce((a, s) => a + s.carga * s.reps, 0);
      porGrupo[g] = (porGrupo[g] || 0) + vol;
    })
  );
  const entradas = Object.entries(porGrupo).sort((a, b) => b[1] - a[1]);
  const maxVol = Math.max(...entradas.map((e) => e[1]), 1);
  volumeGruposEl.innerHTML = entradas
    .map(([g, v]) => `
      <div class="bar-row">
        <div class="bar-top"><span>${escapar(g)}</span><span>${Math.round(v).toLocaleString('pt-BR')} kg</span></div>
        <div class="bar-track"><div class="bar-fill" style="width:${(v / maxVol) * 100}%"></div></div>
      </div>`)
    .join('');

  // Recordes de carga (maior carga usada por exercício, em série concluída)
  const recordes = {};
  historico.forEach((h) =>
    h.exercicios.forEach((ex) =>
      ex.series.filter((s) => s.feita).forEach((s) => {
        if (!recordes[ex.nome] || s.carga > recordes[ex.nome]) recordes[ex.nome] = s.carga;
      })
    )
  );
  const recEntradas = Object.entries(recordes).filter(([, c]) => c > 0).sort((a, b) => b[1] - a[1]);
  recordesEl.innerHTML = recEntradas.length
    ? recEntradas
        .map(([nome, carga]) => `
          <div class="card">
            <div class="card-head">
              <h3>${escapar(nome)}</h3>
              <strong style="color:var(--success)">${carga} kg</strong>
            </div>
          </div>`)
        .join('')
    : '<p class="muted">Marque séries com carga para registrar recordes.</p>';
}

function statCard(num, lbl) {
  return `<div class="stat-card"><div class="num">${num}</div><div class="lbl">${lbl}</div></div>`;
}

// =====================================================================
// DIETA — registro de alimentos do dia
// =====================================================================
const listaDietaEl = document.getElementById('lista-dieta');
const dietaVazioEl = document.getElementById('dieta-vazio');
const dietaTotalEl = document.getElementById('dieta-total');
const dietaBarraEl = document.getElementById('dieta-barra');
const metaInput = document.getElementById('meta-kcal');

metaInput.value = metaKcal || '';
metaInput.addEventListener('input', () => {
  metaKcal = Math.max(0, parseInt(metaInput.value) || 0);
  salvar(STORAGE.metaKcal, metaKcal);
  renderDieta();
});

document.getElementById('add-alimento-btn').onclick = adicionarAlimento;
document.getElementById('dieta-kcal').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') adicionarAlimento();
});

function diaDeHoje() {
  return new Date().toDateString();
}

function adicionarAlimento() {
  const nomeEl = document.getElementById('dieta-nome');
  const kcalEl = document.getElementById('dieta-kcal');
  const nome = nomeEl.value.trim();
  const kcal = Math.max(0, parseInt(kcalEl.value) || 0);
  if (!nome) { alert('Informe o alimento.'); return; }
  dieta.unshift({ id: novoId(), nome, kcal, dia: diaDeHoje() });
  salvar(STORAGE.dieta, dieta);
  nomeEl.value = '';
  kcalEl.value = '';
  nomeEl.focus();
  renderDieta();
}

function renderDieta() {
  const itensHoje = dieta.filter((d) => d.dia === diaDeHoje());
  listaDietaEl.innerHTML = '';
  dietaVazioEl.classList.toggle('hidden', itensHoje.length > 0);

  const total = itensHoje.reduce((a, d) => a + d.kcal, 0);

  if (metaKcal > 0) {
    const pct = Math.min(100, (total / metaKcal) * 100);
    dietaBarraEl.style.width = pct + '%';
    dietaBarraEl.classList.toggle('over', total > metaKcal);
    dietaTotalEl.textContent = `${total.toLocaleString('pt-BR')} / ${metaKcal.toLocaleString('pt-BR')} kcal hoje` +
      (total > metaKcal ? ` — ${(total - metaKcal).toLocaleString('pt-BR')} acima da meta` : '');
  } else {
    dietaBarraEl.style.width = '0%';
    dietaTotalEl.textContent = `${total.toLocaleString('pt-BR')} kcal hoje (defina uma meta acima)`;
  }

  itensHoje.forEach((d) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-head">
        <div><h3>${escapar(d.nome)}</h3></div>
        <div class="card-actions">
          <strong>${d.kcal.toLocaleString('pt-BR')} kcal</strong>
          <button class="btn small danger" title="Remover">×</button>
        </div>
      </div>
    `;
    card.querySelector('button').onclick = () => {
      dieta = dieta.filter((x) => x.id !== d.id);
      salvar(STORAGE.dieta, dieta);
      renderDieta();
    };
    listaDietaEl.appendChild(card);
  });
}

// =====================================================================
// Utilidades
// =====================================================================
function escapar(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function formatarData(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
  });
}

let toastTimer = null;
function toast(msg) {
  let el = document.querySelector('.toast');
  if (el) el.remove();
  el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  document.body.appendChild(el);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.remove(), 2500);
}

// ---- PWA: registra o service worker (só quando servido via http/https) ----
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => { /* ignora se falhar */ });
  });
}

// ---- Inicialização ----
renderTreinos();
