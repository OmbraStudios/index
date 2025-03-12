let scene, camera, renderer, model;

function init() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Load 3D model
    const mtlLoader = new THREE.MTLLoader();
    mtlLoader.load('resource/Twist.mtl', 
        function(materials) {
            // Success callback
            materials.preload();

            const objLoader = new THREE.OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load('resource/Twist.obj', function(object) {
                model = object;

                // Center and scale the model
                const box = new THREE.Box3().setFromObject(model);
                const center = box.getCenter(new THREE.Vector3());
                model.position.sub(center);
                
                const scale = 2 / box.getSize(new THREE.Vector3()).length();
                model.scale.multiplyScalar(scale);

                scene.add(model);
                document.getElementById('loading').style.display = 'none';
            });
        },
        undefined,
        function(error) {
            console.error('Error loading MTL:', error);
            document.getElementById('loading').innerHTML = 'Error loading model';
        }
    );

    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    if (model) {
        model.rotation.y += 0.01;
    }

    renderer.render(scene, camera);
}

// Start the application
init();
animate();
