// imports
import {
  Scene,
  OrthographicCamera,
  WebGLRenderer,
  BoxGeometry,
  // MeshBasicMaterial, // these don't need lights
  Mesh,
  PlaneGeometry,
  MeshStandardMaterial, // these need lights
  DirectionalLight,
  Vector3,
  PCFSoftShadowMap,
} from 'three';

let scene,
  camera,
  renderer,
  cube,
  plane,
  viewSize = 10, // '1/zoom level'
  directionalLight;
const { innerWidth, innerHeight } = window;
// initial scene setup
const getAngleDeg = angle => angle * (Math.PI / 2 / 90);

let aspectRatio = innerWidth / innerHeight;
const cameraValues = {
  left: (-aspectRatio * viewSize) / 2,
  right: (aspectRatio * viewSize) / 2,
  top: viewSize / 2,
  bottom: -viewSize / 2,
};

const init = () => {
  scene = new Scene();

  // OrthographicCamera( left : Number, right : Number, top : Number, bottom : Number, near : Number, far : Number )
  // https://threejs.org/docs/index.html#api/en/cameras/OrthographicCamera

  // PerspectiveCamera( fov : Number, aspect : Number, near : Number, far : Number )
  // https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera
  // fov — Camera frustum vertical field of view.
  // aspect — Camera frustum aspect ratio.
  // near — Camera frustum near plane. -- closest renderable
  // far — Camera frustum far plane. -- farthest renderable

  // OrthographicCamera( left : Number, right : Number, top : Number, bottom : Number, near : Number, far : Number )

  camera = new OrthographicCamera(...Object.values(cameraValues), -1000, 1000);
  camera.position.set(5, 5, 5);
  console.log('⚡🚨: init -> camera', camera);

  // camera captures the scene, sends it to the renderer to process it into a dom element
  renderer = new WebGLRenderer();
  renderer.setSize(innerWidth, innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);

  // Lights
  directionalLight = new DirectionalLight(0xffffff, 0.8);
  console.log('⚡🚨: init -> directionalLight', directionalLight);
  directionalLight.castShadow = true;
  directionalLight.position.set(50, 100, 0);

  const SOMETHING = 10;
  directionalLight.shadow.camera.left = cameraValues.left * SOMETHING;
  directionalLight.shadow.camera.right = cameraValues.right * SOMETHING;
  directionalLight.shadow.camera.top = cameraValues.top * SOMETHING;
  directionalLight.shadow.camera.bottom = cameraValues.bottom * SOMETHING;
  directionalLight.shadow.mapSize.x = 2 ** 9; // 2 ^ detailAmount
  directionalLight.shadow.mapSize.y = 2 ** 9;
  scene.add(directionalLight, directionalLight.target);

  // TODO: make the light look like the sun!

  // "mesh": an object in the scene
  // i.e. a geometry: vertices + material (shader)
  const cubeDims = { x: 1, y: 1, z: 1 };
  const cube_geometry = new BoxGeometry(cubeDims.x, cubeDims.y, cubeDims.z); //https://threejs.org/docs/index.html#api/en/geometries/BoxGeometry
  const cube_material = new MeshStandardMaterial({
    color: 'hsla(100,80%,50%,1)',
  }); // built-in meshes: preset, pre-made shaders (no shaders)
  // Mesh: shape + look
  cube = new Mesh(cube_geometry, cube_material);
  cube.position.y = cubeDims.y / 2;
  scene.add(cube);
  cube.castShadow = cube.receiveShadow = true;

  // Plane
  const plane_geometry = new PlaneGeometry(50, 50); //https://threejs.org/docs/index.html#api/en/geometries/BoxGeometry
  const plane_material = new MeshStandardMaterial({
    color: 'hsla(10,20%,50%,1)',
  }); // built-in meshes: preset, pre-made shaders (no shaders)
  // Mesh: shape + look
  plane = new Mesh(plane_geometry, plane_material);

  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);
  plane.castShadow = plane.receiveShadow = true;

  // camera looks at cube
  camera.lookAt(plane.position); // Vector3 or x,y,z
  directionalLight.target.position.set(0, 0, 50); // 😎😎😎😎
};

// updates every frame
const animate = time => {
  // time is like performance.now() -- // can use delta-time for updates
  // call animate recursively
  requestAnimationFrame(animate);

  // update logic
  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;

  // render scene
  renderer.render(scene, camera);
};

// updates viewport on resize
const resize = () => {
  let aspectRatio = window.innerWidth / window.innerHeight;
  camera = new OrthographicCamera(...Object.values(cameraValues), -1000, 1000);
  if (renderer) renderer.setSize(window.innerWidth, window.innerHeight);
};
window.addEventListener('resize', resize);

// runs init, then animate
if (!init()) animate(); // weirdo

// ===================== //

// TODO: CSS
// node is getting repainted too much?
// `will-change: transform`

// TODO: Boomerang Game (MVP)
// - Orthographic camera
// - Character BONUS: with a hat
// - Movement logic
// - Mouse logic for throwing boomerang
// - Logic for boomerang movement
//    - 1. comes right back
//    - 2. interpolate btw current / start
