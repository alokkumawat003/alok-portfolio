import { useEffect, useRef } from "react";
import * as THREE from "three";
import usePerformanceProfile from "@/hooks/usePerformanceProfile";

const SCENE_IDS = ["top", "about", "skills", "experience", "projects", "contact", "footer"];
const CAMERA_STOPS = [
  { position: [0, 2.8, 15], target: [0, 1.2, -5], fov: 37 },
  { position: [-5.2, 3.4, 4], target: [1.2, 1, -14], fov: 45 },
  { position: [4.8, 5.2, -9], target: [-0.8, 0.6, -25], fov: 41 },
  { position: [-4.6, 2.5, -22], target: [1.4, 0.5, -37], fov: 46 },
  { position: [5.2, 4.1, -37], target: [-0.6, 0, -51], fov: 43 },
  { position: [-2.6, 5.8, -53], target: [0.4, 0.8, -67], fov: 42 },
  { position: [0, 8.4, -68], target: [0, -0.4, -78], fov: 48 },
];

const COLORS = {
  background: 0x03070a,
  fog: 0x061015,
  bone: 0xdde8e2,
  cyan: 0x70e7f0,
  signal: 0xb8ff65,
  ember: 0xff6b45,
  dark: 0x0a151a,
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const damp = (current, target, rate, delta) => THREE.MathUtils.lerp(current, target, 1 - Math.exp(-rate * delta));

function seededRandom(seed = 420) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function createFrame(width, height, depth, material, geometry) {
  const group = new THREE.Group();
  const top = new THREE.Mesh(geometry, material);
  const bottom = new THREE.Mesh(geometry, material);
  const left = new THREE.Mesh(geometry, material);
  const right = new THREE.Mesh(geometry, material);
  top.scale.set(width, 0.08, depth);
  bottom.scale.set(width, 0.08, depth);
  left.scale.set(0.08, height, depth);
  right.scale.set(0.08, height, depth);
  top.position.y = height / 2;
  bottom.position.y = -height / 2;
  left.position.x = -width / 2;
  right.position.x = width / 2;
  group.add(top, bottom, left, right);
  return group;
}

function disposeWorld(scene, renderer) {
  const geometries = new Set();
  const materials = new Set();
  scene.traverse((object) => {
    if (object.geometry) geometries.add(object.geometry);
    const list = Array.isArray(object.material) ? object.material : [object.material];
    list.filter(Boolean).forEach((material) => materials.add(material));
  });
  geometries.forEach((geometry) => geometry.dispose());
  materials.forEach((material) => material.dispose());
  renderer.dispose();
}

export default function ImmersiveWorld() {
  const canvasRef = useRef(null);
  const profile = usePerformanceProfile();
  const initialProfile = useRef(profile);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const settings = initialProfile.current;
    const reduceMotion = settings.reducedMotion;
    const coarsePointer = settings.touch;
    const debugPerformance = new URLSearchParams(window.location.search).has("debugPerf");
    const random = seededRandom();
    let renderer;
    let scene;
    let camera;
    let frame = 0;
    let running = true;
    let disposed = false;
    let lastTime = performance.now();
    let lastRenderTime = 0;
    let elapsed = 0;
    let measuredFrames = 0;
    let measuredTime = 0;
    let slowWindows = 0;
    let fastWindows = 0;
    let debugFrames = 0;
    let debugWindowStart = 0;
    let lastDomUpdate = 0;
    let lastInteractionTime = performance.now();
    let qualityScale = 1;
    let runtimeDegraded = false;
    let currentQuality = document.documentElement.dataset.graphics || settings.tier;
    let targetProgress = 0;
    let smoothProgress = 0;
    let pointerX = 0;
    let pointerY = 0;
    let targetPointerX = 0;
    let targetPointerY = 0;
    let anchors = [];
    let maxScroll = 1;
    let activeScene = -1;
    let activeProject = 0;
    let domDirty = true;
    const sections = [];
    const projectPanels = [];
    const animated = {};

    const viewportWidth = () => document.documentElement.clientWidth || window.innerWidth;
    const viewportHeight = () => document.documentElement.clientHeight || window.innerHeight;

    const measure = () => {
      sections.splice(0, sections.length, ...SCENE_IDS.map((id) => document.getElementById(id)).filter(Boolean));
      projectPanels.splice(0, projectPanels.length, ...document.querySelectorAll("[data-project-scene]"));
      maxScroll = Math.max(1, document.documentElement.scrollHeight - viewportHeight());
      anchors = sections.map((section, index) => {
        if (index === 0) return 0;
        if (index === sections.length - 1) return maxScroll;
        return clamp(section.offsetTop + section.offsetHeight * 0.5 - viewportHeight() * 0.5, 0, maxScroll);
      });
      for (let index = 1; index < anchors.length; index += 1) {
        anchors[index] = Math.max(anchors[index], anchors[index - 1] + 1);
      }
    };

    const progressFor = (scrollPosition) => {
      if (!anchors.length || scrollPosition <= anchors[0]) return 0;
      for (let index = 0; index < anchors.length - 1; index += 1) {
        if (scrollPosition <= anchors[index + 1]) {
          return index + (scrollPosition - anchors[index]) / (anchors[index + 1] - anchors[index]);
        }
      }
      return Math.max(0, anchors.length - 1);
    };

    const updateDomState = () => {
      const height = viewportHeight();
      const sectionRects = sections.map((section) => section.getBoundingClientRect());
      const projectRect = sectionRects[SCENE_IDS.indexOf("projects")];
      const projectIsNear = projectRect && projectRect.top < height * 1.5 && projectRect.bottom > -height * 0.5;
      const projectRects = projectIsNear
        ? projectPanels.map((panel) => panel.getBoundingClientRect())
        : [];

      sections.forEach((section, index) => {
        const rect = sectionRects[index];
        const presence = clamp(1 - Math.abs(rect.top + rect.height * 0.5 - height * 0.5) / Math.max(height, rect.height), 0, 1);
        const nextPresence = presence.toFixed(2);
        if (section.style.getPropertyValue("--chapter-presence") !== nextPresence) {
          section.style.setProperty("--chapter-presence", nextPresence);
        }
        const isActive = index === activeScene;
        if (section.hasAttribute("data-scene-active") !== isActive) {
          section.toggleAttribute("data-scene-active", isActive);
        }
      });

      if (projectRects.length) {
        let closest = Infinity;
        projectRects.forEach((rect, index) => {
          const distance = Math.abs(rect.top + rect.height * 0.5 - height * 0.5);
          if (distance < closest) {
            closest = distance;
            activeProject = index;
          }
        });
        projectPanels.forEach((panel, index) => {
          const isActive = index === activeProject;
          if (panel.hasAttribute("data-project-active") !== isActive) {
            panel.toggleAttribute("data-project-active", isActive);
          }
        });
        const nextProject = String(activeProject + 1);
        if (document.documentElement.dataset.project !== nextProject) {
          document.documentElement.dataset.project = nextProject;
        }
      }
    };

    const applyQuality = (quality) => {
      currentQuality = quality === "high" || quality === "medium" ? quality : "low";
      const baseDpr = currentQuality === "high" ? 1.5 : currentQuality === "medium" ? 1.15 : 0.85;
      qualityScale = currentQuality === "low" ? Math.min(qualityScale, 0.86) : qualityScale;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, baseDpr) * qualityScale);
      renderer.setSize(viewportWidth(), viewportHeight(), false);
      if (animated.particles) animated.particles.visible = currentQuality !== "low" && !runtimeDegraded;
      if (animated.satelliteNodes) animated.satelliteNodes.visible = currentQuality === "high" && !runtimeDegraded;
      canvas.dataset.quality = currentQuality;
      canvas.dataset.performance = runtimeDegraded ? "degraded" : "full";
    };

    const resize = () => {
      if (!renderer || !camera) return;
      lastInteractionTime = performance.now();
      applyQuality(document.documentElement.dataset.graphics || currentQuality);
      camera.aspect = viewportWidth() / viewportHeight();
      camera.updateProjectionMatrix();
      measure();
      domDirty = true;
    };

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: currentQuality === "high",
        alpha: false,
        powerPreference: "high-performance",
      });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.04;
      renderer.setClearColor(COLORS.background, 1);

      scene = new THREE.Scene();
      scene.background = new THREE.Color(COLORS.background);
      scene.fog = new THREE.FogExp2(COLORS.fog, 0.022);
      camera = new THREE.PerspectiveCamera(37, viewportWidth() / viewportHeight(), 0.1, 180);

      const ambient = new THREE.AmbientLight(0x8ba9ae, 0.42);
      const keyLight = new THREE.DirectionalLight(COLORS.bone, 2.1);
      keyLight.position.set(8, 14, 8);
      const cyanLight = new THREE.PointLight(COLORS.cyan, 18, 32, 2);
      cyanLight.position.set(-6, 3, -26);
      const signalLight = new THREE.PointLight(COLORS.signal, 13, 26, 2);
      signalLight.position.set(5, 1, -50);
      const emberLight = new THREE.PointLight(COLORS.ember, 9, 22, 2);
      emberLight.position.set(0, 5, -66);
      scene.add(ambient, keyLight, cyanLight, signalLight, emberLight);

      const grid = new THREE.GridHelper(150, 75, COLORS.cyan, 0x163139);
      grid.position.set(0, -4.2, -35);
      grid.material.transparent = true;
      grid.material.opacity = 0.22;
      scene.add(grid);

      const coreMaterial = new THREE.MeshStandardMaterial({
        color: COLORS.dark,
        emissive: COLORS.cyan,
        emissiveIntensity: 0.28,
        metalness: 0.62,
        roughness: 0.34,
        wireframe: true,
      });
      const lineMaterial = new THREE.LineBasicMaterial({ color: COLORS.cyan, transparent: true, opacity: 0.3 });
      const wireMaterial = new THREE.MeshBasicMaterial({ color: COLORS.cyan, transparent: true, opacity: 0.24, wireframe: true });
      const signalMaterial = new THREE.MeshBasicMaterial({ color: COLORS.signal, transparent: true, opacity: 0.72, wireframe: true });
      const emberMaterial = new THREE.MeshBasicMaterial({ color: COLORS.ember, transparent: true, opacity: 0.62, wireframe: true });
      const frameMaterial = new THREE.MeshBasicMaterial({ color: COLORS.bone, transparent: true, opacity: 0.22 });
      const frameGeometry = new THREE.BoxGeometry(1, 1, 1);

      const heroCore = new THREE.Group();
      heroCore.position.set(4.5, 0.7, -7);
      const core = new THREE.Mesh(new THREE.IcosahedronGeometry(2.25, 2), coreMaterial);
      const coreInner = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.22, 1),
        new THREE.MeshBasicMaterial({ color: COLORS.cyan, transparent: true, opacity: 0.13 }),
      );
      const orbitA = new THREE.Mesh(new THREE.TorusGeometry(3.1, 0.025, 5, 80), signalMaterial);
      const orbitB = new THREE.Mesh(new THREE.TorusGeometry(3.7, 0.022, 5, 80), wireMaterial);
      orbitA.rotation.set(Math.PI * 0.5, 0.35, 0.2);
      orbitB.rotation.set(0.9, 0.2, Math.PI * 0.5);
      heroCore.add(core, coreInner, orbitA, orbitB);
      scene.add(heroCore);
      animated.heroCore = heroCore;
      animated.heroOrbits = [orbitA, orbitB];

      const corridorMaterial = new THREE.MeshStandardMaterial({
        color: 0x0b1c22,
        emissive: 0x0b3440,
        emissiveIntensity: 0.35,
        metalness: 0.7,
        roughness: 0.5,
      });
      const nodeGeometry = new THREE.BoxGeometry(0.22, 0.22, 0.22);
      const nodeCount = currentQuality === "high" ? 120 : currentQuality === "medium" ? 76 : 42;
      const nodeMesh = new THREE.InstancedMesh(nodeGeometry, corridorMaterial, nodeCount);
      const nodeObject = new THREE.Object3D();
      const nodePositions = [];
      for (let index = 0; index < nodeCount; index += 1) {
        const z = 4 - random() * 82;
        const spread = 3.4 + random() * 8.5;
        const angle = random() * Math.PI * 2;
        const x = Math.cos(angle) * spread;
        const y = -2.7 + random() * 10.5;
        const scale = 0.45 + random() * 2.4;
        nodeObject.position.set(x, y, z);
        nodeObject.rotation.set(random() * 1.5, random() * 1.5, random() * 1.5);
        nodeObject.scale.setScalar(scale);
        nodeObject.updateMatrix();
        nodeMesh.setMatrixAt(index, nodeObject.matrix);
        nodePositions.push(new THREE.Vector3(x, y, z));
      }
      nodeMesh.instanceMatrix.needsUpdate = true;
      scene.add(nodeMesh);
      animated.satelliteNodes = nodeMesh;

      const networkVertices = [];
      nodePositions.forEach((position, index) => {
        if (index % 2 !== 0) return;
        networkVertices.push(position.x, position.y, position.z, 0, -1.5 + (index % 7) * 0.45, position.z - 1.6);
      });
      const networkGeometry = new THREE.BufferGeometry();
      networkGeometry.setAttribute("position", new THREE.Float32BufferAttribute(networkVertices, 3));
      const network = new THREE.LineSegments(networkGeometry, lineMaterial);
      scene.add(network);

      const spinePoints = CAMERA_STOPS.map((stop) => new THREE.Vector3(...stop.target));
      const spineCurve = new THREE.CatmullRomCurve3(spinePoints, false, "catmullrom", 0.45);
      const spine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(spineCurve.getPoints(120)),
        new THREE.LineBasicMaterial({ color: COLORS.signal, transparent: true, opacity: 0.2 }),
      );
      scene.add(spine);

      const identityGate = new THREE.Group();
      identityGate.position.set(-1.8, 0.2, -15);
      for (let index = 0; index < 4; index += 1) {
        const frame = createFrame(5.6 - index * 0.58, 6.5 - index * 0.48, 0.06, index === 0 ? signalMaterial : frameMaterial, frameGeometry);
        frame.position.z = -index * 1.1;
        identityGate.add(frame);
      }
      scene.add(identityGate);
      animated.identityGate = identityGate;

      const skillArray = new THREE.Group();
      skillArray.position.set(0.6, 0, -27);
      for (let index = 0; index < 6; index += 1) {
        const angle = (index / 6) * Math.PI * 2;
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(1.05 + (index % 2) * 0.32, 0.025, 4, 48),
          index === 2 ? signalMaterial : wireMaterial,
        );
        ring.position.set(Math.cos(angle) * 4.4, Math.sin(angle) * 2.6, (index % 3) * -1.1);
        ring.rotation.set(angle * 0.3, angle, angle * 0.18);
        skillArray.add(ring);
      }
      const skillCore = new THREE.Mesh(new THREE.OctahedronGeometry(1.25, 1), coreMaterial);
      skillArray.add(skillCore);
      scene.add(skillArray);
      animated.skillArray = skillArray;

      const journey = new THREE.Group();
      journey.position.set(-0.4, -2.6, -39);
      const pylonGeometry = new THREE.BoxGeometry(0.34, 1, 0.34);
      for (let index = 0; index < 7; index += 1) {
        const height = 1.5 + index * 0.7;
        const pylon = new THREE.Mesh(pylonGeometry, index < 3 ? signalMaterial : frameMaterial);
        pylon.scale.y = height;
        pylon.position.set((index - 3) * 1.45, height * 0.5, -Math.abs(index - 3) * 0.58);
        journey.add(pylon);
      }
      const journeyLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(-5, 0.1, 0),
          new THREE.Vector3(0, 4.8, -1.7),
          new THREE.Vector3(5, 1.3, 0),
        ]),
        new THREE.LineBasicMaterial({ color: COLORS.signal, transparent: true, opacity: 0.62 }),
      );
      journey.add(journeyLine);
      scene.add(journey);
      animated.journey = journey;

      const projectWorld = new THREE.Group();
      projectWorld.position.set(0, 0.2, -52);
      const portals = [];
      for (let index = 0; index < 4; index += 1) {
        const portalMaterial = new THREE.MeshBasicMaterial({
          color: index === 0 ? COLORS.signal : COLORS.cyan,
          transparent: true,
          opacity: 0.22,
        });
        const portal = createFrame(3.2, 4.5, 0.08, portalMaterial, frameGeometry);
        portal.position.set((index - 1.5) * 4.2, (index % 2) * 0.9, -Math.abs(index - 1.5) * 1.1);
        const halo = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.035, 4, 56), portalMaterial);
        halo.rotation.x = Math.PI / 2;
        halo.position.z = -0.3;
        portal.add(halo);
        portal.userData.material = portalMaterial;
        portal.userData.halo = halo;
        portals.push(portal);
        projectWorld.add(portal);
      }
      scene.add(projectWorld);
      animated.projectWorld = projectWorld;
      animated.portals = portals;

      const contactBeacon = new THREE.Group();
      contactBeacon.position.set(0, 0, -68);
      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.26, 8, 8), corridorMaterial);
      mast.position.y = 0.5;
      const beaconCore = new THREE.Mesh(new THREE.IcosahedronGeometry(1.1, 1), emberMaterial);
      beaconCore.position.y = 4.5;
      const beaconRingA = new THREE.Mesh(new THREE.TorusGeometry(3.1, 0.035, 5, 64), emberMaterial);
      const beaconRingB = new THREE.Mesh(new THREE.TorusGeometry(4.4, 0.025, 5, 64), wireMaterial);
      beaconRingA.position.y = 4.5;
      beaconRingB.position.y = 4.5;
      beaconRingA.rotation.x = Math.PI / 2;
      beaconRingB.rotation.set(Math.PI / 2, 0.4, 0.3);
      contactBeacon.add(mast, beaconCore, beaconRingA, beaconRingB);
      scene.add(contactBeacon);
      animated.contactBeacon = contactBeacon;
      animated.beaconRings = [beaconRingA, beaconRingB];

      const particleCount = currentQuality === "high" ? 520 : currentQuality === "medium" ? 280 : 100;
      const particlePositions = new Float32Array(particleCount * 3);
      for (let index = 0; index < particleCount; index += 1) {
        particlePositions[index * 3] = (random() - 0.5) * 32;
        particlePositions[index * 3 + 1] = (random() - 0.35) * 18;
        particlePositions[index * 3 + 2] = 8 - random() * 94;
      }
      const particleGeometry = new THREE.BufferGeometry();
      particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
      const particles = new THREE.Points(
        particleGeometry,
        new THREE.PointsMaterial({
          color: COLORS.cyan,
          size: 0.055,
          transparent: true,
          opacity: 0.58,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      );
      scene.add(particles);
      animated.particles = particles;

      const positionCurve = new THREE.CatmullRomCurve3(
        CAMERA_STOPS.map((stop) => new THREE.Vector3(...stop.position)),
        false,
        "catmullrom",
        0.42,
      );
      const targetCurve = new THREE.CatmullRomCurve3(
        CAMERA_STOPS.map((stop) => new THREE.Vector3(...stop.target)),
        false,
        "catmullrom",
        0.42,
      );
      const cameraPosition = new THREE.Vector3();
      const cameraTarget = new THREE.Vector3();
      const cameraDirection = new THREE.Vector3();

      const renderFrame = (now) => {
        if (!running || disposed) return;
        const idle = now - lastInteractionTime > 1500;
        const frameInterval = coarsePointer || currentQuality === "low" || (idle && currentQuality === "medium")
          ? 1000 / 30
          : 0;
        if (frameInterval && now - lastRenderTime < frameInterval) {
          frame = window.requestAnimationFrame(renderFrame);
          return;
        }
        lastRenderTime = now;
        const rawDelta = Math.max(0.001, (now - lastTime) / 1000);
        const delta = Math.min(rawDelta, 0.05);
        lastTime = now;
        elapsed += delta;

        targetProgress = progressFor(window.scrollY);
        smoothProgress = reduceMotion ? targetProgress : damp(smoothProgress, targetProgress, 4.8, delta);
        targetPointerX = coarsePointer ? 0 : targetPointerX;
        targetPointerY = coarsePointer ? 0 : targetPointerY;
        pointerX = damp(pointerX, targetPointerX, 2.6, delta);
        pointerY = damp(pointerY, targetPointerY, 2.6, delta);

        const maximum = Math.max(1, CAMERA_STOPS.length - 1);
        const curveProgress = clamp(smoothProgress / maximum, 0, 1);
        positionCurve.getPoint(curveProgress, cameraPosition);
        targetCurve.getPoint(curveProgress, cameraTarget);
        const stopIndex = clamp(Math.floor(smoothProgress), 0, maximum - 1);
        const stopMix = clamp(smoothProgress - stopIndex, 0, 1);
        let fov = THREE.MathUtils.lerp(CAMERA_STOPS[stopIndex].fov, CAMERA_STOPS[stopIndex + 1].fov, stopMix);

        const aspectCorrection = clamp((1.45 - viewportWidth() / viewportHeight()) / 0.95, 0, 1);
        if (aspectCorrection > 0) {
          cameraDirection.subVectors(cameraPosition, cameraTarget).normalize();
          cameraPosition.addScaledVector(cameraDirection, aspectCorrection * 7.2);
          cameraPosition.y += aspectCorrection * 1.2;
          fov *= 1 + aspectCorrection * 0.32;
        }

        const parallax = 1 - clamp(smoothProgress / 2, 0, 1) * 0.5;
        cameraPosition.x += pointerX * 0.64 * parallax;
        cameraPosition.y += pointerY * 0.32 * parallax;
        cameraTarget.x -= pointerX * 0.18 * parallax;
        cameraTarget.y -= pointerY * 0.1 * parallax;
        camera.position.copy(cameraPosition);
        camera.lookAt(cameraTarget);
        if (Math.abs(camera.fov - fov) > 0.001) {
          camera.fov = fov;
          camera.updateProjectionMatrix();
        }

        if (smoothProgress < 1.5) {
          animated.heroCore.rotation.y = elapsed * 0.08;
          animated.heroCore.rotation.x = Math.sin(elapsed * 0.22) * 0.08;
          animated.heroOrbits[0].rotation.z += delta * 0.08;
          animated.heroOrbits[1].rotation.y -= delta * 0.06;
        }
        if (smoothProgress > 0.35 && smoothProgress < 2) {
          animated.identityGate.rotation.y = Math.sin(elapsed * 0.2) * 0.04;
        }
        if (smoothProgress > 1.2 && smoothProgress < 3) {
          animated.skillArray.rotation.y += delta * 0.055;
          animated.skillArray.children.forEach((child, index) => {
            if (child === skillCore) return;
            child.rotation.z += delta * (0.025 + index * 0.006);
          });
        }
        if (smoothProgress > 2.15 && smoothProgress < 4) {
          animated.journey.position.y = -2.6 + Math.sin(elapsed * 0.35) * 0.1;
        }
        if (smoothProgress > 3.15 && smoothProgress < 5.25) {
          animated.projectWorld.rotation.y = Math.sin(elapsed * 0.16) * 0.055;
          animated.portals.forEach((portal, index) => {
            const active = index === activeProject;
            portal.userData.material.opacity = damp(portal.userData.material.opacity, active ? 0.86 : 0.14, 5, delta);
            const scale = active ? 1 + Math.sin(elapsed * 2.1) * 0.025 : 0.9;
            portal.scale.setScalar(damp(portal.scale.x, scale, 5, delta));
            portal.userData.halo.rotation.z += delta * (active ? 0.32 : 0.05);
          });
        }
        if (smoothProgress > 4.55) {
          animated.contactBeacon.rotation.y += delta * 0.035;
          animated.beaconRings[0].rotation.z += delta * 0.12;
          animated.beaconRings[1].rotation.y -= delta * 0.08;
        }
        if (animated.particles.visible) animated.particles.position.y = Math.sin(elapsed * 0.12) * 0.35;

        const nextScene = clamp(Math.round(targetProgress), 0, sections.length - 1);
        if (nextScene !== activeScene) {
          activeScene = nextScene;
          document.documentElement.dataset.scene = SCENE_IDS[activeScene] || "top";
        }
        if (domDirty && now - lastDomUpdate >= 50) {
          updateDomState();
          domDirty = false;
          lastDomUpdate = now;
        }

        renderer.render(scene, camera);
        canvas.dataset.ready = "true";

        if (debugPerformance) {
          if (!debugWindowStart) debugWindowStart = now;
          debugFrames += 1;
          const debugWindow = now - debugWindowStart;
          if (debugWindow >= 1000) {
            canvas.dataset.fps = ((debugFrames * 1000) / debugWindow).toFixed(1);
            canvas.dataset.drawCalls = String(renderer.info.render.calls);
            canvas.dataset.triangles = String(renderer.info.render.triangles);
            canvas.dataset.geometries = String(renderer.info.memory.geometries);
            canvas.dataset.textures = String(renderer.info.memory.textures);
            canvas.dataset.pixelRatio = renderer.getPixelRatio().toFixed(2);
            debugFrames = 0;
            debugWindowStart = now;
          }
        }

        if (idle) {
          measuredFrames = 0;
          measuredTime = 0;
        } else if (currentQuality !== "low" && elapsed > 2) {
          measuredFrames += 1;
          measuredTime += rawDelta;
          if (measuredFrames >= 60) {
            const average = measuredTime / measuredFrames;
            measuredFrames = 0;
            measuredTime = 0;
            if (average > 0.026) {
              slowWindows += 1;
              fastWindows = 0;
              if (qualityScale > 0.62) {
                qualityScale = Math.max(0.62, qualityScale * 0.84);
              } else if (slowWindows >= 2 && !runtimeDegraded) {
                runtimeDegraded = true;
              }
              applyQuality(currentQuality);
            } else if (average < 0.0185) {
              slowWindows = 0;
              fastWindows += 1;
              if (qualityScale < 1) {
                qualityScale = Math.min(1, qualityScale + 0.04);
                applyQuality(currentQuality);
              } else if (runtimeDegraded && fastWindows >= 5) {
                runtimeDegraded = false;
                applyQuality(currentQuality);
              }
            }
          }
        }

        frame = window.requestAnimationFrame(renderFrame);
      };

      const onPointerMove = (event) => {
        if (coarsePointer || reduceMotion) return;
        lastInteractionTime = performance.now();
        targetPointerX = (event.clientX / viewportWidth()) * 2 - 1;
        targetPointerY = -((event.clientY / viewportHeight()) * 2 - 1);
      };
      const onScroll = () => {
        lastInteractionTime = performance.now();
        targetProgress = progressFor(window.scrollY);
        domDirty = true;
      };
      const onVisibility = () => {
        if (document.hidden) {
          running = false;
          window.cancelAnimationFrame(frame);
        } else if (!running) {
          running = true;
          lastTime = performance.now();
          frame = window.requestAnimationFrame(renderFrame);
        }
      };
      const onQuality = (event) => {
        lastInteractionTime = performance.now();
        applyQuality(event.detail || document.documentElement.dataset.graphics || settings.tier);
      };
      const story = document.querySelector("main");
      const observer = typeof ResizeObserver === "function" && story
        ? new ResizeObserver(() => {
            measure();
            domDirty = true;
          })
        : null;

      applyQuality(currentQuality);
      measure();
      onScroll();
      observer?.observe(story);
      document.fonts?.ready.then(() => {
        if (!disposed) resize();
      });
      window.addEventListener("resize", resize, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      if (!coarsePointer && !reduceMotion) {
        window.addEventListener("pointermove", onPointerMove, { passive: true });
      }
      window.addEventListener("ak-quality-change", onQuality);
      document.addEventListener("visibilitychange", onVisibility);
      frame = window.requestAnimationFrame(renderFrame);

      return () => {
        disposed = true;
        running = false;
        observer?.disconnect();
        window.cancelAnimationFrame(frame);
        window.removeEventListener("resize", resize);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("ak-quality-change", onQuality);
        document.removeEventListener("visibilitychange", onVisibility);
        sections.forEach((section) => {
          section.style.removeProperty("--chapter-progress");
          section.style.removeProperty("--chapter-presence");
          section.removeAttribute("data-scene-active");
        });
        document.documentElement.removeAttribute("data-scene");
        document.documentElement.removeAttribute("data-project");
        disposeWorld(scene, renderer);
      };
    } catch {
      document.documentElement.classList.add("no-webgl");
      canvas.dataset.ready = "fallback";
      return undefined;
    }
  }, []);

  return (
    <div className="immersive-world" aria-hidden="true">
      <canvas ref={canvasRef} className="world-canvas" data-testid="world-canvas" />
      <span className="world-vignette" />
      <span className="world-grain" />
    </div>
  );
}
