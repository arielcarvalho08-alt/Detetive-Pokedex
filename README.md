# 🕵️‍♂️ Detetive Pokédex — Entrega N1

> Aplicação web de investigação policial com temática Pokédex desenvolvida para a disciplina de **Programação Web**, utilizando **Node.js**, **Express**, **MongoDB (Mongoose)** e **HTML5, CSS3 e JavaScript puro**.

---

## 📌 Visão Geral do Projeto
No **Detetive Pokédex**, o jogador assume o papel de um investigador analisando ocorrências, coletando pistas e emitindo um **Mandado de Prisão** contra o Pokémon suspeito.

Na etapa **N1**, o foco foi construir a **base funcional da aplicação**: conexão com o banco de dados, modelagem dos schemas, carga inicial com **4 casos** no **layout padrão**, rotas de páginas e API, interfaces iniciais e validação de mandados.

---

## 🏗️ Arquitetura e Estrutura

### ⚙️ Backend (`Node.js` + `Express`)
* 🔌 **`db.js`** — Conecta de forma assíncrona ao MongoDB via `mongoose.connect(process.env.MONGO_URI)`, exibe o host conectado e encerra o processo (`process.exit(1)`) caso a conexão falhe.
* 🖼️ **`routes/viewRoutes.js`** — Entrega as páginas HTML com `res.sendFile` nas rotas `/`, `/diario`, `/campanha`, `/investigacao` e `/conclusao`.
* 🔀 **`routes/casoRoutes.js`** — Expõe os endpoints da API em `/api/casos` (`GET /daily`, `POST /daily/mandado`, `GET /rank/:rank`, `GET /:id`, `POST /:id/mandado`).
* 🧠 **`controllers/casoController.js`** — Busca os casos (ocultando `pokemon_correto` nas consultas), normaliza o texto do palpite (minúsculas, sem acentos e sem espaços extras) e valida o mandado.

### 🗄️ Banco de Dados (`MongoDB` + `Mongoose`)
* 📄 **`models/Caso.js`** — Define o schema do caso (`numero_caso` único, `titulo`, `relatorio`, `rank`, `dificuldade`, `tipo_layout`, `horas_iniciais`, `pokemon_correto`, `pistas` e `timestamps: true`).
* 📊 **`models/Progresso.js`** — Estrutura o progresso da sessão (`session_id: "detetive_local"`), casos resolvidos/arquivados e histórico.
* 🌱 **`seeder/`** — Limpa a coleção com `Caso.deleteMany({})` e insere os **4 casos iniciais** de layout padrão a partir de `casos_iniciais.json` com `Caso.insertMany(...)`.

### 🎨 Frontend (`HTML5`, `CSS3` e `JavaScript`)
* 🖥️ **Telas em `views/`** (`index.html`, `campanha.html`, `diario.html`, `caso.html`, `conclusao.html`) estilizadas com `/css/style.css`.
* 📁 **`campanha.js`** — Busca os casos por rank via `fetch`, marca a aba ativa, distribui as pastas na mesa e navega para `/investigacao?id=...`.
* 🔍 **`investigacao.js` e `conclusao.js`** — Carregam o caso, enviam o mandado via `POST`, salvam o retorno no `sessionStorage` (`resultado_investigacao`) e exibem o resultado na tela de conclusão.

---

## 🚀 Como Executar

1. 📦 Instale as dependências do projeto:
   ```bash
   npm install
