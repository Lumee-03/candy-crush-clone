const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // céu azul

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('game-container').appendChild(renderer.domElement);

// Luz
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 10, 10);
scene.add(light);

// Chão
const textureLoader = new THREE.TextureLoader();
const groundTexture = textureLoader.load('textures/ground.jpg');
groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.repeat.set(50, 50);

const groundMaterial = new THREE.MeshStandardMaterial({ map: groundTexture });
const ground = new THREE.Mesh(new THREE.PlaneGeometry(500, 500), groundMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Soldado
let player;
const loader = new THREE.GLTFLoader();
loader.load('models/soldier.glb', (gltf) => {
  player = gltf.scene;
  player.scale.set(2, 2, 2);
  player.position.set(0, 0, 0);
  scene.add(player);
});

// Movimento
const keys = {};
document.addEventListener('keydown', (e) => keys[e.key.toLowerCase()] = true);
document.addEventListener('keyup', (e) => keys[e.key.toLowerCase()] = false);

// Animação
function animate() {
  requestAnimationFrame(animate);

  if (player) {
    if (keys['w']) player.position.z -= 0.1;
    if (keys['s']) player.position.z += 0.1;
    if (keys['a']) player.position.x -= 0.1;
    if (keys['d']) player.position.x += 0.1;

    camera.position.x = player.position.x + 5;
    camera.position.y = player.position.y + 5;
    camera.position.z = player.position.z + 10;
    camera.lookAt(player.position);
  }

  renderer.render(scene, camera);
}
animate();

