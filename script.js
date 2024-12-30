// Matrix Rain Effect
const canvas = document.querySelector('.matrix-rain');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>?/{}[]!@#$%^&*()';
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

function drawMatrixRain() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0F0';
    ctx.font = fontSize + 'px monospace';

    for(let i = 0; i < drops.length; i++) {
        const text = characters[Math.floor(Math.random() * characters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if(drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

setInterval(drawMatrixRain, 50);

// Interactive Elements
const magicCube = document.getElementById('magicCube');
let rotationX = 0;
let rotationY = 0;

magicCube.addEventListener('mousemove', (e) => {
    const rect = magicCube.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    rotationX = (y / rect.height - 0.5) * 180;
    rotationY = (x / rect.width - 0.5) * 180;
    
    magicCube.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
});

magicCube.addEventListener('mouseleave', () => {
    magicCube.style.transform = 'rotate(0deg)';
});

// Code Block Interaction
document.querySelectorAll('.code-block').forEach(block => {
    block.addEventListener('click', () => {
        block.style.transform = 'scale(1.1)';
        setTimeout(() => {
            block.style.transform = 'scale(1)';
        }, 200);
    });
});

// Responsive Canvas Resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
function goToLupin() {
    window.location.href = "lupin.html";
}
const vertexShader = `
    void main() {
        gl_Position = vec4(position, 1.0);
    }
`;

const fragmentShader = `
    uniform vec2 iResolution;
    uniform float iTime;
    uniform vec2 iMouse;

    #define R iResolution
    #define T iTime
    #define M iMouse
    #define PI 3.14159265359
    #define PI2 6.28318530718

    mat2 rot(float a) { return mat2(cos(a), sin(a), -sin(a), cos(a)); }
    vec3 hue(float t, float f) { return f + f * cos(PI2 * t * (vec3(1., .75, .75) + vec3(.96, .57, .12))); }
    float box(vec2 p, vec2 b) { vec2 d = abs(p) - b; return length(max(d, 0.)) + min(max(d.x, d.y), 0.); }

    void mainImage(out vec4 O, in vec2 F) {
        vec3 C = vec3(0.0);
        vec2 uv = (2.0 * F - R.xy) / max(R.x, R.y);

        uv *= rot(T * 0.095);
        uv = vec2(log(length(uv)), atan(uv.y, uv.x) * 6. / PI2);
        float scale = 8.0;

        for (float i = 0.0; i < 4.0; i++) {
            float px = fwidth(uv.x * scale);
            float d = box(uv - vec2(0.5, 0.5), vec2(0.25));
            vec3 clr = hue(uv.x + (i * 8.0), (0.5 + i) * 0.15);
            C = mix(C, vec3(0.001), smoothstep(px, -px, d));
            scale *= 0.5;
        }

        C = pow(C, vec3(0.4545));
        O = vec4(C, 1.0);
    }

    void main() {
        mainImage(gl_FragColor, gl_FragCoord.xy);
    }
`;

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#shader'),
    antialias: true
});

const uniforms = {
    iTime: { value: 0 },
    iResolution: { value: new THREE.Vector2() },
    iMouse: { value: new THREE.Vector2() }
};

const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms
});

const geometry = new THREE.PlaneGeometry(2, 2);
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    uniforms.iResolution.value.set(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', resize);
resize();

function animate(time) {
    uniforms.iTime.value = time * 0.001;
    renderer.render(scene, camera);

    updateParticles();
    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
