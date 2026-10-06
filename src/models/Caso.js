const mongoose = require('mongoose');

const PistaSchema = new mongoose.Schema({
  id_pista: { type: String, required: true },
  nome: { type: String, required: true },
  custo_horas: { type: Number, default: 10 },
  descricao_revelada: { type: String, required: true },
  coordenadas_ou_alvo: { type: String }
});

const DepoimentoSchema = new mongoose.Schema({
  testemunha: { type: String },
  texto: { type: String }
});

const CasoSchema = new mongoose.Schema({
  numero_caso: { type: String, required: true, unique: true },
  titulo: { type: String, required: true },
  relatorio: { type: String },
  rank: { type: String, enum: ['D', 'C', 'B', 'A', 'S'], default: 'D' },
  is_daily: { type: Boolean, default: false },
  data_daily: { type: String },
  dificuldade: { type: String, default: 'Fácil' },
  tipo_layout: {
    type: String,
    enum: ['planta_baixa', 'documento_secreto', 'interrogatorio', 'laboratorio_medico'],
    required: true
  },
  horas_iniciais: { type: Number, default: 100 },
  pokemon_correto: { type: String, required: true },
  dados_pokemon_vitoria: {
    numero_pokedex: { type: Number },
    tipo: [{ type: String }],
    categoria: { type: String }
  },
  pistas: [PistaSchema],
  depoimentos: [DepoimentoSchema] 
}, { timestamps: true });

module.exports = mongoose.model('Caso', CasoSchema);