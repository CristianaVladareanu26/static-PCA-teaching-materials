import * as THREE from 'https://esm.sh/three@0.128.0';
import { OrbitControls } from 'https://esm.sh/three@0.128.0/examples/jsm/controls/OrbitControls.js';
import { Matrix, EigenvalueDecomposition } from 'https://esm.sh/ml-matrix@6.10.0';
import gsap from 'https://esm.sh/gsap@3.9.1';

export default {
  render({ model, el }) {

    // =========================
    // UI
    // =========================
    const container = document.createElement('div');
    container.className = 'pca-container';

    const controls = document.createElement('div');
    controls.className = 'pca-controls';

    const inputRow = document.createElement('div');
    const label = document.createElement('label');
    label.innerText = 'Datapoints:';

    const inputPoints = document.createElement('input');
    inputPoints.type = 'number';
    inputPoints.value = '150';
    inputPoints.min = '10';
    inputPoints.max = '2000';

    inputRow.append(label, inputPoints);

    const btnGen = makeBtn('Generate Dataset');
    const btnCenter = makeBtn('1. Center Data');
    const btnEigen = makeBtn('2. Eigenvectors', true);
    const btnPCs = makeBtn('3. PCs', true);
    const btnProj = makeBtn('4. Project', true);

    controls.append(inputRow, btnGen, btnCenter, btnEigen, btnPCs, btnProj);
    container.appendChild(controls);

    const views = document.createElement('div');
    views.className = 'views-container';

    const viewA = document.createElement('div');
    const viewB = document.createElement('div');
    viewA.className = 'scene-container';
    viewB.className = 'scene-container';

    views.append(viewA, viewB);
    container.appendChild(views);
    el.appendChild(container);

    // =========================
    // THREE SETUP (shared camera FIX)
    // =========================
    const sceneA = new THREE.Scene();
    const sceneB = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    camera.position.set(6, 5, 6);

    const rendererA = new THREE.WebGLRenderer({ antialias: true });
    const rendererB = new THREE.WebGLRenderer({ antialias: true });

    rendererA.setClearColor(0xf4f6f8, 1);
    rendererB.setClearColor(0xf4f6f8, 1);

    viewA.appendChild(rendererA.domElement);
    viewB.appendChild(rendererB.domElement);

    const controlsA = new OrbitControls(camera, rendererA.domElement);
    const controlsB = new OrbitControls(camera, rendererB.domElement);

    controlsA.addEventListener('change', renderAll);
    controlsB.addEventListener('change', renderAll);

    sceneA.add(new THREE.AxesHelper(3));
    sceneB.add(new THREE.AxesHelper(3));

    // =========================
    // STATE
    // =========================
    const state = {
      raw: [],
      centered: [],
      mean: new THREE.Vector3(),
      eigenvectors: [],
      step: 0
    };

    const pointGroupA = new THREE.Group();
    const pointGroupB = new THREE.Group();
    sceneA.add(pointGroupA);
    sceneB.add(pointGroupB);

    const arrows = [];

    const matA = new THREE.MeshBasicMaterial({ color: 0x9fb5c7 });
    const matB = new THREE.MeshBasicMaterial({ color: 0x6a8ba4 });
    const sphere = new THREE.SphereGeometry(0.08);

    // =========================
    // CORE HELPERS
    // =========================
    function makeBtn(text, disabled = false) {
      const b = document.createElement('button');
      b.innerText = text;
      b.disabled = disabled;
      return b;
    }

    function randn() {
      let u = 0, v = 0;
      while (u === 0) u = Math.random();
      while (v === 0) v = Math.random();
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    }

    function renderAll() {
      rendererA.render(sceneA, camera);
      rendererB.render(sceneB, camera);
    }

    function resize() {
      const w = container.clientWidth / 2;
      const h = container.clientHeight;

      rendererA.setSize(w, h);
      rendererB.setSize(w, h);

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }

    new ResizeObserver(resize).observe(container);

    // =========================
    // DATA RENDER
    // =========================
    function drawPoints(group, points, material) {
      group.clear();
      for (const p of points) {
        const m = new THREE.Mesh(sphere, material);
        m.position.copy(p);
        group.add(m);
      }
    }

    // =========================
    // STEP 0: GENERATE DATA
    // =========================
    function generate() {
      const n = parseInt(inputPoints.value) || 150;
    
      state.raw = [];
    
      // random center in a quadrant-like space
      const globalCenter = new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 8
      );
    
      // random anisotropic spread direction
      const spread = new THREE.Vector3(
        1 + Math.random() * 3,
        0.5 + Math.random() * 2,
        0.2 + Math.random() * 1.5
      );
    
      for (let i = 0; i < n; i++) {
        const p = new THREE.Vector3(
          randn() * spread.x,
          randn() * spread.y,
          randn() * spread.z
        );
    
        p.add(globalCenter); // IMPORTANT: shift dataset
    
        state.raw.push(p);
      }
    
      state.centered = [];
      state.eigenvectors = [];
    
      arrows.forEach(a => sceneB.remove(a));
      arrows.length = 0;
    
      drawPoints(pointGroupA, state.raw, matA);
      drawPoints(pointGroupB, state.raw, matB);
    
      btnCenter.disabled = false;
      btnEigen.disabled = true;
      btnPCs.disabled = true;
      btnProj.disabled = true;
    
      renderAll();
    }

    // =========================
    // STEP 1: CENTER DATA
    // =========================
    function center() {
      const mean = new THREE.Vector3();

      for (const p of state.raw) mean.add(p);
      mean.divideScalar(state.raw.length);

      state.mean = mean;

      state.centered = state.raw.map(p =>
        p.clone().sub(mean)
      );

      drawPoints(pointGroupB, state.centered, matB);

      btnEigen.disabled = false;
      renderAll();
    }

    // =========================
    // STEP 2: COVARIANCE
    // =========================
    function covariance(data) {
      const n = data.length;

      const cov = [
        [0,0,0],
        [0,0,0],
        [0,0,0]
      ];

      for (const p of data) {
        cov[0][0] += p.x * p.x;
        cov[0][1] += p.x * p.y;
        cov[0][2] += p.x * p.z;

        cov[1][0] += p.y * p.x;
        cov[1][1] += p.y * p.y;
        cov[1][2] += p.y * p.z;

        cov[2][0] += p.z * p.x;
        cov[2][1] += p.z * p.y;
        cov[2][2] += p.z * p.z;
      }

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          cov[i][j] /= (n - 1);
        }
      }

      return cov;
    }

    // =========================
    // STEP 2: EIGENVECTORS (REAL PCA)
    // =========================
    function eigen() {
      const cov = covariance(state.centered);

      const eig = new EigenvalueDecomposition(new Matrix(cov));

      const vecs = eig.eigenvectorMatrix.to2DArray();

      state.eigenvectors = [
        new THREE.Vector3(...vecs[0]).normalize(),
        new THREE.Vector3(...vecs[1]).normalize(),
        new THREE.Vector3(...vecs[2]).normalize()
      ];

      drawEigen();
      btnPCs.disabled = false;
    }

    function drawEigen() {
      const origin = state.mean || new THREE.Vector3(0,0,0);
    
      const colors = [0xff3b30, 0x34c759, 0x007aff];
    
      state.eigenvectors.forEach((v, i) => {
    
        const arrow = new THREE.ArrowHelper(v, origin, 4, colors[i], 0.6, 0.4);
    
        // MAKE IT VISIBLE
        arrow.cone.material.depthTest = false;
        arrow.line.material.depthTest = false;
    
        arrow.renderOrder = 999;
    
        sceneB.add(arrow);
        arrows.push(arrow);
      });
    }

    // =========================
    // STEP 3: PC HIGHLIGHT
    // =========================
    function highlight() {
      arrows.forEach((a, i) => {
        if (i === 0) {
          a.setColor(new THREE.Color(0xff0000));
        }
        if (i === 1) {
          a.setColor(new THREE.Color(0x00ff00));
        }
      });
    
      btnProj.disabled = false;
    }

    // =========================
    // STEP 4: PROJECTION
    // =========================
    function project() {
      const [pc1, pc2] = state.eigenvectors;

      const projected = state.centered.map(p => {
        const x = p.dot(pc1);
        const y = p.dot(pc2);

        return new THREE.Vector3(
          x * pc1.x + y * pc2.x,
          x * pc1.y + y * pc2.y,
          x * pc1.z + y * pc2.z
        );
      });

      drawPoints(pointGroupB, projected, matB);
    }

    // =========================
    // EVENTS
    // =========================
    btnGen.onclick = generate;
    btnCenter.onclick = center;
    btnEigen.onclick = eigen;
    btnPCs.onclick = highlight;
    btnProj.onclick = project;

    // =========================
    // INIT
    // =========================
    generate();
    resize();
    renderAll();

    function cleanup() {
      rendererA.dispose();
      rendererB.dispose();
    }

    return cleanup;
  }
};

