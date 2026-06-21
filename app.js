// ===== Meu Treino — app de academia (HTML/CSS/JS + localStorage) =====

const STORAGE = {
  treinos: 'mt_treinos',
  historico: 'mt_historico',
  dieta: 'mt_dieta',
  metaKcal: 'mt_meta_kcal',
  descansoAlvo: 'mt_descanso_alvo',
  metaAgua: 'mt_meta_agua',
  aguaHoje: 'mt_agua_hoje',
  aguaLembrete: 'mt_agua_lembrete',
  catalogo: 'mt_catalogo',
  custom: 'mt_exercicios_custom',
};

// Grupos musculares (derivados do catálogo ativo, definidos mais abaixo)
let GRUPOS = [];

// Catálogo PADRÃO de exercícios por grupo (lista pronta para selecionar sem digitar)
const CATALOGO_PADRAO = {
  'Peito (Peitoral)': {
    'Halteres / Barra': ['Supino reto', 'Supino inclinado', 'Supino declinado', 'Supino com halteres (reto/inclinado/declinado)', 'Crucifixo (reto/inclinado/declinado)', 'Pullover com halter'],
    'Máquina': ['Supino máquina (Hammer/articulado)', 'Peck deck (voador)', 'Supino inclinado máquina'],
    'Polia': ['Crossover (alto, médio, baixo)', 'Crucifixo na polia', 'Supino na polia'],
  },
  'Costas (Dorsais)': {
    'Halteres / Barra': ['Remada curvada com barra', 'Remada cavalinho (T-bar)', 'Remada unilateral com halter (serrote)', 'Levantamento terra', 'Barra fixa (peso corporal/lastro)'],
    'Máquina': ['Remada máquina (articulada)', 'Pulldown máquina', 'Remada baixa máquina', 'Hiperextensão (banco romano)'],
    'Polia': ['Puxada frontal (pegada aberta/supinada/neutra/triângulo)', 'Remada baixa (sentado)', 'Pullover na polia', 'Remada alta na polia', 'Face pull'],
  },
  'Ombros (Deltóides) e Trapézio': {
    'Halteres / Barra': ['Desenvolvimento militar (barra/halteres)', 'Elevação lateral', 'Elevação frontal', 'Elevação posterior (crucifixo inverso)', 'Remada alta', 'Arnold press', 'Encolhimento com barra', 'Encolhimento com halteres'],
    'Máquina': ['Desenvolvimento máquina', 'Elevação lateral máquina', 'Peck deck inverso (posterior)', 'Encolhimento na máquina (Hammer/Smith)'],
    'Polia': ['Elevação lateral na polia', 'Elevação frontal na polia', 'Crucifixo inverso na polia', 'Face pull', 'Remada alta na polia', 'Encolhimento na polia'],
  },
  'Bíceps': {
    'Halteres / Barra': ['Rosca direta (barra reta/W)', 'Rosca alternada', 'Rosca martelo', 'Rosca concentrada', 'Rosca Scott (banco)', 'Rosca inclinada'],
    'Máquina': ['Rosca Scott máquina', 'Rosca bíceps máquina'],
    'Polia': ['Rosca na polia baixa (barra/corda)', 'Rosca martelo na corda', 'Rosca alta na polia'],
  },
  'Tríceps': {
    'Halteres / Barra': ['Tríceps testa (barra/halteres)', 'Tríceps francês', 'Supino fechado', 'Tríceps coice (kickback)', 'Mergulho/paralelas'],
    'Máquina': ['Tríceps máquina', 'Mergulho máquina'],
    'Polia': ['Tríceps pulley (barra reta/V/corda)', 'Tríceps unilateral', 'Tríceps invertido (pegada supinada)', 'Tríceps na polia por trás da cabeça'],
  },
  'Antebraço': {
    'Halteres / Barra': ['Rosca punho (flexora)', 'Rosca punho invertida (extensora)', 'Rosca inversa (pronada)', "Farmer's walk"],
    'Máquina': ['Rosca de punho máquina'],
    'Polia': ['Rosca de punho na polia'],
  },
  'Quadríceps': {
    'Halteres / Barra': ['Agachamento livre', 'Agachamento frontal', 'Afundo/passada', 'Agachamento búlgaro', 'Agachamento Smith', 'Hack com barra'],
    'Máquina': ['Leg press', 'Hack machine', 'Cadeira extensora', 'Agachamento máquina'],
    'Polia': ['Agachamento na polia (variação)', 'Afundo na polia'],
  },
  'Posteriores de coxa (Isquiotibiais)': {
    'Halteres / Barra': ['Stiff (terra romeno)', 'Levantamento terra', 'Good morning', 'Afundo (ênfase posterior)'],
    'Máquina': ['Mesa flexora (deitado)', 'Cadeira flexora (sentado)', 'Flexora em pé'],
    'Polia': ['Stiff na polia', 'Flexão de perna na polia (caneleira)'],
  },
  'Glúteos': {
    'Halteres / Barra': ['Elevação pélvica (hip thrust)', 'Agachamento sumô', 'Afundo', 'Stiff', 'Levantamento terra'],
    'Máquina': ['Hip thrust máquina', 'Glúteo máquina (coice)', 'Abdução máquina (cadeira abdutora)'],
    'Polia': ['Coice de glúteo na polia (caneleira)', 'Abdução na polia', 'Hip thrust na polia'],
  },
  'Adutores e Abdutores': {
    'Máquina': ['Cadeira adutora', 'Cadeira abdutora'],
    'Polia': ['Adução na polia (caneleira)', 'Abdução na polia (caneleira)'],
  },
  'Panturrilhas': {
    'Halteres / Barra': ['Panturrilha em pé com barra/halteres', 'Panturrilha sentado com halter'],
    'Máquina': ['Panturrilha em pé (gêmeos) máquina', 'Panturrilha sentado (sóleo) máquina', 'Panturrilha no leg press'],
    'Polia': ['Panturrilha na polia (variação)'],
  },
  'Abdômen / Core': {
    'Halteres / Barra': ['Abdominal com anilha', 'Prancha (peso corporal)', 'Russian twist com peso', 'Elevação de pernas'],
    'Máquina': ['Abdominal máquina', 'Máquina de oblíquos/rotação'],
    'Polia': ['Abdominal na polia (rosca/crunch ajoelhado)', 'Oblíquo na polia (pallof press, lenhador/wood chopper)'],
  },
};

