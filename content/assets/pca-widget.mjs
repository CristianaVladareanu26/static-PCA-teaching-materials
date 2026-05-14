import * as THREE from 'https://esm.sh/three@0.128.0';
import { OrbitControls } from 'https://esm.sh/three@0.128.0/examples/jsm/controls/OrbitControls.js';
import gsap from 'https://esm.sh/gsap@3.9.1';

function render({ model, el }) {
  // 1. Construct the UI
  const container = document.createElement('div');
  container.className = 'pca-container';
  
  const controls = document.createElement('div');
  controls.className = 'pca-controls';
  
  const inputRow = document.createElement('div');
  const lbl = document.createElement('label');
  lbl.innerText = 'Datapoints: ';
  const inputPoints = document.createElement('input');
  inputPoints.type = 'number';
  inputPoints.value = '150';
  inputPoints.min = '10';
  inputPoints.max = '1000';
  inputRow.append(lbl, inputPoints);

  const btnGen = document.createElement('button');
  btnGen.innerText = 'Generate Random Dataset';
  
  const btnCenter = document.createElement('button');
  btnCenter.innerText = '1. Center Data';
  
  const btnEigen = document.createElement('button');
  btnEigen.innerText = '2. Find Eigenvectors';
  btnEigen.disabled = true;
  
  const btnPCs = document.createElement('button');
  btnPCs.innerText = '3. Find PCs';
  btnPCs.disabled = true;
  
  const btnProj = document.createElement('button');
  btnProj.innerText = '4. Project Data';
  btnProj.disabled = true;

  controls.append(inputRow, btnGen, btnCenter, btnEigen, btnPCs, btnProj);
  container.appendChild(controls);
  
  // Dual Viewport Setup
  const viewsContainer = document.createElement('div');
  viewsContainer.className = 'views-container';
  
  const view1 = document.createElement('div');
  view1.className = 'scene-container';
  const view2 = document.createElement('div');
  view2.className = 'scene-container';
  
  viewsContainer.append(view1, view2);
  container.appendChild(viewsContainer);
  el.appendChild(container);

  // 2. Setup Three.js Scenes
  const scene1 = new THREE.Scene(); // Original Data
  const scene2 = new THREE.Scene(); // Processed Data

  // Fallback dimensions before full DOM mount
  const w = container.clientWidth / 2 || 400; 
  const h = container.clientHeight || 600;

  const camera1 = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000);
  camera1.position.set(8, 6, 8);
  camera1.lookAt(0, 0, 0);

  const camera2 = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000);
  camera2.position.set(8, 6, 8);
  camera2.lookAt(0, 0, 0);

  const renderer1 = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer1.setSize(w, h);
  view1.appendChild(renderer1.domElement);

  const renderer2 = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer2.setSize(w, h);
  view2.appendChild(renderer2.domElement);

  scene1.add(new THREE.AxesHelper(3));
  scene2.add(new THREE.AxesHelper(3));

  // Syncing Orbit Controls
  const orbit1 = new OrbitControls(camera1, renderer1.domElement);
  const orbit2 = new OrbitControls(camera2, renderer2.domElement);
  
  let isSyncing = false;
  orbit1.addEventListener('change', () => {
      if (isSyncing) return;
      isSyncing = true;
      camera2.position.copy(camera1.position);
      camera2.quaternion.copy(camera1.quaternion);
      camera2.zoom = camera1.zoom;
      camera2.updateProjectionMatrix();
      isSyncing = false;
  });
  orbit2.addEventListener('change', () => {
      if (isSyncing) return;
      isSyncing = true;
      camera1.position.copy(camera2.position);
      camera1.quaternion.copy(camera2.quaternion);
      camera1.zoom = camera2.zoom;
      camera1.updateProjectionMatrix();
      isSyncing = false;
  });

  // State Management
  let points1 = [];
  let points2 = [];
  let mathematicalPoints = [];
  let arrows = [];
  let principalComponents = [];
  
  const pointGroup1 = new THREE.Group();
  const pointGroup2 = new THREE.Group();
  scene1.add(pointGroup1);
  scene2.add(pointGroup2);
  
  const matOriginal = new THREE.MeshBasicMaterial({ color: 0x9fb5c7 });
  const matProcessed = new THREE.MeshBasicMaterial({ color: 0x6a8ba4 });
  const pointGeo = new THREE.SphereGeometry(0.08);

  // 3. Logic Functions
  function generateData() {
    const pointCount = parseInt(inputPoints.value) || 150;
    
    pointGroup1.clear();
    pointGroup2.clear();
    arrows.forEach(a => scene2.remove(a));
    arrows = [];
    points1 = [];
    points2 = [];
    mathematicalPoints = [];
    
    btnCenter.disabled = false;
    btnEigen.disabled = true;
    btnPCs.disabled = true;
    btnProj.disabled = true;

    const rotX = Math.random() * Math.PI;
    const rotY = Math.random() * Math.PI;

    for (let i = 0; i < pointCount; i++) {
        let vec = new THREE.Vector3((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 0.5);
        vec.applyAxisAngle(new THREE.Vector3(1, 0, 0), rotX);
        vec.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotY);
        vec.x += 3; vec.y += 2; vec.z -= 2;

        const mesh1 = new THREE.Mesh(pointGeo, matOriginal);
        mesh1.position.copy(vec);
        pointGroup1.add(mesh1);
        points1.push(mesh1);

        const mesh2 = new THREE.Mesh(pointGeo, matProcessed);
        mesh2.position.copy(vec);
        pointGroup2.add(mesh2);
        points2.push(mesh2);

        mathematicalPoints.push(vec.clone());
    }
  }

  function centerData() {
    const pointCount = mathematicalPoints.length;
    let mean = new THREE.Vector3(0, 0, 0);
    mathematicalPoints.forEach(p => mean.add(p));
    mean.divideScalar(pointCount);

    points2.forEach((p, index) => {
        let centeredVec = mathematicalPoints[index].clone().sub(mean);
        mathematicalPoints[index].copy(centeredVec);
        // Only animate the processed scene
        gsap.to(p.position, { x: centeredVec.x, y: centeredVec.y, z: centeredVec.z, duration: 1.5, ease: "power2.inOut" });
    });
    btnCenter.disabled = true;
    btnEigen.disabled = false;
  }

  function findEigenvectors() {
    principalComponents = [
        { vec: new THREE.Vector3(1, 0.5, -0.2).normalize(), val: 4.0 },
        { vec: new THREE.Vector3(-0.5, 1, 0.2).normalize(), val: 1.5 },
        { vec: new THREE.Vector3(0.2, -0.2, 1).normalize(), val: 0.2 }
    ];
    
    const colors = [0xe96868, 0x2ca02c, 0xff7f0e];
    principalComponents.forEach((pc, i) => {
        const length = Math.max(Math.sqrt(pc.val) * 2, 0.5); 
        const arrow = new THREE.ArrowHelper(pc.vec, new THREE.Vector3(0,0,0), length, colors[i], 0.3, 0.2);
        scene2.add(arrow);
        arrows.push(arrow);
        arrow.scale.set(0.01, 0.01, 0.01);
        gsap.to(arrow.scale, {x: 1, y: 1, z: 1, duration: 1, delay: i * 0.3, ease: "back.out(1.5)"});
    });
    btnEigen.disabled = true;
    btnPCs.disabled = false;
  }

  function highlightPCs() {
    if (arrows[2]) arrows[2].setColor(new THREE.Color(0xcccccc));
    btnPCs.disabled = true;
    btnProj.disabled = false;
  }

  function projectData() {
    const pc1 = principalComponents[0].vec;
    const pc2 = principalComponents[1].vec;

    points2.forEach((p, index) => {
        const vec = mathematicalPoints[index];
        const dot1 = vec.dot(pc1);
        const dot2 = vec.dot(pc2);
        gsap.to(p.position, { x: dot1 * pc1.x + dot2 * pc2.x, y: dot1 * pc1.y + dot2 * pc2.y, z: dot1 * pc1.z + dot2 * pc2.z, duration: 2, ease: "power3.inOut" });
    });
    btnProj.disabled = true;
  }

  // Handle Resize for Dual Contexts
  const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
          const newW = entry.contentRect.width / 2;
          const newH = entry.contentRect.height;
          renderer1.setSize(newW, newH);
          renderer2.setSize(newW, newH);
          camera1.aspect = newW / newH;
          camera2.aspect = newW / newH;
          camera1.updateProjectionMatrix();
          camera2.updateProjectionMatrix();
      }
  });
  resizeObserver.observe(viewsContainer);

  // 4. Attach Event Listeners
  btnGen.addEventListener('click', generateData);
  btnCenter.addEventListener('click', centerData);
  btnEigen.addEventListener('click', findEigenvectors);
  btnPCs.addEventListener('click', highlightPCs);
  btnProj.addEventListener('click', projectData);

  // 5. Animation Loop
  let animationFrameId;
  function animate() {
    animationFrameId = requestAnimationFrame(animate);
    orbit1.update();
    orbit2.update();
    renderer1.render(scene1, camera1);
    renderer2.render(scene2, camera2);
  }

  // Initialize
  generateData();
  animate();

  // 6. Return Cleanup Function
  return () => {
    cancelAnimationFrame(animationFrameId);
    resizeObserver.disconnect();
    renderer1.dispose();
    renderer2.dispose();
    btnGen.removeEventListener('click', generateData);
    btnCenter.removeEventListener('click', centerData);
    btnEigen.removeEventListener('click', findEigenvectors);
    btnPCs.removeEventListener('click', highlightPCs);
    btnProj.removeEventListener('click', projectData);
  };
}

export default { render };