// import * as THREE from 'https://esm.sh/three@0.128.0';
// import { OrbitControls } from 'https://esm.sh/three@0.128.0/examples/jsm/controls/OrbitControls.js';
// import gsap from 'https://esm.sh/gsap@3.9.1';

// function render({ model, el }) {
//   // 1. Construct the UI
//   const container = document.createElement('div');
//   container.className = 'pca-container';
  
//   const controls = document.createElement('div');
//   controls.className = 'pca-controls';
  
//   const inputRow = document.createElement('div');
//   const lbl = document.createElement('label');
//   lbl.innerText = 'Datapoints: ';
//   const inputPoints = document.createElement('input');
//   inputPoints.type = 'number';
//   inputPoints.value = '150';
//   inputPoints.min = '10';
//   inputPoints.max = '1000';
//   inputRow.append(lbl, inputPoints);

//   const btnGen = document.createElement('button');
//   btnGen.innerText = 'Generate Random Dataset';
  
//   const btnCenter = document.createElement('button');
//   btnCenter.innerText = '1. Center Data';
  
//   const btnEigen = document.createElement('button');
//   btnEigen.innerText = '2. Find Eigenvectors';
//   btnEigen.disabled = true;
  
//   const btnPCs = document.createElement('button');
//   btnPCs.innerText = '3. Find PCs';
//   btnPCs.disabled = true;
  
