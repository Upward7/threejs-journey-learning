import React from "react";
import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { EXRLoader } from "three/addons/loaders/EXRLoader.js";
import texture from "./images/1k.hdr"

export default class environmentMap extends React.Component {
    componentDidMount() {
        this.initThree();
    }

    initThree = () => {

        /* 
        Loaders
        */
        const gltfLoader = new GLTFLoader()
        const cubeTextureLoader = new THREE.CubeTextureLoader()
        const rgbeLoader = new RGBELoader()
        const exrLoader = new EXRLoader() // NVIDIA CANVAS
        const textureLoader = new THREE.TextureLoader() // https://skybox.blockadelabs.com/
        /* 
        Base
        */
        // debug
        const gui = new GUI();
        const global = {};

        // Canvas
        const canvas = document.querySelector("canvas.webgl")
        // scene
        const scene = new THREE.Scene()

        /* 
        Update all materials
        */
        const updateAllMaterials = () => {
            scene.traverse(child => {
                if (child.isMesh && child.material.isMeshStandardMaterial) {
                    child.material.envMapIntensity = global.envMapIntensity
                }
            })
        }
        /* 
        Environment map
        */
        scene.backgroundBlurriness = 0
        scene.backgroundIntensity = 1

        gui.add(scene, "backgroundBlurriness").min(0).max(1).step(0.001)
        gui.add(scene, "backgroundIntensity").min(0).max(10).step(0.001)
        // Global intensity
        global.envMapIntensity = 1;
        gui.add(global, "envMapIntensity", 0, 10, 0.001).onChange(updateAllMaterials)

        // // LDR cube texture
        // const environmentMap = cubeTextureLoader.load([
        //     "/environmentMap/px.jpg",
        //     "/environmentMap/nx.jpg",
        //     "/environmentMap/py.jpg",
        //     "/environmentMap/ny.jpg",
        //     "/environmentMap/pz.jpg",
        //     "/environmentMap/nz.jpg",
        // ])
        // // To apply the environment map as lighting to the whole scene
        // scene.environment = environmentMap
        // scene.background = environmentMap

        // HDR (RGBE) equirectangular
        // rgbeLoader.load("/environmentMap/1k.hdr", (environmentMap) => {
            // //等距圆柱投影
        //     environmentMap.mapping = THREE.EquirectangularReflectionMapping

        //     scene.environment = environmentMap
        //     scene.background = environmentMap
        // })

        // HDR(EXR) equirectangular
        // LDR equirectangular

        // // Ground projected skybox
        // rgbeLoader.load("/environmentMap/1k.hdr", (environmentMap) => {
        //     environmentMap.mapping = THREE.EquirectangularReflectionMapping
        //     scene.environment = environmentMap

        //     // Skybox
        //     const skybox = new GroundedSkybox(environmentMap, 1, 1)
        //     skybox.scale.setScalar(50)
        //     scene.add(skybox)
        //     // 视频里是GroundProjectedSkybox，
        //     // gui.add(skybox, "radius", 1, 200, 0.1).name("skyboxRadius")
        //     // gui.add(skybox, "height", 1, 200, 0.1).name("skyboxHeight")

        // })

        /* 
        real time environment map
        */
        rgbeLoader.load(texture, (environmentMap) => {
            environmentMap.mapping = THREE.EquirectangularReflectionMapping
            scene.background = environmentMap
        })

        // Holy donut
        const holyDonut = new THREE.Mesh(
            new THREE.TorusGeometry(8, 0.5),
            new THREE.MeshBasicMaterial({ color: "white" })
        )
        holyDonut.position.y = 3.5
        holyDonut.layers.enable(1);
        scene.add(holyDonut);

        // Cube render target
        const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(
            256,
            {
                type: THREE.HalfFloatType // use only 16bits
            }
        )
        scene.environment = cubeRenderTarget.texture;

        // Cube camera
        const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget)
        cubeCamera.layers.set(1)

        /* 
        Torus Knot
        */
        const torusKnot = new THREE.Mesh(
            new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
            new THREE.MeshStandardMaterial({ roughness: 0, metalness: 1, color: 0xaaaaaa })
        )
        // torusKnot.material.envMap = environmentMap
        torusKnot.position.x = -4
        torusKnot.position.y = 4
        scene.add(torusKnot)

        /* 
        Models
        */
        gltfLoader.load(
            "./models/FlightHelmet/glTF/FlightHelmet.gltf",
            (gltf) => {
                gltf.scene.scale.set(10, 10, 10)
                scene.add(gltf.scene)

                updateAllMaterials()
            }
        )

        /* 
        Sizes
        */
        const sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        }

        window.addEventListener("resize", () => {
            sizes.width = window.innerWidth
            sizes.height = window.innerHeight

            camera.aspect = sizes.width / sizes.height
            camera.updateProjectionMatrix()

            renderer.setSize(sizes.width, sizes.height)
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        })

        /**
         * Camera
         */
        // Base camera
        const camera = new THREE.PerspectiveCamera(
            75,
            sizes.width / sizes.height,
            0.1,
            100
        );
        camera.position.set(4, 1, -4);
        scene.add(camera);

        // Controls
        const controls = new OrbitControls(camera, canvas);
        controls.enableDamping = true;

        /**
         * Renderer
         */
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            /**
             * To make the edges of the objects more smooth
             */
            antialias: true,
        });
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        /**
         * Animate
         */
        const clock = new THREE.Clock()
        const tick = () => {

            // Time
            const elapsedTime = clock.getElapsedTime();

            // Real time environment map
            if (holyDonut) {
                holyDonut.rotation.x = Math.sin(elapsedTime) * 2;

                cubeCamera.update(renderer, scene);
            }
            // Update controls
            controls.update();

            // Render
            renderer.render(scene, camera);

            // Call tick again on the next frame
            window.requestAnimationFrame(tick);
        };

        tick();
    }

    render() {
        return (
            <canvas className="webgl"></canvas>
        )
    }
}