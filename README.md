# Detetive Pokédex — Entrega N1

Aplicação web de investigação policial com temática Pokédex desenvolvida para a disciplina de **Programação Web**, construída com **Node.js**, **Express**, **MongoDB (Mongoose)** e **HTML5, CSS3 e JavaScript puro**.

## Visão Geral do Projeto
O **Detetive Pokédex** propõe que o jogador atue como investigador analisando ocorrências, coletando indícios e emitindo um **Mandado de Prisão** apontando o Pokémon responsável pelo caso.

Na etapa **N1**, foi construída a base funcional do sistema: conexão com o banco de dados, modelagem dos dados, script de carga inicial com **4 casos** utilizando o **layout padrão**, rotas de páginas e API, interfaces iniciais e validação de mandados.

## Arquitetura e Estrutura
- **Backend (`Node.js` + `Express`):**
  - `db.js` — Conexão assíncrona com o MongoDB via `mongoose.connect(process.env.MONGO_URI)`, exibindo o host conectado e encerrando o processo (`process.exit(1)`) em caso de erro.
  - `routes/viewRoutes.js` — Serve as páginas HTML com `res.sendFile` para `/`, `/diario`, `/campanha`, `/investigacao` e `/conclusao`.
  - `routes/casoRoutes.js` — Define as rotas REST em `/api/casos` (`GET /daily`, `POST /daily/mandado`, `GET /rank/:rank`, `GET /:id`, `POST /:id/mandado`).
  - `controllers/casoController.js` — Busca casos (ocultando `pokemon_correto` nas consultas), compara o palpite normalizando texto (minúsculas, sem acentos e sem espaços extras) e valida mandados.
- **Banco de Dados (`MongoDB` + `Mongoose`):**
  - `models/Caso.js` — Define o schema dos casos (`numero_caso` único, `titulo`, `relatorio`, `rank`, `dificuldade`, `tipo_layout`, `horas_iniciais`, `pokemon_correto`, `pistas`, `timestamps: true`).
  - `models/Progresso.js` — Estrutura o acompanhamento da sessão (`session_id: "detetive_local"`), casos resolvidos/arquivados e histórico.
  - `seeder/` — Limpa a coleção com `Caso.deleteMany({})` e popula os **4 casos iniciais** de layout padrão a partir de `casos_iniciais.json` via `Caso.insertMany(...)`.
- **Frontend (`HTML5`, `CSS3` e `JavaScript`):**
  - Telas em `views/` (`index.html`, `campanha.html`, `diario.html`, `caso.html`, `conclusao.html`) estilizadas com `/css/style.css`.
  - `campanha.js` — Busca os casos por rank (`fetch`), destaca a aba ativa, posiciona as pastas na mesa e redireciona para `/investigacao?id=...`.
  - `investigacao.js` e `conclusao.js` — Carregam o caso, enviam o mandado via `POST`, armazenam o retorno no `sessionStorage` (`resultado_investigacao`) e exibem o veredito final na tela de conclusão.

## Como Executar
1. Instale as dependências do projeto:
   ```bash
   npm install
