import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Login3DBackground() {
  const mountRef = useRef(null);
  const frameRef = useRef(0);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0b1220, 8, 24);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.set(0, 0.5, 6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0b1220, 0);
    container.appendChild(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);
    const dir1 = new THREE.DirectionalLight(0x2563eb, 1.3);
    dir1.position.set(5, 5, 5);
    scene.add(dir1);
    const dir2 = new THREE.DirectionalLight(0x22c55e, 0.8);
    dir2.position.set(-5, -3, 2);
    scene.add(dir2);
    const point = new THREE.PointLight(0x7c3aed, 1.2, 22);
    point.position.set(0, 0, 3);
    scene.add(point);

    // Main knot – BioPay brand blue (slightly offset on desktop so it balances with right auth card)
    const knotGeo = new THREE.TorusKnotGeometry(1.2, 0.35, 180, 32);
    const knotMat = new THREE.MeshPhysicalMaterial({
      color: 0x2563eb,
      metalness: 0.2,
      roughness: 0.25,
      clearcoat: 0.6,
      clearcoatRoughness: 0.2,
      emissive: 0x112244,
      emissiveIntensity: 0.15,
    });
    const knot = new THREE.Mesh(knotGeo, knotMat);
    // Shift left on wide desktop screens, center on mobile/tablet
    knot.position.x = width > 1024 ? -1.4 : 0;
    scene.add(knot);

    // Inner wireframe spanning wide across the scene
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x60a5fa, wireframe: true, transparent: true, opacity: 0.2 });
    const wire = new THREE.Mesh(new THREE.IcosahedronGeometry(2.1, 1), wireMat);
    wire.position.x = width > 1024 ? -1.4 : 0;
    scene.add(wire);

    // Floating particles distributed across the entire screen background (both hero & auth card halves)
    const particlesCount = 360;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 26;     // X spread across full page
      posArray[i + 1] = (Math.random() - 0.5) * 16; // Y spread
      posArray[i + 2] = (Math.random() - 0.5) * 12; // Z depth
    }
    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMat = new THREE.PointsMaterial({
      size: 0.03,
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.85,
    });
    const particles = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particles);

    // Small orbiting spheres passing across both left hero and right auth card
    const orbs = [];
    const orbColors = [0x22c55e, 0x7c3aed, 0xfbbf24, 0x38bdf8];
    for (let i = 0; i < 4; i++) {
      const o = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 24, 24),
        new THREE.MeshStandardMaterial({
          color: orbColors[i],
          emissive: orbColors[i],
          emissiveIntensity: 0.45,
          metalness: 0.5,
          roughness: 0.35,
        })
      );
      orbs.push(o);
      scene.add(o);
    }

    // Window mouse parallax so mouse movements anywhere on screen animate the scene
    let mouseX = 0, mouseY = 0;
    const onMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * -2;
    };
    window.addEventListener('mousemove', onMouseMove);

    const clock = new THREE.Clock();

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      knot.rotation.x = t * 0.25;
      knot.rotation.y = t * 0.38;
      knot.position.y = Math.sin(t * 0.8) * 0.15;

      wire.rotation.x = -t * 0.14;
      wire.rotation.y = -t * 0.2;

      particles.rotation.y = t * 0.025;

      orbs.forEach((o, i) => {
        const centerOffset = width > 1024 ? -0.5 : 0;
        const radiusX = 3.2 + i * 0.6;
        const radiusZ = 2.4 + i * 0.4;
        const speed = 0.45 + i * 0.14;
        o.position.x = centerOffset + Math.cos(t * speed + i * 1.5) * radiusX;
        o.position.z = Math.sin(t * speed + i * 1.5) * radiusZ;
        o.position.y = Math.sin(t * 1.2 + i * 1.8) * 1.2;
      });

      camera.position.x += (mouseX * 0.8 - camera.position.x) * 0.04;
      camera.position.y += (mouseY * 0.5 + 0.5 - camera.position.y) * 0.04;
      camera.lookAt(new THREE.Vector3(width > 1024 ? -0.8 : 0, 0, 0));

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      knot.position.x = w > 1024 ? -1.4 : 0;
      wire.position.x = w > 1024 ? -1.4 : 0;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      renderer.dispose();
      knotGeo.dispose();
      knotMat.dispose();
      particlesGeo.dispose();
      particlesMat.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div ref={mountRef} className="absolute inset-0 w-full h-full">
      {/* Ambient gradient overlays spanning the entire background */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(1000px 700px at 30% 50%, rgba(37,99,235,0.16), transparent 65%), radial-gradient(800px 600px at 80% 50%, rgba(124,58,237,0.12), transparent 60%), radial-gradient(600px 400px at 50% 90%, rgba(34,197,94,0.08), transparent 55%)`
      }} />
    </div>
  );
}
