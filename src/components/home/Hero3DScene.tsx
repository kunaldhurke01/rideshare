import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Hero3DScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070b19);
    scene.fog = new THREE.FogExp2(0x070b19, 0.015);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 45, 65);
    camera.lookAt(0, 0, 0);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0x1e293b, 1.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 2);
    dirLight.position.set(30, 50, 40);
    scene.add(dirLight);

    const purpleLight = new THREE.PointLight(0xa855f7, 3, 100);
    purpleLight.position.set(-30, 20, -20);
    scene.add(purpleLight);

    const cyanLight = new THREE.PointLight(0x06b6d4, 3, 100);
    cyanLight.position.set(20, 15, 20);
    scene.add(cyanLight);

    // 5. Ground grid plane
    const gridHelper = new THREE.GridHelper(140, 40, 0x2563eb, 0x1e293b);
    gridHelper.position.y = -0.1;
    scene.add(gridHelper);

    // 6. Procedural 3D City Buildings
    const buildingsGroup = new THREE.Group();
    const buildingGeom = new THREE.BoxGeometry(1, 1, 1);
    const buildingMat = new THREE.MeshStandardMaterial({
      color: 0x0f1d40,
      roughness: 0.2,
      metalness: 0.8
    });
    const windowMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true
    });

    const buildingCount = 55;
    for (let i = 0; i < buildingCount; i++) {
      const w = 3 + Math.random() * 4;
      const d = 3 + Math.random() * 4;
      const h = 4 + Math.random() * 22;

      // Keep center open for routes
      const angle = Math.random() * Math.PI * 2;
      const radius = 18 + Math.random() * 45;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      const building = new THREE.Mesh(buildingGeom, buildingMat);
      building.scale.set(w, h, d);
      building.position.set(x, h / 2, z);
      buildingsGroup.add(building);

      // Wireframe glow crown on top
      const crown = new THREE.Mesh(buildingGeom, windowMat);
      crown.scale.set(w * 1.02, 1, d * 1.02);
      crown.position.set(x, h - 0.5, z);
      buildingsGroup.add(crown);
    }
    scene.add(buildingsGroup);

    // 7. Glowing Route Curves (Primary and Joining Routes merging)
    const curve1Points = [
      new THREE.Vector3(-35, 0.4, 25),
      new THREE.Vector3(-18, 0.4, 15),
      new THREE.Vector3(0, 0.4, 0),
      new THREE.Vector3(20, 0.4, -15),
      new THREE.Vector3(38, 0.4, -28)
    ];
    const curve1 = new THREE.CatmullRomCurve3(curve1Points);

    const curve2Points = [
      new THREE.Vector3(-25, 0.4, -30),
      new THREE.Vector3(-12, 0.4, -15),
      new THREE.Vector3(0, 0.4, 0), // Merge point
      new THREE.Vector3(20, 0.4, -15),
      new THREE.Vector3(38, 0.4, -28)
    ];
    const curve2 = new THREE.CatmullRomCurve3(curve2Points);

    // Render Neon Tube Routes
    const tube1Geom = new THREE.TubeGeometry(curve1, 64, 0.4, 8, false);
    const tube1Mat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const tube1 = new THREE.Mesh(tube1Geom, tube1Mat);
    scene.add(tube1);

    const tube2Geom = new THREE.TubeGeometry(curve2, 64, 0.35, 8, false);
    const tube2Mat = new THREE.MeshBasicMaterial({ color: 0xa855f7 });
    const tube2 = new THREE.Mesh(tube2Geom, tube2Mat);
    scene.add(tube2);

    // Merge point halo
    const mergeHaloGeom = new THREE.RingGeometry(1, 3.5, 32);
    const mergeHaloMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7
    });
    const mergeHalo = new THREE.Mesh(mergeHaloGeom, mergeHaloMat);
    mergeHalo.rotation.x = -Math.PI / 2;
    mergeHalo.position.set(0, 0.5, 0);
    scene.add(mergeHalo);

    // 8. 3D Moving Vehicles
    const createCar = (colorHex: number) => {
      const carGroup = new THREE.Group();
      const bodyGeom = new THREE.BoxGeometry(2.4, 1.1, 1.4);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        roughness: 0.1,
        metalness: 0.9
      });
      const body = new THREE.Mesh(bodyGeom, bodyMat);
      body.position.y = 0.6;
      carGroup.add(body);

      // Cabin
      const cabinGeom = new THREE.BoxGeometry(1.4, 0.7, 1.2);
      const cabinMat = new THREE.MeshStandardMaterial({
        color: 0x030712,
        roughness: 0.1
      });
      const cabin = new THREE.Mesh(cabinGeom, cabinMat);
      cabin.position.set(-0.2, 1.2, 0);
      carGroup.add(cabin);

      // Headlight glow
      const headLight = new THREE.PointLight(0xffffff, 2, 8);
      headLight.position.set(1.4, 0.6, 0);
      carGroup.add(headLight);

      return carGroup;
    };

    const car1 = createCar(0x06b6d4);
    const car2 = createCar(0xa855f7);
    scene.add(car1);
    scene.add(car2);

    // 9. Floating Particle Field
    const particleCount = 180;
    const particleGeom = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 100;
      particlePositions[i + 1] = Math.random() * 30 + 1;
      particlePositions[i + 2] = (Math.random() - 0.5) * 100;
    }
    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.4,
      transparent: true,
      opacity: 0.6
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    // Animation Loop
    let animationFrameId: number;
    let t = 0;

    const animate = () => {
      t += 0.003;

      // Animate Car 1 along Curve 1
      const progress1 = (t * 0.8) % 1;
      const pos1 = curve1.getPointAt(progress1);
      const tangent1 = curve1.getTangentAt(progress1);
      car1.position.copy(pos1);
      car1.lookAt(pos1.clone().add(tangent1));

      // Animate Car 2 along Curve 2
      const progress2 = ((t * 0.8) + 0.35) % 1;
      const pos2 = curve2.getPointAt(progress2);
      const tangent2 = curve2.getTangentAt(progress2);
      car2.position.copy(pos2);
      car2.lookAt(pos2.clone().add(tangent2));

      // Rotate merge halo
      mergeHalo.rotation.z += 0.01;

      // Subtle slow camera pan orbit
      camera.position.x = Math.sin(t * 0.4) * 12;
      camera.position.z = 65 + Math.cos(t * 0.4) * 6;
      camera.lookAt(0, 2, 0);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden"
    />
  );
};