// Catálogo ATIVO: usa o importado (localStorage) se existir, senão o padrão
let EXERCICIOS_POR_GRUPO = carregar(STORAGE.catalogo, CATALOGO_PADRAO);
GRUPOS = Object.keys(EXERCICIOS_POR_GRUPO);
// Exercícios personalizados (overlay por grupo) — sobrevivem a updates/imports
let exerciciosCustom = carregar(STORAGE.custom, {});

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
    nome: 'Costas e Bíceps (ABC - B)', categoria: 'Hipertrofia',
    exercicios: [
      { nome: 'Puxada frontal', grupo: 'Costas', series: 4, reps: 10 },
      { nome: 'Remada curvada', grupo: 'Costas', series: 3, reps: 10 },
      { nome: 'Remada baixa', grupo: 'Costas', series: 3, reps: 12 },
      { nome: 'Rosca direta', grupo: 'Bíceps', series: 3, reps: 12 },
      { nome: 'Rosca martelo', grupo: 'Bíceps', series: 3, reps: 12 },
    ],
  },
  {
    nome: 'Pernas e Ombros (ABC - C)', categoria: 'Hipertrofia',
    exercicios: [
      { nome: 'Agachamento livre', grupo: 'Quadríceps', series: 4, reps: 10 },
      { nome: 'Leg press', grupo: 'Quadríceps', series: 4, reps: 12 },
      { nome: 'Cadeira extensora', grupo: 'Quadríceps', series: 3, reps: 15 },
      { nome: 'Desenvolvimento', grupo: 'Ombros', series: 3, reps: 12 },
      { nome: 'Elevação lateral', grupo: 'Ombros', series: 3, reps: 15 },
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

// Expande "Base (a/b)" ou "Base (a, b)" em ["Base (a)", "Base (b)"] para selecionar cada variação
function expandirVariacoes(nome) {
  const m = String(nome).match(/^(.*?)\s*\(([^)]*[\/,][^)]*)\)\s*$/);
  if (!m) return [nome];
  const base = m[1].trim();
  const vars = m[2].split(/[\/,]/).map((s) => s.trim()).filter(Boolean);
  if (vars.length < 2) return [nome];
  return vars.map((v) => `${base} (${v})`);
}

// Lista plana de exercícios selecionáveis (variações expandidas + personalizados)
function listaExercicios(grupo) {
  const dados = EXERCICIOS_POR_GRUPO[grupo];
  const base = !dados ? [] : (Array.isArray(dados) ? dados : Object.values(dados).flat());
  return [...base.flatMap(expandirVariacoes), ...(exerciciosCustom[grupo] || [])];
}

// Monta o HTML de <option>/<optgroup> de um grupo (variações expandidas + personalizados)
function opcoesExercicios(grupo, selecionado, placeholder) {
  const dados = EXERCICIOS_POR_GRUPO[grupo];
  const opt = (e) => `<option value="${escapar(e)}" ${selecionado === e ? 'selected' : ''}>${escapar(e)}</option>`;
  const opts = (lista) => lista.flatMap(expandirVariacoes).map(opt).join('');
  let html = `<option value="">${placeholder}</option>`;
  if (dados) {
    if (Array.isArray(dados)) {
      html += opts(dados);
    } else {
      html += Object.entries(dados)
        .map(([sub, lista]) => `<optgroup label="${escapar(sub)}">${opts(lista)}</optgroup>`)
        .join('');
    }
  }
  const custom = exerciciosCustom[grupo] || [];
  if (custom.length) html += `<optgroup label="Personalizados">${custom.map(opt).join('')}</optgroup>`;
  return html;
}

// Salva um exercício personalizado na lista do grupo (persistente)
function adicionarExercicioCatalogo(grupo, nome) {
  if (!grupo || !nome) return 'erro';
  if (listaExercicios(grupo).includes(nome)) return 'dup';
  (exerciciosCustom[grupo] = exerciciosCustom[grupo] || []).push(nome);
  salvar(STORAGE.custom, exerciciosCustom);
  montarDatalistExercicios();
  return 'ok';
}

// Descobre a que grupo pertence um exercício (para autopreencher)
function grupoDoExercicio(nome) {
  for (const g of GRUPOS) {
    if (listaExercicios(g).includes(nome)) return g;
  }
  return '';
}

// Monta (uma vez) o <datalist> com TODOS os exercícios do catálogo
function montarDatalistExercicios() {
  let dl = document.getElementById('lista-todos-exercicios');
  if (!dl) {
    dl = document.createElement('datalist');
    dl.id = 'lista-todos-exercicios';
    document.body.appendChild(dl);
  }
  const vistos = new Set();
  const itens = [];
  for (const g of GRUPOS) {
    for (const nome of listaExercicios(g)) {
      if (vistos.has(nome)) continue;
      vistos.add(nome);
      itens.push(`<option value="${escapar(nome)}">${escapar(g)}</option>`);
    }
  }
  dl.innerHTML = itens.join('');
}

// ---- Estado em memória ----
let treinos = carregar(STORAGE.treinos, []);
let historico = carregar(STORAGE.historico, []);
let dieta = carregar(STORAGE.dieta, []);
let metaKcal = carregar(STORAGE.metaKcal, 0);
// Reseta sempre ao entrar na página (padrão fixo: 2,5 L / 500 ml / 90 min)
let metaAgua = 2500;
let aguaHoje = carregar(STORAGE.aguaHoje, { dia: '', ml: 0 }); // consumo do dia continua salvo
let lembreteAgua = { ml: 500, min: 90 };
let aguaLembreteFim = null;
let aguaLembreteId = null;
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
  // Esconde o cabeçalho (logo + busca) nas abas sem relação com treinos
  document.body.classList.toggle('sem-topo', nome === 'resultados' || nome === 'dieta');
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
    card.className = 'card treino-card';
    const itens = t.exercicios
      .map(
        (ex) =>
          `<li><span>${escapar(ex.nome)}${ex.grupo ? `<span class="grupo-tag">${escapar(ex.grupo)}</span>` : ''}</span> <span>${ex.series}×${ex.reps}${ex.carga ? ` • ${ex.carga}kg` : ''}${ex.pesoMaquina ? ` • máq.${ex.pesoMaquina}` : ''}</span></li>`
      )
      .join('');
    card.innerHTML = `
      <button class="card-x" data-acao="excluir" title="Excluir treino">×</button>
      <h3 class="treino-nome">${escapar(t.nome)}</h3>
      <div class="card-meta">${t.exercicios.length} exercício(s)</div>
      <ul class="exercicio-resumo">${itens}</ul>
      <div class="treino-acoes">
        <button class="btn primary small" data-acao="iniciar">Iniciar ▶</button>
        <button class="btn small" data-acao="programar">Programar</button>
        <button class="btn small icon-btn" data-acao="editar" title="Editar">
          <svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
        </button>
      </div>
    `;
    card.querySelector('[data-acao="iniciar"]').onclick = () => iniciarSessao(t);
    card.querySelector('[data-acao="programar"]').onclick = () => programarTreino(t.id);
    card.querySelector('[data-acao="editar"]').onclick = () => abrirEditor(t.id);
    card.querySelector('[data-acao="excluir"]').onclick = () => excluirTreino(t.id);
    listaTreinosEl.appendChild(card);
  });

  atualizarReabrirHoje();
  renderUltimosTreinos();
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

