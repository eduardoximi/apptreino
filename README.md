# 🏋️ Meu Treino

App web para registrar treinos de academia. Sem instalação, sem servidor — os dados ficam salvos **localmente no navegador** (localStorage).

## Como usar

Abra o arquivo `index.html` com dois cliques no navegador. Pronto.

## Navegação (coluna lateral)

Uma barra lateral à esquerda dá acesso rápido às seções, além de uma **busca** por nome de treino:

- **📅 Treino de Hoje** — comece um **treino livre** (sem precisar de nome) ou a partir de uma rotina salva. Durante a sessão você adiciona **exercícios e séries um a um**, marca cada série concluída e acompanha **dois cronômetros**: tempo total do treino (progressivo) e um **descanso regressivo** ajustável pelas setas ▲▼ (15s por clique). Ele conta até zerar, com bip ao final, e reinicia automaticamente a cada série marcada como feita.
- **💡 Sugestão de Treino** — modelos prontos (Push, Pull, Legs, Full Body, Cardio...), filtráveis por objetivo. Um clique adiciona o modelo aos seus treinos para você só ajustar as cargas.
- **✅ Treinos Concluídos** — dashboard com **calendário do mês** (dias treinados marcados, navegável entre meses) e **faixa da semana atual** (o que foi treinado em cada dia), além do histórico de sessões com duração, séries concluídas e volume total (kg).
- **📊 Resultados** — estatísticas: total de sessões, volume e tempo, volume por grupo muscular (gráfico de barras) e recordes de carga por exercício.
- **🥗 Dieta** — registro de alimentos do dia com calorias, meta diária e barra de progresso.

## Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `index.html` | Estrutura da página |
| `style.css`  | Estilos (tema escuro) |
| `app.js`     | Lógica e persistência (localStorage) |

## Observações

- Os dados ficam apenas neste navegador/dispositivo. Limpar os dados do navegador apaga seus treinos.
- Para abrir em outro dispositivo seria necessário um backend (não incluído nesta versão).
