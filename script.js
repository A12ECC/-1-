// Initialize Three.js components
let scene, camera, renderer, earth, clouds, stars;
let earthGroup;

// Initialize the scene
function init() {
    // Create scene
    scene = new THREE.Scene();
    
    // Create camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 250;
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('earth-container').appendChild(renderer.domElement);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);
    
    const sunLight = new THREE.DirectionalLight(0xFFFFFF, 1);
    sunLight.position.set(5, 3, 5);
    scene.add(sunLight);
    
    // Create Earth group to hold Earth and clouds
    earthGroup = new THREE.Group();
    scene.add(earthGroup);
    
    // Create Earth sphere
    const earthGeometry = new THREE.SphereGeometry(50, 64, 64);
    
    // Earth texture - using a public URL
    const earthTexture = new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg');
    const earthMaterial = new THREE.MeshPhongMaterial({
        map: earthTexture,
        specular: new THREE.Color(0x333333),
        shininess: 5
    });
    
    earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earthGroup.add(earth);
    
    // Create cloud layer
    const cloudGeometry = new THREE.SphereGeometry(51, 64, 64);
    const cloudTexture = new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png');
    const cloudMaterial = new THREE.MeshPhongMaterial({
        map: cloudTexture,
        transparent: true,
        opacity: 0.8
    });
    
    clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
    earthGroup.add(clouds);
    
    // Add stars background
    addStars();
    
    // Add orbit controls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);
    
    // Start animation
    animate();
}

function addStars() {
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
        color: 0xFFFFFF,
        size: 1.2,
        sizeAttenuation: true
    });
    
    const starVertices = [];
    for (let i = 0; i < 10000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starVertices.push(x, y, z);
    }
    
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate Earth and clouds
    if (earth) earth.rotation.y += 0.001;
    if (clouds) clouds.rotation.y += 0.0015;
    
    // Rotate the entire Earth group if no mouse interaction is happening
    // (This provides a nice auto-rotation when the user isn't interacting)
    
    renderer.render(scene, camera);
}

// Initialize the scene when the page loads
window.onload = init;