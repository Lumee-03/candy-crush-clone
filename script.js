const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let player = { x: 400, y: 250, size: 20, color: 'lime', life: 100 };
let bullets = [];
let enemies = [];
let kills = 0;

// Movimento
let keys = {};
document.addEventListener('keydown', (e) => keys[e.key] = true);
document.addEventListener('keyup', (e) => keys[e.key] = false);

// Tiro com espaço
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    bullets.push({ x: player.x, y: player.y, size: 5, dx: 10 });
  }
});

// Atualização
function update() {
  // Movimento do jogador
  if (keys['ArrowUp'] || keys['w']) player.y -= 4;
  if (keys['ArrowDown'] || keys['s']) player.y += 4;
  if (keys['ArrowLeft'] || keys['a']) player.x -= 4;
  if (keys['ArrowRight'] || keys['d']) player.x += 4;

  // Limites
  player.x = Math.max(0, Math.min(canvas.width - player.size, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.size, player.y));

  // Atualizar balas
  bullets.forEach((b, i) => {
    b.x += b.dx;
    if (b.x > canvas.width) bullets.splice(i, 1);
  });

  // Inimigos
  enemies.forEach((e, i) => {
    let dx = player.x - e.x;
    let dy = player.y - e.y;
    let dist = Math.sqrt(dx * dx + dy * dy);
    e.x += (dx / dist) * 1.5;
    e.y += (dy / dist) * 1.5;

    // Colisão com jogador
    if (dist < player.size) {
      player.life -= 0.5;
      if (player.life <= 0) {
        alert("Game Over! Inimigos eliminados: " + kills);
        document.location.reload();
      }
    }

    // Colisão com bala
    bullets.forEach((b, j) => {
      let d2 = Math.hypot(b.x - e.x, b.y - e.y);
      if (d2 < 20) {
        enemies.splice(i, 1);
        bullets.splice(j, 1);
        kills++;
      }
    });
  });

  // Atualiza HUD
  document.getElementById('life').textContent = Math.max(0, Math.floor(player.life));
  document.getElementById('kills').textContent = kills;
}

// Desenhar tudo
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Jogador
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.size, player.size);

  // Balas
  ctx.fillStyle = 'yellow';
  bullets.forEach(b => ctx.fillRect(b.x, b.y + 7, b.size * 2, b.size));

  // Inimigos
  ctx.fillStyle = 'red';
  enemies.forEach(e => ctx.fillRect(e.x, e.y, 25, 25));
}

// Criar inimigos
setInterval(() => {
  const x = Math.random() > 0.5 ? 0 : canvas.width;
  const y = Math.random() * canvas.height;
  enemies.push({ x, y });
}, 1500);

// Loop do jogo
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}
gameLoop();
