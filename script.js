// Configuração básica da cena, câmera e renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("game-container").appendChild(renderer.domElement);

// Luzes
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

// Chão
const groundGeometry = new THREE.PlaneGeometry(20, 20);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Variável do jogador (modelo 3D)
let player;

// Loader GLTF para carregar o modelo 3D
const loader = new THREE.GLTFLoader();

loader.load(
  "models/soldier.glb",
  function (gltf) {
    player = gltf.scene;
    player.scale.set(2, 2, 2);
    player.position.y = 0;
    scene.add(player);
  },
  undefined,
  function (error) {
    console.error("Erro ao carregar modelo:", error);
  }
);

// Controle do teclado
const keys = {};
window.addEventListener("keydown", (e) => (keys[e.key.toLowerCase()] = true));
window.addEventListener("keyup", (e) => (keys[e.key.toLowerCase()] = false));

const speed = 0.1;

// Ajusta o tamanho do renderizador se a janela mudar
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Função de animação principal
function animate() {
  requestAnimationFrame(animate);

  if (player) {
    // Movimento básico do jogador
    if (keys["w"] || keys["arrowup"]) player.position.z -= speed;
    if (keys["s"] || keys["arrowdown"]) player.position.z += speed;
    if (keys["a"] || keys["arrowleft"]) player.position.x -= speed;
    if (keys["d"] || keys["arrowright"]) player.position.x += speed;

    // Câmera atrás e acima do jogador
    camera.position.x = player.position.x;
    camera.position.z = player.position.z + 10;
    camera.position.y = player.position.y + 5;
    camera.lookAt(player.position);
  }

  renderer.render(scene, camera);
}

animate();
