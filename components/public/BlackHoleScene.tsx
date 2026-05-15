'use client';

import { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// GLSL Shaders ported exactly from the original
const diskVertexShader = `
varying vec2 vUv; 
varying vec3 vPos;
void main() { 
    vUv = uv; 
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); 
}
`;

const diskFragmentShader = `
varying vec2 vUv; 
varying vec3 vPos; 
uniform float u_time;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

void main() {
    float rRaw = length(vPos.xy);
    float r = (rRaw - 2.0) / 4.0;
    
    float angle = atan(vPos.y, vPos.x);
    float time = u_time * 0.5; 
    
    float swirl = r * 4.0 - time;
    vec2 noiseUv = vec2(vPos.x * 0.4 + cos(swirl)*0.5, vPos.y * 0.4 + sin(swirl)*0.5);
    float cloudNoise = snoise(noiseUv * 1.5);
    
    float detailNoise = snoise(vec2(angle * 4.0, rRaw * 1.5 - time * 2.0));
    
    float combinedNoise = mix(cloudNoise, detailNoise, 0.4);
    
    vec3 deepRed = vec3(0.4, 0.02, 0.05);
    vec3 red = vec3(0.9, 0.1, 0.05);
    vec3 lightOrange = vec3(1.0, 0.55, 0.25);
    vec3 electricBlue = vec3(0.2, 0.6, 1.0);
    
    vec3 color = mix(lightOrange, deepRed, smoothstep(0.1, 0.9, r));
    
    float midIntensity = smoothstep(0.2, 0.4, r) * (1.0 - smoothstep(0.7, 0.95, r));
    
    vec3 cloudColor = mix(red, lightOrange, combinedNoise * 0.5 + 0.3);
    
    color += cloudColor * midIntensity * (0.4 + 0.6 * combinedNoise);
    
    float innerGlow = smoothstep(0.25, 0.05, r);
    color = mix(color, electricBlue, innerGlow * 0.8);
    
    float zDist = abs(vPos.z);
    float tubeFade = 1.0 - smoothstep(0.8, 2.2, zDist); 
    
    float outerLimit = 0.85 + combinedNoise * 0.12; 
    float outerFade = 1.0 - smoothstep(outerLimit - 0.2, outerLimit + 0.1, r);
    float innerFade = smoothstep(0.1, 0.2, r);
    
    float denseAlpha = tubeFade * outerFade * innerFade;
    denseAlpha = max(denseAlpha, midIntensity * tubeFade * 0.95); 
    denseAlpha *= 0.7 + 0.3 * combinedNoise;

    float haloFade = 1.0 - smoothstep(0.8, 1.0, r);
    float haloAlpha = haloFade * innerFade * tubeFade * 0.3;
    
    float alpha = denseAlpha + haloAlpha;
    alpha = clamp(alpha, 0.0, 1.0);
    
    if (denseAlpha < 0.1) {
        color = mix(color, red, 0.5);
    }
    
    if (alpha < 0.001) discard;
    
    gl_FragColor = vec4(color * 2.5, alpha);
}
`;

const jetVertexShader = `
varying vec2 vUv; 
uniform float u_time;
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 = v - i + dot(i, C.xxx) ;
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute( permute( permute( 
                i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
            + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww ;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}

void main() { 
    vUv = uv; 
    
    vec3 pos = position;
    
    float displacementStr = 0.3 * uv.y;
    float noiseVal = snoise(vec3(pos.y * 0.5, pos.x * 0.5, u_time * 2.0));
    
    pos.x += noiseVal * displacementStr;
    pos.z += snoise(vec3(pos.y * 0.5 + 10.0, pos.z * 0.5, u_time * 2.0)) * displacementStr;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0); 
}
`;

const jetFragmentShader = `
varying vec2 vUv; uniform float u_time;
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

void main() {
    float speed = 10.0; 
    float noise = snoise(vec2(vUv.x * 3.0, vUv.y * 15.0 - u_time * speed));
    
    float emitterGlow = 1.0 - smoothstep(0.0, 0.2, vUv.y);
    emitterGlow = pow(emitterGlow, 2.0) * 2.0;
    
    float coreIntensity = 1.0 - abs(vUv.x - 0.5) * 2.0; 
    
    float vaporNoise = snoise(vec2(vUv.x * 12.0, vUv.y * 6.0 - u_time * 3.0));
    float vaporEdge = smoothstep(0.0, 0.5 + vaporNoise * 0.3, coreIntensity);
    
    noise = pow(abs(noise), 1.2); 
    
    vec3 blueCore = vec3(0.2, 0.6, 1.0);
    vec3 whiteHot = vec3(0.95, 0.98, 1.0);
    
    vec3 color = mix(blueCore, whiteHot, noise + emitterGlow * 0.5);
    
    float lengthFade = smoothstep(0.0, 0.1, vUv.y) * (1.0 - smoothstep(0.8, 1.0, vUv.y));
    
    float narrowEndGlow = 1.0 - smoothstep(0.0, 0.1, vUv.y);
    narrowEndGlow = pow(narrowEndGlow, 3.0) * 3.0;
    
    lengthFade = max(lengthFade, emitterGlow);
    lengthFade = max(lengthFade, narrowEndGlow);
    
    float alpha = vaporEdge * lengthFade * (0.6 + 0.4 * noise); 
    alpha = clamp(alpha + emitterGlow * 0.5 + narrowEndGlow * 0.8, 0.0, 1.0);
    
    gl_FragColor = vec4(color * 1.5, alpha); 
}
`;

interface BlackHoleSceneProps {
  bloomIntensity?: number;
  diskRotationSpeed?: number;
  starCount?: number;
}

export default function BlackHoleScene({
  bloomIntensity = 1.2,
  diskRotationSpeed = 0.5,
  starCount = 20000,
}: BlackHoleSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    composer: EffectComposer;
    clock: THREE.Clock;
    blackHoleGroup: THREE.Group;
    disk: THREE.Mesh;
    diskMaterial: THREE.ShaderMaterial;
    jetMaterial: THREE.ShaderMaterial;
    backgroundParticles: THREE.Points;
    mouse: THREE.Vector2;
    animationId: number;
  } | null>(null);

  // Memoize the config to avoid unnecessary re-initializations
  const config = useMemo(() => ({ bloomIntensity, diskRotationSpeed, starCount }), [bloomIntensity, diskRotationSpeed, starCount]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 15);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Post-processing
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      config.bloomIntensity,
      0.8,
      0.5
    );
    composer.addPass(bloomPass);

    const clock = new THREE.Clock();

    // Create scene objects
    const blackHoleGroup = new THREE.Group();

    // Black sphere
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.8, 64, 64),
      new THREE.MeshBasicMaterial({ color: 0x000000 })
    );
    blackHoleGroup.add(sphere);

    // Accretion disk
    const diskMat = new THREE.ShaderMaterial({
      vertexShader: diskVertexShader,
      fragmentShader: diskFragmentShader,
      uniforms: { u_time: { value: 0.0 } },
      transparent: true,
      side: THREE.DoubleSide,
    });
    const disk = new THREE.Mesh(new THREE.TorusGeometry(4.0, 2.0, 64, 200), diskMat);
    disk.rotation.x = -Math.PI / 2;
    disk.scale.z = 0.1;
    blackHoleGroup.add(disk);

    // Relativistic jets
    const jetMat = new THREE.ShaderMaterial({
      vertexShader: jetVertexShader,
      fragmentShader: jetFragmentShader,
      uniforms: { u_time: { value: 0.0 } },
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    const flowGeometry = new THREE.CylinderGeometry(2.0, 0.1, 20, 32, 20, true);
    flowGeometry.translate(0, 10, 0);

    const topJet = new THREE.Mesh(flowGeometry, jetMat);
    topJet.position.y = 0;

    const bottomJet = new THREE.Mesh(flowGeometry, jetMat);
    bottomJet.rotation.x = Math.PI;
    bottomJet.position.y = 0;

    blackHoleGroup.add(topJet, bottomJet);
    scene.add(blackHoleGroup);

    // Background particles (stars)
    const particleCount = config.starCount;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.05,
      transparent: true,
      opacity: 0.5,
    });
    const backgroundParticles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(backgroundParticles);

    // Mouse tracking
    const mouse = new THREE.Vector2();

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) - 0.5;
      mouse.y = (e.clientY / window.innerHeight) - 0.5;
    };
    window.addEventListener('mousemove', onMouseMove);

    // Resize handler
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // Store refs
    sceneRef.current = {
      scene,
      camera,
      renderer,
      composer,
      clock,
      blackHoleGroup,
      disk,
      diskMaterial: diskMat,
      jetMaterial: jetMat,
      backgroundParticles,
      mouse,
      animationId: 0,
    };

    // Animation loop
    const animate = () => {
      const ref = sceneRef.current;
      if (!ref) return;

      ref.animationId = requestAnimationFrame(animate);
      const elapsedTime = ref.clock.getElapsedTime();

      ref.diskMaterial.uniforms.u_time.value = elapsedTime;
      ref.jetMaterial.uniforms.u_time.value = elapsedTime;
      ref.backgroundParticles.rotation.y -= 0.0001;
      if (ref.disk) ref.disk.rotation.z -= 0.01 * config.diskRotationSpeed;

      if (window.innerWidth > 768) {
        ref.camera.position.x += (ref.mouse.x * 2 - ref.camera.position.x) * 0.02;
        ref.camera.position.y += (-ref.mouse.y * 2 - ref.camera.position.y) * 0.02;
      }
      ref.camera.lookAt(ref.scene.position);
      ref.composer.render();
    };

    animate();

    // Cleanup
    return () => {
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId);
      }
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      container.removeChild(renderer.domElement);
      sceneRef.current = null;
    };
  }, [config]);

  // Expose the blackHoleGroup and camera for GSAP scroll animations
  useEffect(() => {
    if (sceneRef.current) {
      (window as unknown as Record<string, unknown>).__blackHoleGroup = sceneRef.current.blackHoleGroup;
      (window as unknown as Record<string, unknown>).__camera = sceneRef.current.camera;
      (window as unknown as Record<string, unknown>).__blackHoleScene = sceneRef.current;
    }
  });

  return (
    <div
      ref={containerRef}
      id="webgl-canvas-container"
      className="fixed top-0 left-0 w-full h-full z-1"
    />
  );
}