// Carrossel horizontal com os últimos treinos realizados (nome + data)
function renderUltimosTreinos() {
  const cont = document.getElementById('ultimos-treinos');
  const titulo = document.getElementById('ultimos-titulo');
  cont.innerHTML = '';
  titulo.classList.remove('hidden');
  cont.classList.remove('hidden');

  const card = (h) => {
    const el = document.createElement('div');
    el.className = 'mini-treino';
    el.innerHTML = `
      <div class="mini-nome">${escapar(h.nome)}</div>
      <div class="mini-data">${formatarData(h.data)}</div>
      <div class="mini-meta">${h.seriesFeitas}/${h.seriesTotal} séries • ${h.volume} kg</div>
    `;
    return el;
  };

  // Busca: treinos já realizados + sugestões de treino que combinam
  if (busca) {
    titulo.textContent = 'Resultados da busca';
    const feitos = historico.filter((h) => h.nome.toLowerCase().includes(busca)).slice(0, 20);
    const sugeridos = TREINOS_SUGERIDOS.filter((s) => {
      const hay = (s.nome + ' ' + s.categoria + ' ' +
        s.exercicios.map((e) => e.grupo + ' ' + e.nome).join(' ')).toLowerCase();
      return hay.includes(busca);
    });

    if (feitos.length === 0 && sugeridos.length === 0) {
      cont.innerHTML = '<div class="mini-treino mini-motiva"><div class="mini-motiva-txt">Nenhum treino encontrado.</div></div>';
      return;
    }

    feitos.forEach((h) => cont.appendChild(card(h)));
    sugeridos.forEach((s) => {
      const el = document.createElement('div');
      el.className = 'mini-treino mini-sugestao';
      el.innerHTML = `
        <div class="mini-tag">Sugestão</div>
        <div class="mini-nome">${escapar(s.nome)}</div>
        <div class="mini-motiva-txt">${s.exercicios.length} exercícios • ${escapar(s.categoria)}</div>
        <button class="btn primary small mini-add">+ Adicionar</button>
      `;
      el.querySelector('.mini-add').onclick = () => adicionarSugestao(s);
      cont.appendChild(el);
    });
    return;
  }

  titulo.textContent = 'Últimos treinos';
  const programados = treinos
    .filter((t) => t.dataProgramada)
    .sort((a, b) => a.dataProgramada.localeCompare(b.dataProgramada));
  const recentes = historico.slice(0, 15);

  // Usuário novo (nada feito e nada programado): quadro motivacional
  if (programados.length === 0 && recentes.length === 0) {
    const c = document.createElement('div');
    c.className = 'mini-treino mini-motiva';
    c.innerHTML = `<div class="mini-nome">Bora começar! 💪</div><div class="mini-motiva-txt">Toque em “Começar treino livre” e registre seu primeiro treino.</div>`;
    cont.appendChild(c);
    return;
  }

  // Treinos programados (próximos primeiro)
  programados.forEach((t) => {
    const el = document.createElement('div');
    el.className = 'mini-treino mini-prog';
    el.innerHTML = `
      <button class="mini-x" type="button" title="Excluir treino">×</button>
      <div class="mini-tag">Programado</div>
      <div class="mini-nome">${escapar(t.nome)}</div>
      <div class="mini-data">${isoParaDDMMYYYY(t.dataProgramada)}</div>
    `;
    el.querySelector('.mini-x').onclick = () => {
      if (!confirm(`Deseja realmente excluir o treino "${t.nome}"?`)) return;
      treinos = treinos.filter((x) => x.id !== t.id);
      salvar(STORAGE.treinos, treinos);
      renderTreinos();
    };
    cont.appendChild(el);
  });

  // Últimos treinos realizados
  recentes.forEach((h) => cont.appendChild(card(h)));
}

function excluirTreino(id) {
  if (!confirm('Excluir este treino?')) return;
  treinos = treinos.filter((t) => t.id !== id);
  salvar(STORAGE.treinos, treinos);
  renderTreinos();
}

// Abre o editor já com o calendário aberto, para programar a data do treino
function programarTreino(id) {
  abrirEditor(id);
  setTimeout(() => abrirDP(), 0);
}

// =====================================================================
// MODAL — editor de treino
// =====================================================================
const modal = document.getElementById('modal-treino');
const modalTitulo = document.getElementById('modal-treino-titulo');
const inputNome = document.getElementById('treino-nome');
const inputData = document.getElementById('treino-data');
const editorExerciciosEl = document.getElementById('editor-exercicios');
let editandoId = null;
let editorNomeManual = false; // true quando a pessoa digitou o nome do treino

// Se a pessoa digitar o nome, vira manual; se apagar, volta ao automático por grupos
inputNome.addEventListener('input', () => {
  editorNomeManual = inputNome.value.trim() !== '';
});

// ----- Seletor de data com calendário do mês -----
const dpCal = document.getElementById('dp-cal');
let dpAno, dpMes;

inputData.addEventListener('focus', abrirDP);
inputData.addEventListener('click', abrirDP);
document.addEventListener('click', (e) => {
  if (!dpCal.classList.contains('hidden') && !dpCal.contains(e.target) && e.target !== inputData) {
    dpCal.classList.add('hidden');
  }
});

function abrirDP() {
  const iso = ddmmyyyyParaISO(inputData.value.trim());
  if (iso) { const [y, m] = iso.split('-').map(Number); dpAno = y; dpMes = m - 1; }
  else { const h = new Date(); dpAno = h.getFullYear(); dpMes = h.getMonth(); }
  renderDP();
  dpCal.classList.remove('hidden');
}

