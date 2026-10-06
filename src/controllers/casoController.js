const Caso = require('../models/Caso.js');

exports.getDailyCaso = async (req, res) => {
  try {
    const caso = await Caso.findOne({ is_daily: true });
    if (!caso) return res.status(404).json({ mensagem: 'Caso diário não encontrado.' });
    
    const casoParaFront = caso.toObject();
    delete casoParaFront.pokemon_correto;
    res.json(casoParaFront);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao procurar o caso diário.', erro: error.message });
  }
};

exports.getCasosPorRank = async (req, res) => {
  try {
    const { rank } = req.params;
    const casos = await Caso.find({ rank: rank.toUpperCase() }).select('-pokemon_correto');
    res.json(casos);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao listar os casos do rank.', erro: error.message });
  }
};

exports.getCasoPorId = async (req, res) => {
  try {
    const caso = await Caso.findById(req.params.id);
    if (!caso) return res.status(404).json({ mensagem: 'Caso não encontrado.' });

    const casoParaFront = caso.toObject();
    delete casoParaFront.pokemon_correto;
    res.json(casoParaFront);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao procurar o caso.', erro: error.message });
  }
};

function compararNomesPokemon(palpite, correto) {
  if (!palpite || !correto) return false;
  
  const normalizar = (str) =>
    str
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  return normalizar(palpite) === normalizar(correto);
}

exports.validarMandado = async (req, res) => {
  try {
    const { id } = req.params;
    const { palpite } = req.body;

    if (!palpite) return res.status(400).json({ mensagem: 'O nome do Pokémon é obrigatório.' });

    const caso = await Caso.findById(id);
    if (!caso) return res.status(404).json({ mensagem: 'Caso não encontrado.' });

    const eCorreto = compararNomesPokemon(palpite, caso.pokemon_correto);

    if (eCorreto) {
      return res.json({
        resultado: 'VITORIA',
        correto: true,
        mensagem: 'Mandado cumprido com sucesso! Suspeito capturado.',
        pokemon: caso.pokemon_correto,
        dados_pokedex: caso.dados_pokemon_vitoria
      });
    } else {
      return res.json({
        resultado: 'DERROTA_OU_FALHA',
        correto: false,
        mensagem: 'Mandado inválido! O suspeito informado não corresponde às evidências.'
      });
    }
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao validar mandado.', erro: error.message });
  }
};

exports.validarMandadoDiario = async (req, res) => {
  try {
    const { palpite } = req.body;

    if (!palpite) return res.status(400).json({ mensagem: 'O nome do Pokémon é obrigatório.' });
    const caso = await Caso.findOne({ is_daily: true });
    if (!caso) return res.status(404).json({ mensagem: 'Caso diário não encontrado.' });

    const eCorreto = compararNomesPokemon(palpite, caso.pokemon_correto);

    if (eCorreto) {
      return res.json({
        resultado: 'VITORIA',
        correto: true,
        mensagem: 'Mandado cumprido com sucesso! Suspeito capturado.',
        pokemon: caso.pokemon_correto,
        dados_pokedex: caso.dados_pokemon_vitoria
      });
    } else {
      return res.json({
        resultado: 'DERROTA_OU_FALHA',
        correto: false,
        mensagem: 'Mandado inválido! O suspeito informado não corresponde às evidências.'
      });
    }
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao validar mandado.', erro: error.message });
  }
};