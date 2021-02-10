import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as dat from "dat.gui"

// Exporter
// import { saveAs } from 'file-saver';
// import * as exportSTL from 'threeJS-export-STL';

/**
 * GUI Debug
 */
const gui = new dat.GUI({closed:true})
gui.hide()
/**
 * Cursor
 */
const cursor = {
    x: 0,
    y: 0
}
window.addEventListener("mousemove", (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = - (event.clientY / sizes.height - 0.5)
})

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color( 0xf3f3f3 )
//Axes helper
const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)



/**
 * Particles
 */
// Geometry
const particlesGeometry = new THREE.SphereBufferGeometry(1.5,20,20)
// Material
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.01,
    sizeAttenuation: true,
    color: "black"
})
// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)
/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1,1,1)
const material = new THREE.MeshBasicMaterial({
    color: 0x000000,
    wireframe: true
 })

const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

const gltfLoader = new GLTFLoader()
gltfLoader.load("/models/scene.glb",
    (glb) => {
        console.log(glb.scene.children[5].children)
        scene.add(glb.scene)
    }
)


/**
 * Export
 */
// const buffer = exportSTL.fromMesh(mesh);
// const blob = new Blob([buffer], { type: exportSTL.mimeType });
// saveAs(blob, 'cube.stl');




/**
 * GUI Debug
 */
gui.add(mesh.position, "x")
.min(-3).max(3).step(0.01)
.name("Posicion X")
gui.add(mesh, "visible")

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Fullscreen
 */
window.addEventListener('dblclick', () => {
    // Webkit para safari...
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

    if(!fullscreenElement)
    {
        if(canvas.requestFullscreen)
        {
            canvas.requestFullscreen()
        }
        else if(canvas.webkitRequestFullscreen)
        {
            canvas.webkitRequestFullscreen()
        }
    }
    else
    {
        if(document.exitFullscreen)
        {
            document.exitFullscreen()
        }
        else if(document.webkitExitFullscreen)
        {
            document.webkitExitFullscreen()
        }
    }
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    
    // Update camera (basic controls)
    camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 2
    camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 2
    camera.position.y = cursor.y * 5
    camera.lookAt(mesh.position)
    
    // Update particles
    particles.rotation.y = elapsedTime * 0.2

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()