function renderDP() {
  const primeiroDia = new Date(dpAno, dpMes, 1).getDay();
  const diasNoMes = new Date(dpAno, dpMes + 1, 0).getDate();
  const titulo = new Date(dpAno, dpMes, 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  let dias = '';
  for (let i = 0; i < primeiroDia; i++) dias += '<span class="dp-empty"></span>';
  for (let dia = 1; dia <= diasNoMes; dia++) dias += `<button type="button" class="dp-dia" data-dia="${dia}">${dia}</button>`;
  dpCal.innerHTML = `
    <div class="dp-head">
      <button type="button" class="dp-nav" data-nav="-1">◀</button>
      <strong>${titulo}</strong>
      <button type="button" class="dp-nav" data-nav="1">▶</button>
    </div>
    <div class="dp-week"><span>D</span><span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span></div>
    <div class="dp-grid">${dias}</div>
  `;
  dpCal.querySelectorAll('.dp-nav').forEach((b) => {
    b.onclick = () => {
      dpMes += +b.dataset.nav;
      if (dpMes < 0) { dpMes = 11; dpAno--; }
      if (dpMes > 11) { dpMes = 0; dpAno++; }
      renderDP();
    };
  });
  dpCal.querySelectorAll('.dp-dia').forEach((b) => {
    b.onclick = () => {
      const dia = +b.dataset.dia;
      inputData.value = `${String(dia).padStart(2, '0')}/${String(dpMes + 1).padStart(2, '0')}/${dpAno}`;
      dpCal.classList.add('hidden');
    };
  });
}

// Preenche o nome do treino com os grupos escolhidos (Peito + Bíceps...) se não for manual
function atualizarNomeTreinoAuto() {
  if (editorNomeManual) return;
  const grupos = [];
  editorExerciciosEl.querySelectorAll('.ex-grupo').forEach((sel) => {
    if (sel.value && !grupos.includes(sel.value)) grupos.push(sel.value);
  });
  inputNome.value = grupos.join(' + ');
}

// Conversões entre dd/mm/aaaa (tela) e AAAA-MM-DD (armazenado)
function ddmmyyyyParaISO(str) {
  const m = (str || '').match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return '';
  const [, d, mo, y] = m;
  const dt = new Date(+y, +mo - 1, +d);
  if (dt.getMonth() !== +mo - 1 || dt.getDate() !== +d) return '';
  return `${y}-${mo}-${d}`;
}
function isoParaDDMMYYYY(iso) {
  const m = (iso || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : '';
}

document.getElementById('novo-treino-btn').onclick = () => abrirEditor(null);
document.getElementById('add-exercicio-btn').onclick = () => {
  editorExerciciosEl.querySelectorAll('.exercicio-editor').forEach((el) => el.classList.add('colapsado'));
  adicionarLinhaExercicio();
};
document.getElementById('cancelar-treino-btn').onclick = fecharEditor;
document.getElementById('salvar-treino-btn').onclick = salvarTreino;

function abrirEditor(id) {
  editandoId = id;
  editorExerciciosEl.innerHTML = '';
  if (id) {
    const t = treinos.find((x) => x.id === id);
    modalTitulo.textContent = 'Editar treino';
    inputNome.value = t.nome;
    inputData.value = isoParaDDMMYYYY(t.dataProgramada);
    editorNomeManual = true;
    t.exercicios.forEach((ex) => adicionarLinhaExercicio(ex));
  } else {
    modalTitulo.textContent = 'Novo treino';
    inputNome.value = '';
    inputData.value = '';
    editorNomeManual = false;
    adicionarLinhaExercicio();
  }
  modal.classList.remove('hidden');
  inputNome.focus();
}

function fecharEditor() {
  modal.classList.add('hidden');
  dpCal.classList.add('hidden');
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
      <input type="text" class="ex-nome" list="lista-todos-exercicios" autocomplete="off" placeholder="Busque o nome do exercício" value="${escapar(dados.nome || '')}" />
      <button class="ex-min" type="button" title="Minimizar/expandir"><svg class="chev" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg></button>
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
    </div>
    <button class="btn small ghost salvar-ex-lista" type="button">+ Salvar este exercício na minha lista</button>
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

  grupoSel.onchange = () => { popularSugestoes(); atualizarNomeTreinoAuto(); };
  // Ao escolher da lista, preenche o nome (mas o campo de texto continua editável)
  sugestaoSel.onchange = () => {
    if (sugestaoSel.value) nomeInput.value = sugestaoSel.value;
  };
  // Digitar/escolher no nome filtra todos os exercícios e espelha na lista "Exercício (lista)"
  nomeInput.addEventListener('input', () => {
    const valor = nomeInput.value.trim();
    const g = grupoDoExercicio(valor);
    if (g && grupoSel.value !== g) {
      grupoSel.value = g;
      popularSugestoes();
    }
    sugestaoSel.value = valor; // reflete a seleção na lista (igual à aba do exercício)
    atualizarNomeTreinoAuto();
  });

  div.querySelector('.ex-min').onclick = () => div.classList.toggle('colapsado');
  div.querySelector('.remover-ex').onclick = () => {
    if (!confirm('Excluir este exercício?')) return;
    div.remove();
    atualizarNomeTreinoAuto();
  };
  // Salvar o nome digitado como exercício personalizado do grupo
  div.querySelector('.salvar-ex-lista').onclick = () => {
    const nome = nomeInput.value.trim();
    const grupo = grupoSel.value;
    if (!nome) { alert('Digite o nome do exercício.'); return; }
    if (!grupo) { alert('Escolha o grupo muscular primeiro.'); return; }
    const r = adicionarExercicioCatalogo(grupo, nome);
    if (r === 'ok') { popularSugestoes(); toast('Exercício salvo na sua lista!'); }
    else if (r === 'dup') toast('Esse exercício já está na lista.');
  };
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
      carga: 0,
      pesoMaquina: 0,
    });
  });
  if (exercicios.length === 0) { alert('Adicione ao menos um exercício.'); return; }

  const dataProgramada = ddmmyyyyParaISO(inputData.value.trim());
  if (editandoId) {
    const t = treinos.find((x) => x.id === editandoId);
    t.nome = nome;
    t.exercicios = exercicios;
    t.dataProgramada = dataProgramada;
  } else {
    treinos.push({ id: novoId(), nome, exercicios, dataProgramada });
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
const sessaoNomeInput = document.getElementById('sessao-nome');
const cronTotalEl = document.getElementById('cron-total');
const cronDescansoEl = document.getElementById('cron-descanso');
const descansoBtn = document.getElementById('descanso-btn');
const sessGrupoSel = document.getElementById('sess-grupo');
const sessSugestaoSel = document.getElementById('sess-sugestao');

const PASSO_DESCANSO = 15; // segundos por clique nas setas
let descansoAlvo = Math.max(15, carregar(STORAGE.descansoAlvo, 90)); // segundos (padrão 1:30)
let descansoFim = null;   // timestamp em que a contagem regressiva termina
let nomeManual = false;   // true quando a pessoa digitou um nome próprio

document.getElementById('cancelar-sessao-btn').onclick = cancelarSessao;
document.getElementById('finalizar-sessao-btn').onclick = finalizarSessao;
document.getElementById('treino-livre-btn').onclick = iniciarSessaoLivre;
document.getElementById('add-ex-sessao-btn').onclick = adicionarExercicioSessao;
const descansoMaisBtn = document.getElementById('descanso-mais');
const descansoMenosBtn = document.getElementById('descanso-menos');
const descansoResetBtn = document.getElementById('descanso-reset');
descansoMaisBtn.onclick = () => ajustarDescanso(PASSO_DESCANSO);
descansoMenosBtn.onclick = () => ajustarDescanso(-PASSO_DESCANSO);
descansoResetBtn.onclick = resetarDescanso;
setDescansoEditavel(true);

// Play/pause do tempo de treino (não inicia sozinho)
const treinoPlayBtn = document.getElementById('treino-play');
treinoPlayBtn.onclick = alternarTreino;

// Se a pessoa digitar, o nome vira "manual"; se apagar, volta ao automático
sessaoNomeInput.addEventListener('input', () => {
  nomeManual = sessaoNomeInput.value.trim() !== '';
});

function tempoTotalSeg() {
  if (!sessaoAtual) return 0;
  let t = sessaoAtual.decorrido || 0;
  if (sessaoAtual.rodando && sessaoAtual.inicio) t += (Date.now() - sessaoAtual.inicio) / 1000;
  return Math.floor(t);
}
function playTreino() {
  if (!sessaoAtual || sessaoAtual.rodando) return;
  sessaoAtual.inicio = Date.now();
  sessaoAtual.rodando = true;
  treinoPlayBtn.classList.add('rodando');
}
function pausarTreino() {
  if (!sessaoAtual || !sessaoAtual.rodando) return;
  sessaoAtual.decorrido = (sessaoAtual.decorrido || 0) + (Date.now() - sessaoAtual.inicio) / 1000;
  sessaoAtual.inicio = null;
  sessaoAtual.rodando = false;
  treinoPlayBtn.classList.remove('rodando');
}
function alternarTreino() {
  if (sessaoAtual && sessaoAtual.rodando) pausarTreino();
  else playTreino();
}

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
    inicio: null,
    rodando: false,
    decorrido: 0,
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
    inicio: null,
    rodando: false,
    decorrido: 0,
    exercicios: [],
  };
  abrirSessao('Treino livre');
}

