let scene, camera, renderer, model, city, mixer, clock;

function init() {
    clock = new THREE.Clock();
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.002);
    
    // Enhanced camera settings for city view
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(100, 100, 100);
    camera.lookAt(0, 0, 0);

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Night lighting
    const ambientLight = new THREE.AmbientLight(0x101010);
    scene.add(ambientLight);

    // Street lights
    const streetLights = [];
    for(let i = 0; i < 20; i++) {
        const light = new THREE.PointLight(0xffa500, 1, 50);
        light.position.set(
            Math.random() * 200 - 100,
            15,
            Math.random() * 200 - 100
        );
        scene.add(light);
        streetLights.push(light);
    }

    // Load city model
    const loader = new THREE.GLTFLoader();
    
    // Load free city model from Open3DModel - reference: https://open3dmodel.com/3d-models/low-poly-city_45290.html
    loader.load('https://open3dmodel.com/download/low-poly-city.glb', (gltf) => {
        city = gltf.scene;
        city.scale.set(10, 10, 10);
        scene.add(city);

        // Animation mixer for vehicles
        mixer = new THREE.AnimationMixer(city);
        gltf.animations.forEach((clip) => {
            mixer.clipAction(clip).play();
        });

    }, undefined, (error) => {
        console.error('Error loading city:', error);
    });

    // Add roads
    const roadGeometry = new THREE.PlaneGeometry(500, 500);
    const roadMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333,
        roughness: 0.8,
    });
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.rotation.x = -Math.PI / 2;
    scene.add(road);

    // Add original model loading code
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

    // Add stars
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = [];
    for(let i = 0; i < 10000; i++) {
        starPositions.push(
            Math.random() * 2000 - 1000,
            Math.random() * 2000 - 1000,
            Math.random() * 2000 - 1000
        );
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 0.5 });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

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

    // Update animations
    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);

    // Rotate camera slowly around the scene
    if (camera.position) {
        camera.position.x = Math.cos(Date.now() * 0.0001) * 150;
        camera.position.z = Math.sin(Date.now() * 0.0001) * 150;
        camera.lookAt(0, 0, 0);
    }

    // Original model rotation
    if (model) {
        model.rotation.y += 0.01;
    }

    renderer.render(scene, camera);
}

// Add WebSocket connection
const socket = new WebSocket('ws://' + window.location.host);

socket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    
    if (data.type === 'modelUpdate') {
        // Reload model with new data
        reloadModel();
    }
    
    if (data.type === 'sceneUpdate') {
        // Update scene parameters
        updateScene(data.params);
    }
};

function reloadModel() {
    if (model) {
        scene.remove(model);
    }
    
    const mtlLoader = new THREE.MTLLoader();
    mtlLoader.load('resource/Twist.mtl?t=' + Date.now(), // Add timestamp to prevent caching
        function(materials) {
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
}

function updateScene(params) {
    if (model) {
        if (params.rotation) {
            model.rotation.set(
                params.rotation.x || model.rotation.x,
                params.rotation.y || model.rotation.y,
                params.rotation.z || model.rotation.z
            );
        }
        
        if (params.scale) {
            model.scale.set(
                params.scale.x || model.scale.x,
                params.scale.y || model.scale.y,
                params.scale.z || model.scale.z
            );
        }
    }
    
    if (params.camera) {
        camera.position.set(
            params.camera.x || camera.position.x,
            params.camera.y || camera.position.y,
            params.camera.z || camera.position.z
        );
    }
}

// Add error handling for WebSocket
socket.onerror = function(error) {
    console.error('WebSocket error:', error);
};

socket.onclose = function() {
    console.log('WebSocket connection closed. Attempting to reconnect...');
    setTimeout(() => {
        window.location.reload();
    }, 3000);
};

// Start the application
init();
animate();
