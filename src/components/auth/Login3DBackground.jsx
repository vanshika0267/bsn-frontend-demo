import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Login3DBackground({ isDark = true }) {
  const mountRef = useRef(null);
  const frameRef = useRef(0);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const fogColor = isDark ? 0x000000 : 0xfafafc;
    const knotColor = isDark ? 0x3b82f6 : 0x004ac6;
    const knotEmissive = isDark ? 0x112244 : 0x0a1e3f;
    const wireColor = isDark ? 0x60a5fa : 0x2563eb;
    const particlesColor = isDark ? 0x93c5fd : 0x004ac6;

    let renderer;
    let scene;
    let camera;

    try {
      // Scene
      scene = new THREE.Scene();
      scene.fog = new THREE.Fog(fogColor, 8, 24);

      camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
      camera.position.set(0, 0.5, 6);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, failIfMajorPerformanceCaveat: false });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(fogColor, 0);
      container.appendChild(renderer.domElement);

      // Lights
      const ambient = new THREE.AmbientLight(0xffffff, isDark ? 0.6 : 0.8);
      scene.add(ambient);
      const dir1 = new THREE.DirectionalLight(0x2563eb, isDark ? 1.3 : 1.5);
      dir1.position.set(5, 5, 5);
      scene.add(dir1);
      const dir2 = new THREE.DirectionalLight(isDark ? 0x22c55e : 0x10b981, isDark ? 0.8 : 0.5);
      dir2.position.set(-5, -3, 2);
      scene.add(dir2);
      const point = new THREE.PointLight(0x7c3aed, 1.2, 22);
      point.position.set(0, 0, 3);
      scene.add(point);

      // Main knot – BioPay brand blue
      const knotGeo = new THREE.TorusKnotGeometry(1.2, 0.35, 180, 32);
      const knotMat = new THREE.MeshPhysicalMaterial({
        color: knotColor,
        metalness: 0.2,
        roughness: 0.25,
        clearcoat: 0.6,
        clearcoatRoughness: 0.2,
        emissive: knotEmissive,
        emissiveIntensity: 0.15,
      });
      const knot = new THREE.Mesh(knotGeo, knotMat);
      knot.position.x = width > 1024 ? -1.4 : 0;
      scene.add(knot);

      // Inner wireframe
      const wireMat = new THREE.MeshBasicMaterial({ color: wireColor, wireframe: true, transparent: true, opacity: isDark ? 0.2 : 0.15 });
      const wire = new THREE.Mesh(new THREE.IcosahedronGeometry(2.1, 1), wireMat);
      wire.position.x = width > 1024 ? -1.4 : 0;
      scene.add(wire);

      // Floating particles
      const particlesCount = 360;
      const posArray = new Float32Array(particlesCount * 3);
      for (let i = 0; i < particlesCount * 3; i += 3) {
        posArray[i] = (Math.random() - 0.5) * 26;
        posArray[i + 1] = (Math.random() - 0.5) * 16;
        posArray[i + 2] = (Math.random() - 0.5) * 12;
      }
      const particlesGeo = new THREE.BufferGeometry();
      particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      const particlesMat = new THREE.PointsMaterial({
        size: 0.03,
        color: particlesColor,
        transparent: true,
        opacity: isDark ? 0.85 : 0.6,
      });
      const particles = new THREE.Points(particlesGeo, particlesMat);
      scene.add(particles);

      // Small orbiting spheres
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

      // Parallax
      let mouseX = 0, mouseY = 0;
      const onMouseMove = (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * -2;
      };
      window.addEventListener('mousemove', onMouseMove);

      const clock = new THREE.Clock();

      const animate = () => {
        if (document.documentElement.classList.contains('reduce-motion')) {
          if (renderer && scene && camera) renderer.render(scene, camera);
          return;
        }
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

        if (renderer && scene && camera) renderer.render(scene, camera);
      };
      animate();

      const handleResize = () => {
        if (!container || !camera || !renderer) return;
        const w = container.clientWidth || window.innerWidth;
        const h = container.clientHeight || window.innerHeight;
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
        if (renderer) {
          renderer.dispose();
          knotGeo.dispose();
          knotMat.dispose();
          particlesGeo.dispose();
          particlesMat.dispose();
          if (renderer.domElement && renderer.domElement.parentNode === container) {
            container.removeChild(renderer.domElement);
          }
        }
      };
    } catch (err) {
      console.warn("WebGL background init error, using fallback background:", err);
    }
  }, [isDark]);

  return (
    <div ref={mountRef} className="absolute inset-0 w-full h-full">
      {/* Ambient gradient overlays spanning the entire background */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(1000px 700px at 30% 50%, rgba(37,99,235,0.16), transparent 65%), radial-gradient(800px 600px at 80% 50%, rgba(124,58,237,0.12), transparent 60%), radial-gradient(600px 400px at 50% 90%, rgba(34,197,94,0.08), transparent 55%)`
      }} />
    </div>
  );
}
