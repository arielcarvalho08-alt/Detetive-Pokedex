document.addEventListener('DOMContentLoaded', async () => {
  const resultadoRaw = sessionStorage.getItem('resultado_investigacao');

  if (!resultadoRaw) {
    window.location.href = '/campanha';
    return;
  }

  const dados = JSON.parse(resultadoRaw);

  const tituloVeredito = document.getElementById('titulo-veredito');
  const badgeStatus = document.getElementById('badge-status-resultado');
  
  const numPokedex = document.getElementById('pokedex-num');
  const nomePokemon = document.getElementById('pokemon-nome');
  const tiposContainer = document.getElementById('pokemon-tipos');
  const categoriaPokemon = document.getElementById('pokemon-categoria');
  const spriteImg = document.getElementById('pokemon-sprite');
  const spriteLoading = document.getElementById('pokemon-loading');
  
  const mensagemJustificativa = document.getElementById('mensagem-justificativa');
  const scoreBonus = document.getElementById('score-bonus');
  const scoreRank = document.getElementById('score-rank');

  const btnAcao = document.getElementById('btn-acao-principal');
  const btnVoltarMesa = document.getElementById('btn-voltar-mesa');

  const eVitória = dados.resultado === 'VITORIA' || dados.correto === true;

  if (dados.tipoCaso === 'diario') {
    btnVoltarMesa.href = '/diario';
    btnAcao.style.display = 'none';
  } else {
    btnVoltarMesa.href = '/campanha';
    if (eVitória) {
      btnAcao.textContent = 'Próximo Caso';
      btnAcao.href = '/campanha';
    } else {
      btnAcao.textContent = 'Tentar Novamente';
      btnAcao.href = `/investigacao?id=${dados.casoId || ''}`;
    }
  }

  const pokemonAlvo = dados.pokemon || dados.palpite || '';
  nomePokemon.textContent = pokemonAlvo || 'Desconhecido';

  tiposContainer.innerHTML = '';
  categoriaPokemon.textContent = 'Categoria: Carregando...';

  if (pokemonAlvo) {
    let nomeLimpo = pokemonAlvo
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") 
      .replace(/['’.:]/g, '')          
      .replace(/\s+/g, '-');          

    if (nomeLimpo === 'nidoran') {
      nomeLimpo = 'nidoran-m';
    }

    try {
      let respostaAPI = await fetch(`https://pokeapi.co/api/v2/pokemon/${nomeLimpo}`);

      if (!respostaAPI.ok && nomeLimpo.includes('-')) {
        const nomeSemHifen = nomeLimpo.replace(/-/g, '');
        respostaAPI = await fetch(`https://pokeapi.co/api/v2/pokemon/${nomeSemHifen}`);
      }

      if (respostaAPI.ok) {
        const pokeData = await respostaAPI.json();

        numPokedex.textContent = `#${String(pokeData.id).padStart(3, '0')}`;

        const imagemUrl = pokeData.sprites.other['official-artwork'].front_default || pokeData.sprites.front_default;
        if (imagemUrl) {
          spriteImg.src = imagemUrl;
          spriteImg.classList.remove('escondido');
          if (spriteLoading) spriteLoading.style.display = 'none';
        }

        pokeData.types.forEach(t => {
          const span = document.createElement('span');
          span.className = 'badge-tipo';
          span.textContent = t.type.name.toUpperCase();
          tiposContainer.appendChild(span);
        });

        try {
          const resEspecie = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokeData.id}`);
          if (resEspecie.ok) {
            const espData = await resEspecie.json();
            const genus = espData.genera.find(g => g.language.name === 'en');
            if (genus) {
              categoriaPokemon.textContent = `Categoria: ${genus.genus}`;
            }
          }
        } catch (e) {
          categoriaPokemon.textContent = 'Categoria: Unknown';
        }

      } else {
        throw new Error('Pokémon não encontrado na PokéAPI');
      }
    } catch (error) {
      console.warn('Erro PokéAPI:', error);
      if (spriteLoading) spriteLoading.textContent = 'Foto indisponível';
      categoriaPokemon.textContent = 'Categoria: Indisponível';
    }
  }

  if (eVitória) {
    tituloVeredito.textContent = 'CASO SOLUCIONADO!';
    badgeStatus.textContent = 'Suspeito Capturado e Custodiado';
    badgeStatus.className = 'badge-status status-vitoria';

    mensagemJustificativa.textContent = 'O mandado de prisão foi cumprido com sucesso com base nas evidências apresentadas.';
    scoreBonus.textContent = '+500 pts';
    scoreRank.textContent = 'RANK S';
  } else {
    tituloVeredito.textContent = 'CRIME NÃO SOLUCIONADO';
    badgeStatus.textContent = 'Caso Arquivado / Mandado Rejeitado';
    badgeStatus.className = 'badge-status status-derrota';

    mensagemJustificativa.textContent = dados.mensagem || 'O suspeito informado não corresponde às evidências levantadas.';
    scoreBonus.textContent = '+0 pts';
    scoreRank.textContent = 'RANK F';
  }
});