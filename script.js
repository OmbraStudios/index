function checkModelFiles() {
    fetch('./resource/Twist.mtl')
        .then(response => {
            if (!response.ok) throw new Error('MTL file not found');
            return fetch('./resource/Twist.obj');
        })
        .then(response => {
            if (!response.ok) throw new Error('OBJ file not found');
            console.log('Model files exist');
        })
        .catch(error => {
            console.error('Model file check failed:', error);
            document.getElementById('model-container').innerHTML = 
                '<div style="color: red; padding: 20px;">Error loading 3D model: ' + error.message + '</div>';
        });
}

checkModelFiles();

particlesJS('particles-js', {
    particles: {
        number: {
            value: 80,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: "#80ff80"
        },
        shape: {
            type: "circle",
        },
        opacity: {
            value: 0.6,
            random: false,
            animation: {
                enable: true,
                speed: 1,
                opacity_min: 0.4,
                sync: false
            }
        },
        size: {
            value: 3,
            random: true,
            animation: {
                enable: true,
                speed: 2,
                size_min: 0.3,
                sync: false
            }
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: "#0ff",
            opacity: 0.4,
            width: 1,
            shadow: {
                enable: true,
                color: "#0ff",
                blur: 5
            }
        },
        move: {
            enable: true,
            speed: 2,
            direction: "none",
            random: true,
            straight: false,
            out_mode: "bounce",
            bounce: false,
            attract: {
                enable: true,
                rotateX: 600,
                rotateY: 1200
            }
        }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: {
                enable: true,
                mode: "bubble"
            },
            onclick: {
                enable: true,
                mode: "push"
            },
            resize: true
        },
        modes: {
            bubble: {
                distance: 200,
                size: 8,
                duration: 2,
                opacity: 1,
                speed: 3
            },
            push: {
                particles_nb: 4
            }
        }
    },
    retina_detect: true
});

// Add subtle hover effect sound
const buttons = document.querySelectorAll('.game-button, .social-button');
buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZRA0PVq3n77BdGAg+ltryxnMpBSl+zPLaizsIGGS57OihUBELTKXh8bllHgU2jdXzzn0vBSF1xe/fkUMLD1yx6OyrWBUIQ5zd8sFuJAUuhM/z1YU2Bhxqvu7mnEYODlOq5O+zYBoGPJPY88p2KwUme8rx3I4+CRZiturqpVITC0mi4PK8aB8GM4nU8tGAMQYfcsPs4ZRGDg1Zr+Xvtl4aBTqP1/PMeS0FJHnJ8d+RQAkUYLPp66pWFQlEnN/yw28lBS2D0PPWiDcHG2m+7eeeSQ8MUqjj77ViGwY5kdbyy3gsBSR3yfDgk0IKEl6z6eytWRYIQZrd8sNxJwUrgs7z2Io5CBpnve3pn0sPDFCm4u+3ZR0GN4/V8s59LwUidMXv4ZVECxFcsujtr1sXCECY3PLEcygFKYDN8tuLOwgZZrzs6KFOEAtOpOHwuWYeBTWL1PPQfzEGIHLE7uKWRgwQWrDm77lgGQc+ltnyzHksBSZ7yvHekD8JFmG16uymUxQLSaHf8r1qIAUyiNPy04QyBh5vwu7kmEcODVes5e63YRoFOpDW8s57LgUlecnw4JNCChNgsunsr1cWCUSb3vLEcycFLIHN89qLOggaZ7zt6KBMEAxPpeLvt2QcBjiP1vLNei4FI3bH7+GWRAsRXLLo7bBbGAdAmt3yxHMpBSqAzfLbiz4JGma87OihThALTaTh8LlmHgU1i9Tz0H8xBiBzxO7ilkYMEFmv5u+5YBkGPZbZ8sx5LAUme8rx3pA/CRZhtersp1QUC0mh3/K9aiAFMojT8tOEMgYeb8Hu45hHDg1XrOXut2EaBTqQ1vLOey4FJXnJ8OCTQgoTYLLp7K9XFglEm97yxHAnBSyBzfPaizwIGme87OihTBAMT6Xi77dkHAY4j9byznouBSN2x+/hlkQLEVyy6O2wWxgHQJrd8sRzKQUq');
        audio.play();
    });
});

// Add color switch functionality
const colorSchemes = [
    {
        primary: '#2D00F7',
        secondary: '#F20089',
        accent: '#8900F2',
        dark: '#070707'
    },
    {
        primary: '#00F7B5',
        secondary: '#F74700',
        accent: '#00C4F7',
        dark: '#070707'
    },
    {
        primary: '#F700D8',
        secondary: '#00F7E6',
        accent: '#F7B500',
        dark: '#070707'
    }
];

let currentScheme = 0;

document.getElementById('colorSwitch').addEventListener('click', () => {
    currentScheme = (currentScheme + 1) % colorSchemes.length;
    const scheme = colorSchemes[currentScheme];
    
    document.documentElement.style.setProperty('--primary', scheme.primary);
    document.documentElement.style.setProperty('--secondary', scheme.secondary);
    document.documentElement.style.setProperty('--accent', scheme.accent);
    document.documentElement.style.setProperty('--dark', scheme.dark);
    
    document.body.style.background = scheme.dark;
    
    if (pJSDom && pJSDom[0]) {
        pJSDom[0].pJS.particles.color.value = scheme.primary;
        pJSDom[0].pJS.particles.line_linked.color = scheme.primary;
        pJSDom[0].pJS.fn.particlesRefresh();
    }
});

// Model loading and scene setup
let scene, camera, renderer, model;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Make background transparent
    document.getElementById('scene-container').appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Increased intensity
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2); // Increased intensity
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    camera.position.z = 5; // Moved camera closer

    // Load model with error handling
    const mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath('./resource/');
    mtlLoader.load('Twist.mtl', 
        // Success callback
        function(materials) {
            console.log('MTL loaded successfully');
            materials.preload();
            
            const objLoader = new THREE.OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.setPath('./resource/');
            objLoader.load('Twist.obj', 
                // Success callback
                function(object) {
                    console.log('OBJ loaded successfully');
                    model = object;
                    
                    // Center and scale model
                    const box = new THREE.Box3().setFromObject(model);
                    const center = box.getCenter(new THREE.Vector3());
                    model.position.sub(center);
                    const scale = 3 / box.getSize(new THREE.Vector3()).length();
                    model.scale.multiplyScalar(scale);
                    
                    scene.add(model);
                },
                // Progress callback
                function(xhr) {
                    console.log('OBJ ' + (xhr.loaded / xhr.total * 100) + '% loaded');
                },
                // Error callback
                function(error) {
                    console.error('Error loading OBJ:', error);
                }
            );
        },
        // Progress callback
        function(xhr) {
            console.log('MTL ' + (xhr.loaded / xhr.total * 100) + '% loaded');
        },
        // Error callback
        function(error) {
            console.error('Error loading MTL:', error);
        }
    );
}

function animate() {
    requestAnimationFrame(animate);
    if (model) {
        model.rotation.y += 0.005;
    }
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    init();
});
