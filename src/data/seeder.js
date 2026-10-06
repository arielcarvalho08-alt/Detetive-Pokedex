const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const Caso = require('../models/Caso');
const casosIniciais = require('./casos_iniciais.json');

const importarDados = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/detetive-pokedex';
    await mongoose.connect(mongoUri);

    await Caso.deleteMany({});
    console.log('🗑️  Base de dados limpa!');

    await Caso.insertMany(casosIniciais);
    console.log('✅ Novas dados populados com sucesso com relatórios e depoimentos!');

    process.exit();
  } catch (error) {
    console.error('❌ Erro ao rodar o seeder:', error);
    process.exit(1);
  }
};

importarDados();