//   const btnProj = document.createElement('button');
//   btnProj.innerText = '4. Project Data';
//   btnProj.disabled = true;

//   controls.append(inputRow, btnGen, btnCenter, btnEigen, btnPCs, btnProj);
//   container.appendChild(controls);
  
//   // Dual Viewport Setup
//   const viewsContainer = document.createElement('div');
//   viewsContainer.className = 'views-container';
  
//   const view1 = document.createElement('div');
//   view1.className = 'scene-container';
//   const view2 = document.createElement('div');
//   view2.className = 'scene-container';
  
//   viewsContainer.append(view1, view2);
//   container.appendChild(viewsContainer);
//   el.appendChild(container);

//   // 2. Setup Three.js Scenes
//   const scene1 = new THREE.Scene(); // Original Data
//   const scene2 = new THREE.Scene(); // Processed Data

//   // Fallback dimensions before full DOM mount
//   const w = container.clientWidth / 2 || 400; 
//   const h = container.clientHeight || 600;

//   const camera1 = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000);
//   camera1.position.set(8, 6, 8);
//   camera1.lookAt(0, 0, 0);

//   const camera2 = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000);
//   camera2.position.set(8, 6, 8);
//   camera2.lookAt(0, 0, 0);

//   const renderer1 = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//   renderer1.setSize(w, h);
//   view1.appendChild(renderer1.domElement);