function abrirSessao(titulo) {
  document.getElementById('sessao-titulo').textContent = titulo;
  sessaoNomeInput.value = (sessaoAtual.nome && sessaoAtual.nome !== 'Treino livre') ? sessaoAtual.nome : '';
  nomeManual = sessaoNomeInput.value.trim() !== '';
  sessGrupoSel.value = '';
  sessSugestaoSel.innerHTML = '<option value="">Exercício</option>';
  sessSugestaoSel.disabled = true;
  descansoFim = null;
  descansoBtn.classList.remove('ativo', 'fim');
  setDescansoEditavel(true);
  mostrarDescansoParado();
  treinoPlayBtn.classList.remove('rodando');
  trocarAba('hoje');
  renderSessaoAtiva();
  iniciarCronometro();
  armarPip();
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
  const s = sessaoAtual.exercicios[ei].series[si];
  if (s && s.feita && !confirm('Apagar esta série já realizada?')) return;
  sessaoAtual.exercicios[ei].series.splice(si, 1);
  renderSessaoAtiva();
}

function removerExercicioSessao(ei) {
  const ex = sessaoAtual.exercicios[ei];
  const temFeita = ex.series.some((s) => s.feita);
  if (temFeita && !confirm(`Apagar "${ex.nome}"? Este exercício já tem séries realizadas.`)) return;
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
    const feitas = ex.series.filter((s) => s.feita).length;
    const total = ex.series.length;
    const completo = total > 0 && feitas === total;
    const bloco = document.createElement('div');
    bloco.className = 'sessao-ex' + (ex.colapsado ? ' colapsado' : '') + (completo ? ' completo' : '');
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
        <div class="ex-head-info" data-ei="${ei}">
          <h3>${escapar(ex.nome)}${ex.grupo ? `<span class="grupo-tag">${escapar(ex.grupo)}</span>` : ''}</h3>
        </div>
        <div class="ex-head-actions">
          <span class="ex-contagem">${feitas}/${total}</span>
          <button class="ex-toggle" type="button" data-ei="${ei}" aria-label="Minimizar/expandir exercício">
            <svg class="chev" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
          </button>
          <button class="btn small danger remover-ex-sessao" data-ei="${ei}" title="Remover exercício">×</button>
        </div>
      </div>
      <div class="ex-corpo">
        <div class="serie-row cab"><span></span><span>carga (kg)</span><span>reps</span><span>ok</span><span></span></div>
        ${series}
        <div class="serie-add">
          <button class="btn small add-serie" data-ei="${ei}">+ série</button>
        </div>
      </div>
    `;
    sessaoExerciciosEl.appendChild(bloco);
  });

  // Minimizar/expandir exercício (ícone à direita ou tocando no nome)
  sessaoExerciciosEl.querySelectorAll('.ex-toggle, .ex-head-info').forEach((el) => {
    el.onclick = () => {
      const ex = sessaoAtual.exercicios[el.dataset.ei];
      ex.colapsado = !ex.colapsado;
      renderSessaoAtiva();
    };
  });
  // Inputs de carga/reps
  sessaoExerciciosEl.querySelectorAll('.s-carga, .s-reps').forEach((inp) => {
    inp.onchange = () => {
      const s = sessaoAtual.exercicios[inp.dataset.ei].series[inp.dataset.si];
      if (inp.classList.contains('s-carga')) s.carga = parseFloat(inp.value) || 0;
      else s.reps = parseInt(inp.value) || 0;
    };
  });
  // Marcar série feita -> reinicia o descanso (NÃO minimiza sozinho)
  sessaoExerciciosEl.querySelectorAll('.serie-check').forEach((chk) => {
    chk.onchange = () => {
      const ex = sessaoAtual.exercicios[chk.dataset.ei];
      ex.series[chk.dataset.si].feita = chk.checked;
      if (chk.checked) iniciarDescanso();
      renderSessaoAtiva();
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

  atualizarNomeAuto();
}

// ---- Cronômetros: total do treino (progressivo) + descanso (regressivo) ----
function iniciarCronometro() {
  clearInterval(cronometroId);
  tickCronometros();
  cronometroId = setInterval(tickCronometros, 250);
}
function tickCronometros() {
  if (!sessaoAtual) return;
  cronTotalEl.textContent = fmtTempo(tempoTotalSeg());
  if (descansoFim) {
    const restanteMs = descansoFim - Date.now();
    if (restanteMs <= 0) {
      cronDescansoEl.textContent = '00:00';
      finalizarDescanso();
    } else {
      cronDescansoEl.textContent = fmtTempo(Math.ceil(restanteMs / 1000));
    }
  }
  if (pipArmado) desenharPip();
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
  toast('Descanso acabou! Bora pra próxima (toque para fechar)', 0);
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
const pipCanvas = document.getElementById('pip-canvas');
const pipVideo = document.getElementById('pip-video');
const pipCtx = pipCanvas.getContext('2d');
let pipAtivo = false;
let pipArmado = false;

// Clicar no cronômetro: começa o descanso (se estiver parado) e abre a janela flutuante
descansoBtn.onclick = tocarDescanso;
pipVideo.addEventListener('enterpictureinpicture', () => { pipAtivo = true; });
pipVideo.addEventListener('leavepictureinpicture', () => { pipAtivo = false; });

// Ao sair do app durante o treino, tenta abrir o flutuante automaticamente
document.addEventListener('visibilitychange', () => {
  if (document.hidden && sessaoAtual && pipArmado && !document.pictureInPictureElement) {
    if (pipVideo.requestPictureInPicture) pipVideo.requestPictureInPicture().catch(() => {});
  }
});

// "Arma" o flutuante no início da sessão (auto-PiP ao trocar de app)
function armarPip() {
  if (!('pictureInPictureEnabled' in document) || !document.pictureInPictureEnabled) return;
  try {
    desenharPip();
    if (!pipVideo.srcObject) pipVideo.srcObject = pipCanvas.captureStream(2);
    pipVideo.autoPictureInPicture = true;
    pipVideo.setAttribute('autopictureinpicture', '');
    const p = pipVideo.play();
    if (p && p.catch) p.catch(() => {});
    pipArmado = true;
  } catch { /* navegador sem suporte */ }
}

// Desarma e fecha o flutuante ao encerrar a sessão
function desarmarPip() {
  pipArmado = false;
  pipAtivo = false;
  try { if (document.pictureInPictureElement) document.exitPictureInPicture(); } catch {}
  try { pipVideo.pause(); } catch {}
}

// Botão manual para abrir/fechar o flutuante
async function alternarPip() {
  if (!document.pictureInPictureEnabled) {
    alert('Seu navegador não suporta o cronômetro flutuante. Use o Chrome no Android.');
    return;
  }
  try {
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
      return;
    }
    desenharPip();
    if (!pipVideo.srcObject) pipVideo.srcObject = pipCanvas.captureStream(2);
    await pipVideo.play();
    await pipVideo.requestPictureInPicture();
  } catch (e) {
    alert('Não consegui abrir o cronômetro flutuante: ' + e.message);
  }
}

// Toque no cronômetro de descanso: inicia a contagem (se parado) e abre o flutuante
function tocarDescanso() {
  if (document.pictureInPictureElement) {
    document.exitPictureInPicture().catch(() => {});
    return;
  }
  if (!descansoFim) iniciarDescanso();
  alternarPip();
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

// Nome automático com os grupos musculares treinados (ex: "Peito + Ombros + Bíceps")
function nomePorGrupos() {
  const grupos = [];
  sessaoAtual.exercicios.forEach((ex) => {
    if (ex.grupo && !grupos.includes(ex.grupo)) grupos.push(ex.grupo);
  });
  return grupos.length ? grupos.join(' + ') : 'Treino livre';
}

// Preenche o nome com os grupos treinados, enquanto a pessoa não digitar um próprio
function atualizarNomeAuto() {
  if (nomeManual || !sessaoAtual) return;
  const grupos = [];
  sessaoAtual.exercicios.forEach((ex) => {
    if (ex.grupo && !grupos.includes(ex.grupo)) grupos.push(ex.grupo);
  });
  sessaoNomeInput.value = grupos.join(' + ');
}

function finalizarSessao() {
  if (sessaoAtual.exercicios.length === 0) {
    alert('Adicione ao menos um exercício antes de finalizar.');
    return;
  }
  if (!confirm('Deseja finalizar e salvar este treino?')) return;

  // Nome: o que a pessoa digitou; se vazio, usa os grupos musculares treinados
  const nomeFinal = sessaoNomeInput.value.trim() || nomePorGrupos();
  const totalSeries = sessaoAtual.exercicios.reduce((acc, ex) => acc + ex.series.length, 0);
  const feitas = sessaoAtual.exercicios.reduce(
    (acc, ex) => acc + ex.series.filter((s) => s.feita).length, 0
  );
  const volume = sessaoAtual.exercicios.reduce(
    (acc, ex) => acc + ex.series.filter((s) => s.feita).reduce((a, s) => a + s.carga * s.reps, 0), 0
  );

  historico.unshift({
    id: novoId(),
    nome: nomeFinal,
    data: Date.now(),
    duracaoSeg: tempoTotalSeg(),
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
    inicio: null,
    rodando: false,
    decorrido: h.duracaoSeg || 0,
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
  desarmarPip();
  clearInterval(cronometroId);
  cronometroId = null;
  sessaoAtual = null;
  descansoFim = null;
  cronTotalEl.textContent = '00:00';
  sessaoNomeInput.value = '';
  descansoBtn.classList.remove('ativo', 'fim');
  treinoPlayBtn.classList.remove('rodando');
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

// Converte 'AAAA-MM-DD' (input date) para a chave do dia usada no calendário
function chaveDiaProgramado(str) {
  if (!str) return null;
  const [y, m, d] = str.split('-').map(Number);
  return `${y}-${m - 1}-${d}`;
}

// Mapa: chaveDia -> nomes de treinos PROGRAMADOS para aquele dia
function programadosPorDia() {
  const mapa = {};
  treinos.forEach((t) => {
    const k = chaveDiaProgramado(t.dataProgramada);
    if (k) (mapa[k] = mapa[k] || []).push(t.nome);
  });
  return mapa;
}

function renderDashboard() {
  const mapa = sessoesPorDia();
  const progMapa = programadosPorDia();
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

  // Grade completa: começa no domingo da 1ª semana e cobre semanas inteiras
  const inicioGrade = new Date(calAno, calMes, 1 - primeiroDia);
  const numCelulas = Math.ceil((primeiroDia + diasNoMes) / 7) * 7;

  let totalMes = 0;
  for (let i = 0; i < numCelulas; i++) {
    const d = new Date(inicioGrade);
    d.setDate(inicioGrade.getDate() + i);
    const k = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    const noMes = d.getMonth() === calMes;
    const treinou = !!mapa[k];
    const prog = !!progMapa[k];
    if (treinou && noMes) totalMes += mapa[k].length;
    const cell = document.createElement('div');
    cell.className = 'cal-cell'
      + (noMes ? '' : ' outro-mes')
      + (treinou ? ' treinou' : '')
      + (prog ? ' programado' : '')
      + (k === hojeK ? ' hoje' : '');
    cell.innerHTML = `${d.getDate()}`
      + (treinou ? '<span class="dot">●</span>' : '')
      + (prog ? '<span class="prog-mark">●</span>' : '');
    const titulos = [];
    if (treinou) titulos.push('Feito: ' + mapa[k].join(', '));
    if (prog) titulos.push('Programado: ' + progMapa[k].join(', '));
    if (titulos.length) cell.title = titulos.join(' | ');
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
    const prog = [...new Set(progMapa[k] || [])];
    const ehHoje = k === hojeK;
    const div = document.createElement('div');
    div.className = 'week-day' + (nomes.length ? ' treinou' : '') + (prog.length ? ' tem-prog' : '') + (ehHoje ? ' hoje' : '');
    div.innerHTML = `
      <div class="wd-nome">${NOMES_SEMANA[i]}</div>
      <div class="wd-num">${d.getDate()}</div>
      ${nomes.length ? `<div class="wd-treinos">${nomes.map((n) => escapar(n)).join('<br>')}</div>` : ''}
      ${prog.length ? `<div class="wd-prog">${prog.map((n) => escapar(n)).join('<br>')}</div>` : ''}
      ${(!nomes.length && !prog.length) ? '<div class="wd-vazio">–</div>' : ''}
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
const evoChartEl = document.getElementById('evo-chart');
const statsDashEl = document.getElementById('stats-dash');

// Calendário do mês (Stats) — navegação própria
const _agStats = new Date();
let statsCalAno = _agStats.getFullYear();
let statsCalMes = _agStats.getMonth();
document.getElementById('stats-mes-anterior').onclick = () => {
  if (--statsCalMes < 0) { statsCalMes = 11; statsCalAno--; }
  renderStatsCalendario();
};
document.getElementById('stats-mes-proximo').onclick = () => {
  if (++statsCalMes > 11) { statsCalMes = 0; statsCalAno++; }
  renderStatsCalendario();
};

// Sequência de dias seguidos treinados (terminando hoje ou ontem)
function sequenciaDias(diasSet) {
  const d = new Date(); d.setHours(0, 0, 0, 0);
  const k = (x) => `${x.getFullYear()}-${x.getMonth()}-${x.getDate()}`;
  if (!diasSet.has(k(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (diasSet.has(k(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

function renderStatsCalendario() {
  const mapa = sessoesPorDia();
  const hoje = new Date();
  const hojeK = `${hoje.getFullYear()}-${hoje.getMonth()}-${hoje.getDate()}`;
  document.getElementById('stats-mes-titulo').textContent =
    new Date(statsCalAno, statsCalMes, 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const primeiroDia = new Date(statsCalAno, statsCalMes, 1).getDay();
  const diasNoMes = new Date(statsCalAno, statsCalMes + 1, 0).getDate();
  const inicioGrade = new Date(statsCalAno, statsCalMes, 1 - primeiroDia);
  const numCelulas = Math.ceil((primeiroDia + diasNoMes) / 7) * 7;
  const cal = document.getElementById('stats-calendario');
  cal.innerHTML = '';
  let total = 0;
  for (let i = 0; i < numCelulas; i++) {
    const d = new Date(inicioGrade);
    d.setDate(inicioGrade.getDate() + i);
    const k = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    const noMes = d.getMonth() === statsCalMes;
    const treinou = !!mapa[k];
    if (treinou && noMes) total += mapa[k].length;
    const cell = document.createElement('div');
    cell.className = 'cal-cell' + (noMes ? '' : ' outro-mes') + (treinou ? ' treinou' : '') + (k === hojeK ? ' hoje' : '');
    cell.innerHTML = `${d.getDate()}${treinou ? '<span class="dot">●</span>' : ''}`;
    if (treinou) cell.title = mapa[k].join(', ');
    cal.appendChild(cell);
  }
  document.getElementById('stats-mes-resumo').textContent =
    total > 0 ? `${total} treino(s) neste mês` : 'Nenhum treino neste mês';
}

function renderResultados() {
  const vazio = historico.length === 0;
  resultadosVazioEl.classList.toggle('hidden', !vazio);
  document.querySelectorAll('#resultados h3').forEach((h) => h.classList.toggle('hidden', vazio));
  [resumoStatsEl, volumeGruposEl, recordesEl, evoChartEl, statsDashEl]
    .forEach((el) => el && el.classList.toggle('hidden', vazio));
  if (vazio) {
    resumoStatsEl.innerHTML = '';
    volumeGruposEl.innerHTML = '';
    recordesEl.innerHTML = '';
    evoChartEl.innerHTML = '';
    return;
  }

  // ----- Frequência / sequência -----
  const agora = new Date();
  const hoje0 = new Date(agora); hoje0.setHours(0, 0, 0, 0);
  const inicioSemana = new Date(hoje0); inicioSemana.setDate(hoje0.getDate() - hoje0.getDay());
  const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1).getTime();
  const treinosSemana = historico.filter((h) => h.data >= inicioSemana.getTime()).length;
  const doMes = historico.filter((h) => h.data >= inicioMes);
  const diasMes = new Set(doMes.map((h) => chaveDia(h.data))).size;
  const streak = sequenciaDias(new Set(historico.map((h) => chaveDia(h.data))));

  // ----- Totais / médias -----
  const volumeTotal = historico.reduce((a, h) => a + (h.volume || 0), 0);
  const tempoTotal = historico.reduce((a, h) => a + (h.duracaoSeg || 0), 0);
  const seriesTotal = historico.reduce((a, h) => a + (h.seriesFeitas || 0), 0);
  const mediaDur = Math.round(tempoTotal / historico.length / 60);
  const mediaSeries = Math.round(seriesTotal / historico.length);

  resumoStatsEl.innerHTML = `
    ${statCard(treinosSemana, 'Treinos na semana')}
    ${statCard(doMes.length, 'Treinos no mês')}
    ${statCard(diasMes, 'Dias no mês')}
    ${statCard(streak, 'Sequência (dias)')}
    ${statCard(volumeTotal.toLocaleString('pt-BR') + ' kg', 'Volume total')}
    ${statCard(Math.round(tempoTotal / 60) + ' min', 'Tempo total')}
    ${statCard(mediaDur + ' min', 'Média/treino')}
    ${statCard(mediaSeries, 'Média de séries')}
  `;

  // ----- Gráfico de evolução: volume por semana (últimas 8) -----
  const SEMANAS = 8;
  const semanas = [];
  for (let i = SEMANAS - 1; i >= 0; i--) {
    const ini = new Date(inicioSemana); ini.setDate(inicioSemana.getDate() - i * 7);
    const fim = new Date(ini); fim.setDate(ini.getDate() + 7);
    const naSemana = historico.filter((h) => h.data >= ini.getTime() && h.data < fim.getTime());
    semanas.push({ ini, vol: naSemana.reduce((a, h) => a + (h.volume || 0), 0), treinos: naSemana.length });
  }
  const maxSem = Math.max(...semanas.map((s) => s.vol), 1);
  evoChartEl.innerHTML = semanas.map((s) => {
    const alt = Math.round((s.vol / maxSem) * 100);
    const lbl = `${String(s.ini.getDate()).padStart(2, '0')}/${String(s.ini.getMonth() + 1).padStart(2, '0')}`;
    return `<div class="evo-bar" title="Semana de ${lbl}: ${Math.round(s.vol).toLocaleString('pt-BR')} kg · ${s.treinos} treino(s)">
      <div class="evo-fill" style="height:${Math.max(2, alt)}%"></div>
      <span class="evo-lbl">${lbl}</span>
    </div>`;
  }).join('');

  // ----- Calendário do mês -----
  renderStatsCalendario();

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
  renderAgua();
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
// ÁGUA — meta diária + lembrete com cronômetro
// =====================================================================
const PASSO_META_AGUA = 500;
const aguaBarraEl = document.getElementById('agua-barra');
const aguaTotalEl = document.getElementById('agua-total');
const aguaMetaValEl = document.getElementById('agua-meta-val');
const aguaBebiMlEl = document.getElementById('agua-bebi-ml');
const aguaMlInput = document.getElementById('agua-ml');
const aguaCronEl = document.getElementById('agua-cron');
const aguaStartBtn = document.getElementById('agua-start');

aguaMlInput.value = lembreteAgua.ml;
mostrarLembreteParado();

// Editar o tempo digitando direto no cronômetro (mm:ss), quando parado
aguaCronEl.onchange = () => {
  if (aguaLembreteFim) return;
  lembreteAgua.min = parseMinAgua(aguaCronEl.value);
  salvar(STORAGE.aguaLembrete, lembreteAgua);
  mostrarLembreteParado();
};
function parseMinAgua(str) {
  str = (str || '').trim();
  let min;
  if (str.includes(':')) {
    const [m, s] = str.split(':');
    min = (parseInt(m) || 0) + (parseInt(s) || 0) / 60;
  } else {
    min = parseFloat(str) || 0;
  }
  return Math.min(240, Math.max(0.25, min));
}

document.getElementById('agua-meta-menos').onclick = () => ajustarMetaAgua(-PASSO_META_AGUA);
document.getElementById('agua-meta-mais').onclick = () => ajustarMetaAgua(PASSO_META_AGUA);
aguaMlInput.onchange = () => {
  lembreteAgua.ml = Math.max(50, parseInt(aguaMlInput.value) || 50);
  salvar(STORAGE.aguaLembrete, lembreteAgua);
  aguaMlInput.value = lembreteAgua.ml;
  renderAgua();
};
document.getElementById('agua-min-mais').onclick = () => ajustarMinAgua(5);
document.getElementById('agua-min-menos').onclick = () => ajustarMinAgua(-5);
aguaStartBtn.onclick = () => { if (aguaLembreteFim) pararLembreteAgua(); else iniciarLembreteAgua(); };
document.getElementById('agua-bebi').onclick = () => {
  addAgua(lembreteAgua.ml);
  if (aguaLembreteFim) iniciarLembreteAgua();
};
document.getElementById('agua-zerar').onclick = () => {
  garantirAguaHoje();
  aguaHoje.ml = 0;
  salvar(STORAGE.aguaHoje, aguaHoje);
  renderAgua();
};

function ajustarMetaAgua(delta) {
  metaAgua = Math.min(5000, Math.max(500, metaAgua + delta));
  salvar(STORAGE.metaAgua, metaAgua);
  renderAgua();
}
function ajustarMinAgua(delta) {
  lembreteAgua.min = Math.max(0.25, lembreteAgua.min + delta);
  salvar(STORAGE.aguaLembrete, lembreteAgua);
  if (aguaLembreteFim) iniciarLembreteAgua();
  else mostrarLembreteParado();
}
function garantirAguaHoje() {
  if (!aguaHoje || aguaHoje.dia !== diaDeHoje()) {
    aguaHoje = { dia: diaDeHoje(), ml: 0 };
    salvar(STORAGE.aguaHoje, aguaHoje);
  }
}
function addAgua(ml) {
  garantirAguaHoje();
  aguaHoje.ml = Math.max(0, aguaHoje.ml + ml);
  salvar(STORAGE.aguaHoje, aguaHoje);
  renderAgua();
}
function renderAgua() {
  garantirAguaHoje();
  aguaMetaValEl.textContent = (metaAgua / 1000).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' L';
  aguaBebiMlEl.textContent = `(${lembreteAgua.ml} ml)`;
  const pct = metaAgua > 0 ? Math.min(100, (aguaHoje.ml / metaAgua) * 100) : 0;
  aguaBarraEl.style.width = pct + '%';
  aguaTotalEl.textContent = `${aguaHoje.ml.toLocaleString('pt-BR')} / ${metaAgua.toLocaleString('pt-BR')} ml`
    + (aguaHoje.ml >= metaAgua && metaAgua > 0 ? ' — meta batida!' : '');
}

function mostrarLembreteParado() {
  if (!aguaLembreteFim) aguaCronEl.value = fmtTempo(Math.round(lembreteAgua.min * 60));
}
function iniciarLembreteAgua() {
  aguaLembreteFim = Date.now() + lembreteAgua.min * 60 * 1000;
  aguaStartBtn.textContent = 'Parar';
  aguaCronEl.readOnly = true;
  clearInterval(aguaLembreteId);
  tickAgua();
  aguaLembreteId = setInterval(tickAgua, 1000);
}
function pararLembreteAgua() {
  clearInterval(aguaLembreteId);
  aguaLembreteId = null;
  aguaLembreteFim = null;
  aguaStartBtn.textContent = 'Iniciar';
  aguaCronEl.readOnly = false;
  mostrarLembreteParado();
}
function tickAgua() {
  if (!aguaLembreteFim) return;
  const restMs = aguaLembreteFim - Date.now();
  if (restMs <= 0) {
    aguaCronEl.value = '00:00';
    beepDescanso();
    toast('Hora de beber água! Toque em "Bebi" (toque para fechar)', 0);
    aguaLembreteFim = Date.now() + lembreteAgua.min * 60 * 1000; // reinicia o lembrete
  } else {
    aguaCronEl.value = fmtTempo(Math.ceil(restMs / 1000));
  }
}

// =====================================================================
// Utilidades
// =====================================================================
// Codifica para HTML seguro em contexto de texto E de atributo (inclui aspas)
function escapar(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatarData(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
  });
}

let toastTimer = null;
function toast(msg, duracao = 2500) {
  let el = document.querySelector('.toast');
  if (el) el.remove();
  el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  el.onclick = () => el.remove(); // tocar para fechar
  document.body.appendChild(el);
  clearTimeout(toastTimer);
  if (duracao > 0) toastTimer = setTimeout(() => el.remove(), duracao); // 0 = fica até tocar
}

// ---- PWA: registra o service worker (só quando servido via http/https) ----
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => { /* ignora se falhar */ });
  });
}

// ---- Inicialização ----
montarDatalistExercicios();
renderTreinos();
