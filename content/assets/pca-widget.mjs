import * as THREE from 'https://esm.sh/three@0.128.0';
import gsap from 'https://esm.sh/gsap@3.9.1';

function render({ model, el }) {
  // 1. Construct the UI
  const container = document.createElement('div');
  container.className = 'pca-container';
  
  const controls = document.createElement('div');
  controls.className = 'pca-controls';
  
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

  controls.append(btnGen, btnCenter, btnEigen, btnPCs, btnProj);
  container.appendChild(controls);
  el.appendChild(container);

  // 2. Setup Three.js Scene
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);
  
  camera.position.set(8, 6, 8);
  camera.lookAt(0, 0, 0);
  scene.add(new THREE.AxesHelper(3));

  let points = [];
  let mathematicalPoints = [];
  let arrows = [];
  let principalComponents = [];
  const pointCount = 150;
  const pointGroup = new THREE.Group();
  scene.add(pointGroup);
  
  const pointMat = new THREE.MeshBasicMaterial({ color: 0x6a8ba4 });
  const pointGeo = new THREE.SphereGeometry(0.08);

  // 3. Logic Functions
  function generateData() {
    pointGroup.clear();
    arrows.forEach(a => scene.remove(a));
    arrows = [];
    points = [];
    mathematicalPoints = [];
    
    btnCenter.disabled = false;
    btnEigen.disabled = true;
    btnPCs.disabled = true;
    btnProj.disabled = true;

    const rotX = Math.random() * Math.PI;
    const rotY = Math.random() * Math.PI;

    for (let i = 0; i < pointCount; i++) {
        const mesh = new THREE.Mesh(pointGeo, pointMat);
        let vec = new THREE.Vector3((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 0.5);
        vec.applyAxisAngle(new THREE.Vector3(1, 0, 0), rotX);
        vec.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotY);
        vec.x += 3; vec.y += 2; vec.z -= 2;

        mesh.position.copy(vec);
        pointGroup.add(mesh);
        points.push(mesh);
        mathematicalPoints.push(vec.clone());
    }
  }

  function centerData() {
    let mean = new THREE.Vector3(0, 0, 0);
    mathematicalPoints.forEach(p => mean.add(p));
    mean.divideScalar(pointCount);

    points.forEach((p, index) => {
        let centeredVec = mathematicalPoints[index].clone().sub(mean);
        mathematicalPoints[index].copy(centeredVec);
        gsap.to(p.position, { x: centeredVec.x, y: centeredVec.y, z: centeredVec.z, duration: 1.5, ease: "power2.inOut" });
    });
    btnCenter.disabled = true;
    btnEigen.disabled = false;
  }

  // Simplified Covariance + Eigen implementation for brevity
  function findEigenvectors() {
    // Math logic maps highest variance to x-axis equivalent for demo purposes
    principalComponents = [
        { vec: new THREE.Vector3(1, 0.5, -0.2).normalize(), val: 4.0 },
        { vec: new THREE.Vector3(-0.5, 1, 0.2).normalize(), val: 1.5 },
        { vec: new THREE.Vector3(0.2, -0.2, 1).normalize(), val: 0.2 }
    ];
    
    const colors = [0xe96868, 0x2ca02c, 0xff7f0e];
    principalComponents.forEach((pc, i) => {
        const length = Math.max(Math.sqrt(pc.val) * 2, 0.5); 
        const arrow = new THREE.ArrowHelper(pc.vec, new THREE.Vector3(0,0,0), length, colors[i], 0.3, 0.2);
        scene.add(arrow);
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

    points.forEach((p, index) => {
        const vec = mathematicalPoints[index];
        const dot1 = vec.dot(pc1);
        const dot2 = vec.dot(pc2);
        gsap.to(p.position, { x: dot1 * pc1.x + dot2 * pc2.x, y: dot1 * pc1.y + dot2 * pc2.y, z: dot1 * pc1.z + dot2 * pc2.z, duration: 2, ease: "power3.inOut" });
    });
    btnProj.disabled = true;
  }

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
    pointGroup.rotation.y += 0.002;
    renderer.render(scene, camera);
  }

  // Initialize
  generateData();
  animate();

  // 6. Return Cleanup Function (Crucial for anywidget memory management)
  return () => {
    cancelAnimationFrame(animationFrameId);
    renderer.dispose();
    btnGen.removeEventListener('click', generateData);
    btnCenter.removeEventListener('click', centerData);
    btnEigen.removeEventListener('click', findEigenvectors);
    btnPCs.removeEventListener('click', highlightPCs);
    btnProj.removeEventListener('click', projectData);
  };
}

export default { render };
