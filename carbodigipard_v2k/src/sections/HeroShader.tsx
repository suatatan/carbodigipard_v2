import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float u_time;
  uniform vec2 u_mouse;
  uniform vec2 u_resolution;
  uniform float u_waveSpeed;
  uniform float u_waveFrequency;
  uniform float u_lineThickness;
  uniform float u_lineGlow;
  uniform float u_mouseActive;

  const vec3 baseColor = vec3(0.06, 0.14, 0.10);
  const vec3 lineColor = vec3(0.31, 0.55, 0.34);
  const vec3 highlightColor = vec3(0.37, 0.87, 0.58);
  const vec3 glowColor = vec3(0.16, 0.40, 0.24);
  const float scale = 40.0;

  float box(vec2 p, vec2 b) {
    vec2 d = abs(p) - b;
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
  }

  float wave(vec2 pos, float time, float freq, float speed) {
    float dist = length(pos);
    float wave1 = sin(dist * freq - time * speed);
    float wave2 = sin(dist * (freq * 0.5) - time * speed * 0.8);
    float wave3 = sin(pos.x * freq * 0.3 + pos.y * freq * 0.2 - time * speed * 0.5);
    return (wave1 + wave2 * 0.5 + wave3 * 0.25) / 1.75;
  }

  float gridCell(vec2 p, float thickness) {
    vec2 gridUV = fract(p) - 0.5;
    float line = min(abs(gridUV.x), abs(gridUV.y));
    return 1.0 - smoothstep(0.0, thickness, line);
  }

  vec2 rippleDistortion(vec2 uv, float time) {
    vec2 mouse = (u_mouse * 2.0 - 1.0);
    mouse.y = -mouse.y;
    vec2 toMouse = uv - mouse;
    float distToMouse = length(toMouse);
    float distortionAmount = 0.0;
    if (u_mouseActive > 0.5) {
      distortionAmount = exp(-distToMouse * distToMouse * 4.0) * wave(toMouse, time, u_waveFrequency, u_waveSpeed);
    }
    return normalize(toMouse + 0.001) * distortionAmount;
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - u_resolution * 0.5) / min(u_resolution.x, u_resolution.y);
    float time = u_time;
    vec2 distortion = rippleDistortion(uv, time);
    vec2 distortedUV = uv + distortion * 0.4;
    vec2 grid = distortedUV * scale;
    float gridLine = gridCell(grid, u_lineThickness);
    float glow = gridCell(grid, u_lineThickness + u_lineGlow);
    glow = glow - gridLine;
    vec3 col = baseColor;
    col = mix(col, glowColor, glow * 0.15);
    col += lineColor * gridLine;
    vec2 mouse = (u_mouse * 2.0 - 1.0);
    mouse.y = -mouse.y;
    float distToMouse = length(uv - mouse);
    if (u_mouseActive > 0.5) {
      col += highlightColor * exp(-distToMouse * distToMouse * 4.0) * (sin(time * 3.0) * 0.25 + 0.75);
    }
    float vignette = 1.0 - smoothstep(0.4, 1.4, length(uv * vec2(0.8, 1.0)));
    col *= vignette;
    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function HeroShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new THREE.PlaneGeometry(2, 2);

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        u_time: { value: 0.0 },
        u_mouse: { value: new THREE.Vector2(-1.0, -1.0) },
        u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        u_waveSpeed: { value: 1.0 },
        u_waveFrequency: { value: 8.0 },
        u_lineThickness: { value: 0.008 },
        u_lineGlow: { value: 0.4 },
        u_mouseActive: { value: 0.0 },
      },
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    let mouseX = -1;
    let mouseY = -1;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX / window.innerWidth;
      mouseY = 1.0 - e.clientY / window.innerHeight;
      material.uniforms.u_mouse.value.set(mouseX, mouseY);
      material.uniforms.u_mouseActive.value = 1.0;
    };

    const handleMouseLeave = () => {
      material.uniforms.u_mouseActive.value = 0.0;
    };

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      material.uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    // Auto-play ripple from center
    material.uniforms.u_mouse.value.set(0.5, 0.5);
    material.uniforms.u_mouseActive.value = 0.3;

    const clock = new THREE.Clock();
    let animId: number;

    function animate() {
      animId = requestAnimationFrame(animate);
      material.uniforms.u_time.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
    />
  );
}
