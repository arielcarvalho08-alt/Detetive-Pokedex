document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const casoId = urlParams.get('id');
  const tipoCaso = urlParams.get('tipo');

  const btnVoltar = document.querySelector('.btn-voltar-caso');
  if (btnVoltar && tipoCaso === 'diario') {
    btnVoltar.href = '/diario';
  }

  let endpointAPI = '';
  let endpointMandado = '';

  if (tipoCaso === 'diario') {
    endpointAPI = '/api/casos/daily';
    endpointMandado = '/api/casos/daily/mandado';
  } else if (casoId) {
    endpointAPI = `/api/casos/${casoId}`;
    endpointMandado = `/api/casos/${casoId}/mandado`;
  } else {
    endpointAPI = '/api/casos/daily';
    endpointMandado = '/api/casos/daily/mandado';
  }

  try {
    const resposta = await fetch(endpointAPI);
    if (!resposta.ok) throw new Error('Caso não encontrado.');
    
    let caso = await resposta.json();
    if (Array.isArray(caso)) caso = caso[0];

    console.log('📦 Dados recebidos do Caso:', caso);
    renderizarCaso(caso);

  } catch (error) {
    console.error('Erro ao carregar caso:', error);
    const tituloEl = document.getElementById('titulo-caso');
    if (tituloEl) tituloEl.innerText = 'Erro ao carregar o caso.';
  }

  const formMandado = document.getElementById('form-mandado');
  if (formMandado) {
    formMandado.addEventListener('submit', async (e) => {
      e.preventDefault();

      const inputSuspeito = document.getElementById('input-suspeito');
      const palpite = inputSuspeito ? inputSuspeito.value.trim() : '';

      if (!palpite) return;

      try {
        const resposta = await fetch(endpointMandado, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ palpite })
        });

        const dados = await resposta.json();

        dados.tipoCaso = tipoCaso;
        dados.casoId = casoId;
        dados.palpite = palpite;

        sessionStorage.setItem('resultado_investigacao', JSON.stringify(dados));
        window.location.href = '/conclusao';

      } catch (error) {
        console.error('Erro ao validar mandado:', error);
        alert('Erro ao conectar ao servidor para emitir mandado.');
      }
    });
  }
});

function renderizarCaso(caso) {
  if (!caso) return;

  const tituloEl = document.getElementById('titulo-caso');
  if (tituloEl) {
    tituloEl.innerText = `${caso.numero_caso || ''} - ${caso.titulo || 'Sem Título'}`;
  }

  const rankEl = document.getElementById('rank-caso');
  if (rankEl) {
    rankEl.innerText = `RANK ${caso.rank || 'D'}`;
  }

  const campoRelatorio = document.getElementById('descricao-caso');
  if (campoRelatorio) {
    campoRelatorio.innerText = caso.relatorio || caso.descricao || 'Sem relatório cadastrado para este caso.';
  }

  const listaPistas = document.getElementById('lista-pistas');
  if (listaPistas) {
    listaPistas.innerHTML = '';
    const pistas = caso.pistas || [];

    if (pistas.length > 0) {
      pistas.forEach(pista => {
        const li = document.createElement('li');
        if (typeof pista === 'object' && pista !== null) {
          const nomePista = pista.nome ? `<strong>${pista.nome}:</strong> ` : '';
          const textoPista = pista.descricao_revelada || pista.texto || pista.descricao || JSON.stringify(pista);
          li.innerHTML = `${nomePista}${textoPista}`;
        } else {
          li.innerText = pista;
        }
        listaPistas.appendChild(li);
      });
    } else {
      listaPistas.innerHTML = '<li>Nenhuma pista registrada.</li>';
    }
  }

  const listaDepoimentos = document.getElementById('lista-depoimentos');
  if (listaDepoimentos) {
    listaDepoimentos.innerHTML = '';
    const depoimentos = caso.depoimentos || [];

    if (depoimentos.length > 0) {
      depoimentos.forEach(dep => {
        const div = document.createElement('div');
        div.className = 'cartao-depoimento';
        if (typeof dep === 'object' && dep !== null) {
          const autor = dep.testemunha || dep.autor || dep.nome || 'Testemunha';
          const texto = dep.texto || dep.conteudo || dep.depoimento || 'Sem depoimento registrado.';
          div.innerHTML = `<p><strong>${autor}:</strong> "${texto}"</p>`;
        } else {
          div.innerHTML = `<p>"${dep}"</p>`;
        }
        listaDepoimentos.appendChild(div);
      });
    } else {
      listaDepoimentos.innerHTML = '<p>Nenhum depoimento registrado para este caso.</p>';
    }
  }
}