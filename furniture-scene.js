import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

export function initFurnitureScene() {
  const canvas = document.querySelector(".furniture-canvas");
  if (!canvas) return;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#f1ecdf");

  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(8.5, 8, 12.5);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: "high-performance",
    });
  } catch (error) {
    console.error("Unable to initialize the 3D furniture showcase.", error);
    canvas.hidden = true;
    canvas.parentElement.querySelector(".model-controls").hidden = true;
    const fallback = canvas.parentElement.querySelector(".furniture-fallback");
    if (fallback) fallback.hidden = false;
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 0.55, 0);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.enablePan = false;
  controls.minDistance = 8;
  controls.maxDistance = 17;
  controls.minPolarAngle = 0.55;
  controls.maxPolarAngle = 1.35;
  controls.autoRotate = false;

  scene.add(new THREE.HemisphereLight("#fffaf0", "#777064", 2.1));

  const keyLight = new THREE.DirectionalLight("#fff2d8", 3.4);
  keyLight.position.set(-5, 10, 7);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.camera.left = -9;
  keyLight.shadow.camera.right = 9;
  keyLight.shadow.camera.top = 9;
  keyLight.shadow.camera.bottom = -9;
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight("#d8e5ee", 1.1);
  fillLight.position.set(7, 5, -5);
  scene.add(fillLight);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(24, 20),
    new THREE.MeshStandardMaterial({ color: "#ddd4c3", roughness: 0.92 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.04;
  floor.receiveShadow = true;
  scene.add(floor);

  const wall = new THREE.Mesh(
    new THREE.PlaneGeometry(24, 9),
    new THREE.MeshStandardMaterial({ color: "#e9e1d2", roughness: 1 })
  );
  wall.position.set(0, 4.45, -6.6);
  wall.receiveShadow = true;
  scene.add(wall);

  const fabrics = {
    sage: new THREE.MeshStandardMaterial({ color: "#748778", roughness: 0.9 }),
    oat: new THREE.MeshStandardMaterial({ color: "#d7cbb7", roughness: 0.92 }),
    cream: new THREE.MeshStandardMaterial({ color: "#eee5d6", roughness: 0.9 }),
    taupe: new THREE.MeshStandardMaterial({ color: "#9b8770", roughness: 0.92 }),
    walnut: new THREE.MeshStandardMaterial({ color: "#644733", roughness: 0.75 }),
    darkWood: new THREE.MeshStandardMaterial({ color: "#39291f", roughness: 0.68 }),
    slate: new THREE.MeshStandardMaterial({ color: "#62666b", roughness: 0.9 }),
    plum: new THREE.MeshStandardMaterial({ color: "#655965", roughness: 0.88 }),
    recliner: new THREE.MeshStandardMaterial({ color: "#bd6b31", roughness: 0.76 }),
    reclinerShade: new THREE.MeshStandardMaterial({ color: "#91491f", roughness: 0.78 }),
    cupHolder: new THREE.MeshStandardMaterial({ color: "#24282b", metalness: 0.25, roughness: 0.36 }),
    metal: new THREE.MeshStandardMaterial({ color: "#b78b49", metalness: 0.68, roughness: 0.3 }),
  };

  function roundedPart(parent, size, position, material, radius = 0.09) {
    const smallestSide = Math.min(...size);
    const geometry = new RoundedBoxGeometry(
      ...size,
      3,
      Math.min(radius, smallestSide * 0.35)
    );
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  function addLegs(parent, width, depth, material, height = 0.27) {
    for (const x of [-width / 2 + 0.16, width / 2 - 0.16]) {
      for (const z of [-depth / 2 + 0.14, depth / 2 - 0.14]) {
        roundedPart(parent, [0.1, height, 0.1], [x, height / 2, z], material, 0.035);
      }
    }
  }

  function buildSofa(parent, color, width, depth, chaise = false) {
    const frameWidth = width - 0.24;
    const seatDepth = depth * 0.58;
    const seatCount = width > 2.6 ? 3 : 2;
    const seatWidth = (frameWidth - 0.16) / seatCount;

    roundedPart(parent, [frameWidth, 0.38, depth], [0, 0.43, 0], fabrics.darkWood, 0.14);
    roundedPart(parent, [frameWidth - 0.12, 0.16, depth * 0.76], [0, 0.66, -depth * 0.02], color, 0.11);
    addLegs(parent, frameWidth, depth, fabrics.metal, 0.22);

    for (let index = 0; index < seatCount; index += 1) {
      const x = -frameWidth / 2 + 0.08 + seatWidth * (index + 0.5);
      roundedPart(
        parent,
        [seatWidth - 0.035, 0.25, seatDepth],
        [x, 0.78, depth * 0.13],
        color,
        0.12
      );
    }

    for (let index = 0; index < seatCount; index += 1) {
      const cushionWidth = (frameWidth - 0.12) / seatCount;
      const x = -frameWidth / 2 + 0.06 + cushionWidth * (index + 0.5);
      const back = roundedPart(
        parent,
        [cushionWidth - 0.035, 0.78, 0.3],
        [x, 1.23, -depth * 0.34],
        color,
        0.13
      );
      back.rotation.x = -0.11;
      roundedPart(
        parent,
        [cushionWidth - 0.12, 0.16, 0.13],
        [x, 0.97, -depth * 0.14],
        fabrics.slate,
        0.06
      );
    }

    for (const side of [-1, 1]) {
      roundedPart(
        parent,
        [0.34, 0.72, depth * 0.8],
        [side * (width / 2 - 0.17), 0.91, -depth * 0.015],
        color,
        0.14
      );
      roundedPart(
        parent,
        [0.34, 0.14, depth * 0.62],
        [side * (width / 2 - 0.17), 1.32, -depth * 0.015],
        color,
        0.07
      );
    }

    if (chaise) {
      const chaiseWidth = width * 0.36;
      const chaiseX = width * 0.24;
      roundedPart(
        parent,
        [chaiseWidth, 0.28, depth * 0.88],
        [chaiseX, 0.49, depth * 0.57],
        fabrics.darkWood,
        0.13
      );
      roundedPart(
        parent,
        [chaiseWidth - 0.07, 0.24, depth * 0.83],
        [chaiseX, 0.77, depth * 0.59],
        color,
        0.12
      );
      const chaiseBack = roundedPart(
        parent,
        [chaiseWidth - 0.05, 0.76, 0.29],
        [chaiseX, 1.23, depth * 0.23],
        color,
        0.13
      );
      chaiseBack.rotation.x = -0.11;
    }
  }

  function buildRecliner(parent) {
    roundedPart(parent, [1.5, 0.34, 1.3], [0, 0.43, -0.03], fabrics.darkWood, 0.12);
    roundedPart(parent, [0.82, 0.2, 0.74], [0, 0.29, 0.02], fabrics.darkWood, 0.08);
    roundedPart(parent, [1.24, 0.32, 0.93], [0, 0.78, 0.02], fabrics.recliner, 0.16);

    const backShell = roundedPart(
      parent,
      [1.16, 1.22, 0.38],
      [0, 1.48, -0.43],
      fabrics.recliner,
      0.17
    );
    backShell.rotation.x = -0.14;
    const headrest = roundedPart(
      parent,
      [0.94, 0.38, 0.33],
      [0, 2.08, -0.39],
      fabrics.recliner,
      0.15
    );
    headrest.rotation.x = -0.12;

    for (const side of [-1, 1]) {
      roundedPart(
        parent,
        [0.34, 0.73, 1.04],
        [side * 0.69, 0.92, 0.02],
        fabrics.recliner,
        0.15
      );
      roundedPart(
        parent,
        [0.4, 0.18, 0.88],
        [side * 0.69, 1.34, 0.03],
        fabrics.recliner,
        0.09
      );

      const cupRim = new THREE.Mesh(
        new THREE.TorusGeometry(0.105, 0.018, 8, 24),
        fabrics.metal
      );
      cupRim.rotation.x = Math.PI / 2;
      cupRim.position.set(side * 0.69, 1.438, 0.19);
      cupRim.castShadow = true;
      parent.add(cupRim);

      const cup = new THREE.Mesh(
        new THREE.CylinderGeometry(0.091, 0.075, 0.025, 24),
        fabrics.cupHolder
      );
      cup.position.set(side * 0.69, 1.43, 0.19);
      cup.castShadow = true;
      parent.add(cup);
    }

    const seatFront = roundedPart(
      parent,
      [1.16, 0.18, 0.2],
      [0, 0.68, 0.51],
      fabrics.reclinerShade,
      0.07
    );
    seatFront.rotation.x = -0.08;
    const footrestBase = roundedPart(
      parent,
      [1.13, 0.26, 0.74],
      [0, 0.5, 0.99],
      fabrics.reclinerShade,
      0.11
    );
    footrestBase.rotation.x = -0.13;
    const footrest = roundedPart(
      parent,
      [1.08, 0.25, 0.66],
      [0, 0.66, 1.03],
      fabrics.recliner,
      0.13
    );
    footrest.rotation.x = -0.13;

    for (const x of [-0.27, 0, 0.27]) {
      for (const y of [1.3, 1.55, 1.8]) {
        const button = new THREE.Mesh(
          new THREE.SphereGeometry(0.027, 10, 8),
          fabrics.reclinerShade
        );
        button.position.set(x, y, -0.225);
        button.castShadow = true;
        parent.add(button);
      }
    }

    const control = new THREE.Mesh(
      new THREE.CylinderGeometry(0.055, 0.055, 0.045, 16),
      fabrics.metal
    );
    control.rotation.z = Math.PI / 2;
    control.position.set(0.87, 1.02, -0.06);
    control.castShadow = true;
    parent.add(control);
  }

  function buildBed(parent) {
    roundedPart(parent, [2.45, 0.4, 2.45], [0, 0.42, 0.04], fabrics.walnut, 0.13);
    addLegs(parent, 2.35, 2.3, fabrics.darkWood, 0.24);
    roundedPart(parent, [2.32, 0.4, 2.25], [0, 0.78, 0.02], fabrics.cream, 0.15);
    roundedPart(parent, [2.3, 0.22, 1.15], [0, 1.04, 0.54], fabrics.taupe, 0.12);
    roundedPart(parent, [2.45, 1.42, 0.2], [0, 1.12, -1.18], fabrics.oat, 0.14);
    roundedPart(parent, [0.88, 0.2, 0.52], [-0.55, 1.21, -0.48], fabrics.cream, 0.14);
    roundedPart(parent, [0.88, 0.2, 0.52], [0.55, 1.21, -0.48], fabrics.cream, 0.14);
  }

  const furnitureGroups = {
    sofa: new THREE.Group(),
    recliner: new THREE.Group(),
    bed: new THREE.Group(),
  };

  const classicSofa = new THREE.Group();
  buildSofa(classicSofa, fabrics.plum, 2.3, 1.05);
  classicSofa.position.set(-2.05, 0, -1.45);
  classicSofa.rotation.y = 0.16;
  furnitureGroups.sofa.add(classicSofa);

  const sectionalSofa = new THREE.Group();
  buildSofa(sectionalSofa, fabrics.slate, 3.0, 1.05, true);
  sectionalSofa.position.set(1.72, 0, -1.8);
  sectionalSofa.rotation.y = -0.12;
  furnitureGroups.sofa.add(sectionalSofa);

  const recliner = new THREE.Group();
  buildRecliner(recliner);
  recliner.position.set(-2.45, 0, 1.75);
  recliner.rotation.y = 0.22;
  furnitureGroups.recliner.add(recliner);

  const bed = new THREE.Group();
  buildBed(bed);
  bed.position.set(2.15, 0, 1.45);
  bed.rotation.y = -0.12;
  furnitureGroups.bed.add(bed);

  for (const group of Object.values(furnitureGroups)) scene.add(group);

  const focusTargets = {
    all: new THREE.Vector3(0, 0.6, 0),
    sofa: new THREE.Vector3(-0.2, 0.75, -1.35),
    recliner: new THREE.Vector3(-2.4, 0.75, 1.6),
    bed: new THREE.Vector3(2.15, 0.8, 1.4),
  };
  const cameraTargets = {
    all: new THREE.Vector3(8.5, 8, 12.5),
    sofa: new THREE.Vector3(4.2, 4.4, 6.1),
    recliner: new THREE.Vector3(1.4, 4.5, 6.5),
    bed: new THREE.Vector3(6.2, 4.8, 6.7),
  };
  let targetFocus = focusTargets.all.clone();
  let targetCamera = cameraTargets.all.clone();

  document.querySelectorAll(".model-control").forEach((button) => {
    button.addEventListener("click", () => {
      const selected = button.dataset.model;
      targetFocus = focusTargets[selected].clone();
      targetCamera = cameraTargets[selected].clone();

      for (const [name, group] of Object.entries(furnitureGroups)) {
        group.visible = selected === "all" || name === selected;
      }

      document.querySelectorAll(".model-control").forEach((control) => {
        const isActive = control === button;
        control.classList.toggle("is-active", isActive);
        control.setAttribute("aria-pressed", String(isActive));
      });
      requestRender();
    });
  });

  let frameRequest = 0;
  let settleFrames = 0;

  function requestRender() {
    if (!frameRequest) frameRequest = requestAnimationFrame(render);
  }

  controls.addEventListener("change", () => {
    settleFrames = 30;
    requestRender();
  });

  function resizeScene() {
    const { width, height } = canvas.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    requestRender();
  }

  const resizeObserver = new ResizeObserver(resizeScene);
  resizeObserver.observe(canvas.parentElement);
  resizeScene();

  function render() {
    frameRequest = 0;
    const focusMoving = controls.target.distanceTo(targetFocus) > 0.003;
    const cameraMoving = camera.position.distanceTo(targetCamera) > 0.003;
    controls.target.lerp(targetFocus, 0.035);
    camera.position.lerp(targetCamera, 0.035);
    controls.update();
    renderer.render(scene, camera);

    if (focusMoving || cameraMoving || settleFrames > 0) {
      if (settleFrames > 0) settleFrames -= 1;
      requestRender();
    }
  }

  requestRender();
}