//   const renderer2 = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//   renderer2.setSize(w, h);
//   view2.appendChild(renderer2.domElement);

//   scene1.add(new THREE.AxesHelper(3));
//   scene2.add(new THREE.AxesHelper(3));

//   // Syncing Orbit Controls
//   const orbit1 = new OrbitControls(camera1, renderer1.domElement);
//   const orbit2 = new OrbitControls(camera2, renderer2.domElement);
  
//   let isSyncing = false;
//   orbit1.addEventListener('change', () => {
//       if (isSyncing) return;
//       isSyncing = true;
//       camera2.position.copy(camera1.position);
//       camera2.quaternion.copy(camera1.quaternion);
//       camera2.zoom = camera1.zoom;
//       camera2.updateProjectionMatrix();
//       isSyncing = false;
//   });
//   orbit2.addEventListener('change', () => {
//       if (isSyncing) return;
//       isSyncing = true;
//       camera1.position.copy(camera2.position);
//       camera1.quaternion.copy(camera2.quaternion);
//       camera1.zoom = camera2.zoom;
//       camera1.updateProjectionMatrix();
//       isSyncing = false;
//   });

//   // State Management
//   let points1 = [];
//   let points2 = [];
//   let mathematicalPoints = [];
//   let arrows = [];
//   let principalComponents = [];
  
//   const pointGroup1 = new THREE.Group();
//   const pointGroup2 = new THREE.Group();
//   scene1.add(pointGroup1);
//   scene2.add(pointGroup2);
  
//   const matOriginal = new THREE.MeshBasicMaterial({ color: 0x9fb5c7 });
//   const matProcessed = new THREE.MeshBasicMaterial({ color: 0x6a8ba4 });
//   const pointGeo = new THREE.SphereGeometry(0.08);

//   // 3. Logic Functions
//   function generateData() {
//     const pointCount = parseInt(inputPoints.value) || 150;
    
//     pointGroup1.clear();
//     pointGroup2.clear();
//     arrows.forEach(a => scene2.remove(a));
//     arrows = [];
//     points1 = [];
//     points2 = [];
//     mathematicalPoints = [];
    
//     btnCenter.disabled = false;
//     btnEigen.disabled = true;
//     btnPCs.disabled = true;
//     btnProj.disabled = true;

//     const rotX = Math.random() * Math.PI;
//     const rotY = Math.random() * Math.PI;

//     for (let i = 0; i < pointCount; i++) {
//         let vec = new THREE.Vector3((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 0.5);
//         vec.applyAxisAngle(new THREE.Vector3(1, 0, 0), rotX);
//         vec.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotY);
//         vec.x += 3; vec.y += 2; vec.z -= 2;

//         const mesh1 = new THREE.Mesh(pointGeo, matOriginal);
//         mesh1.position.copy(vec);
//         pointGroup1.add(mesh1);
//         points1.push(mesh1);

//         const mesh2 = new THREE.Mesh(pointGeo, matProcessed);
//         mesh2.position.copy(vec);
//         pointGroup2.add(mesh2);
//         points2.push(mesh2);

//         mathematicalPoints.push(vec.clone());
//     }
//   }

//   function centerData() {
//     const pointCount = mathematicalPoints.length;
//     let mean = new THREE.Vector3(0, 0, 0);
//     mathematicalPoints.forEach(p => mean.add(p));
//     mean.divideScalar(pointCount);

//     points2.forEach((p, index) => {
//         let centeredVec = mathematicalPoints[index].clone().sub(mean);
//         mathematicalPoints[index].copy(centeredVec);
//         // Only animate the processed scene
//         gsap.to(p.position, { x: centeredVec.x, y: centeredVec.y, z: centeredVec.z, duration: 1.5, ease: "power2.inOut" });
//     });
//     btnCenter.disabled = true;
//     btnEigen.disabled = false;
//   }

