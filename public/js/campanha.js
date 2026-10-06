async function carregarCasosRank(rank) {
  const container = document.getElementById('container-pastas');
  container.innerHTML = '<p style="color: #f4ebd9; font-size: 1.2rem;">Abrindo arquivos secretos...</p>';

  document.querySelectorAll('.aba-rank').forEach(aba => {
    aba.classList.remove('active');
    if (aba.innerText.trim() === `RANK ${rank}`) {
      aba.classList.add('active');
    }
  });

  try {
    const resposta = await fetch(`/api/casos/rank/${rank}`);
    const casos = await resposta.json();

    container.innerHTML = '';

    if (casos.length === 0) {
      container.innerHTML = `<p style="color: #f4ebd9; font-size: 1.2rem;">Nenhum caso arquivado no Rank ${rank}.</p>`;
      return;
    }

    const zonas = [
      { top: 10, left: 10 }, 
      { top: 15, left: 60 },  
      { top: 40, left: 20 },  
      { top: 38, left: 65 },  
      { top: 25, left: 40 }   
    ];

    casos.forEach((caso, index) => {
      const pasta = document.createElement('article');
      pasta.className = 'pasta-caso';

      const zona = zonas[index % zonas.length];
      const variacaoX = Math.floor(Math.random() * 16) - 8;
      const variacaoY = Math.floor(Math.random() * 16) - 8;

      const posTop = Math.max(5, Math.min(55, zona.top + variacaoY));
      const posLeft = Math.max(5, Math.min(72, zona.left + variacaoX));

      const anguloAleatorio = Math.floor(Math.random() * 24) - 12;

      pasta.style.top = `${posTop}%`;
      pasta.style.left = `${posLeft}%`;
      pasta.style.transform = `rotate(${anguloAleatorio}deg)`;
      pasta.style.zIndex = index + 1;

      pasta.innerHTML = `
        <div class="carimbo-confidencial">CONFIDENCIAL</div>
        <div>
          <span class="numero-caso">${caso.numero_caso}</span>
          <h2 class="titulo-caso">${caso.titulo}</h2>
        </div>
        <div class="tag-dificuldade">Dificuldade: ${caso.dificuldade}</div>
      `;

      pasta.addEventListener('click', () => {
        window.location.href = `/investigacao?id=${caso._id}`;
      });

      container.appendChild(pasta);
    });

  } catch (error) {
    console.error('Erro ao carregar casos:', error);
    container.innerHTML = '<p style="color: #ff6b6b;">Erro ao carregar ficheiros de casos.</p>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  carregarCasosRank('D');
});