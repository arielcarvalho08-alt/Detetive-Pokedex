const mongoose = require('mongoose');

const ProgressoSchema = new mongoose.Schema({

    session_id: { type: String, default: "detetive_local" },
  rank_atual: { type: String, default: "D" },
  casos_resolvidos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Caso' }],
  casos_arquivados: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Caso' }],
  daily_concluido_hoje: { type: Boolean, default: false },
  data_ultimo_daily: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Progresso', ProgressoSchema);  