//   function findEigenvectors() {
//     principalComponents = [
//         { vec: new THREE.Vector3(1, 0.5, -0.2).normalize(), val: 4.0 },
//         { vec: new THREE.Vector3(-0.5, 1, 0.2).normalize(), val: 1.5 },
//         { vec: new THREE.Vector3(0.2, -0.2, 1).normalize(), val: 0.2 }
//     ];
    
//     const colors = [0xe96868, 0x2ca02c, 0xff7f0e];
//     principalComponents.forEach((pc, i) => {
//         const length = Math.max(Math.sqrt(pc.val) * 2, 0.5); 
//         const arrow = new THREE.ArrowHelper(pc.vec, new THREE.Vector3(0,0,0), length, colors[i], 0.3, 0.2);
//         scene2.add(arrow);
//         arrows.push(arrow);
//         arrow.scale.set(0.01, 0.01, 0.01);
//         gsap.to(arrow.scale, {x: 1, y: 1, z: 1, duration: 1, delay: i * 0.3, ease: "back.out(1.5)"});
//     });
//     btnEigen.disabled = true;
//     btnPCs.disabled = false;
//   }

//   function highlightPCs() {
//     if (arrows[2]) arrows[2].setColor(new THREE.Color(0xcccccc));
//     btnPCs.disabled = true;
//     btnProj.disabled = false;
//   }

//   function projectData() {
//     const pc1 = principalComponents[0].vec;
//     const pc2 = principalComponents[1].vec;

//     points2.forEach((p, index) => {
//         const vec = mathematicalPoints[index];
//         const dot1 = vec.dot(pc1);
//         const dot2 = vec.dot(pc2);
//         gsap.to(p.position, { x: dot1 * pc1.x + dot2 * pc2.x, y: dot1 * pc1.y + dot2 * pc2.y, z: dot1 * pc1.z + dot2 * pc2.z, duration: 2, ease: "power3.inOut" });
//     });
//     btnProj.disabled = true;
//   }

//   // Handle Resize for Dual Contexts
//   const resizeObserver = new ResizeObserver(entries => {
//       for (let entry of entries) {
//           const newW = entry.contentRect.width / 2;
//           const newH = entry.contentRect.height;
//           renderer1.setSize(newW, newH);
//           renderer2.setSize(newW, newH);
//           camera1.aspect = newW / newH;
//           camera2.aspect = newW / newH;
//           camera1.updateProjectionMatrix();
//           camera2.updateProjectionMatrix();
//       }
//   });
//   resizeObserver.observe(viewsContainer);

//   // 4. Attach Event Listeners
//   btnGen.addEventListener('click', generateData);
//   btnCenter.addEventListener('click', centerData);
//   btnEigen.addEventListener('click', findEigenvectors);
//   btnPCs.addEventListener('click', highlightPCs);
//   btnProj.addEventListener('click', projectData);

//   // 5. Animation Loop
//   let animationFrameId;
//   function animate() {
//     animationFrameId = requestAnimationFrame(animate);
//     orbit1.update();
//     orbit2.update();
//     renderer1.render(scene1, camera1);
//     renderer2.render(scene2, camera2);
//   }

//   // Initialize
//   generateData();
//   animate();

//   // 6. Return Cleanup Function
//   return () => {
//     cancelAnimationFrame(animationFrameId);
//     resizeObserver.disconnect();
//     renderer1.dispose();
//     renderer2.dispose();
//     btnGen.removeEventListener('click', generateData);
//     btnCenter.removeEventListener('click', centerData);
//     btnEigen.removeEventListener('click', findEigenvectors);
//     btnPCs.removeEventListener('click', highlightPCs);
//     btnProj.removeEventListener('click', projectData);
//   };
// }

// export default { render };
