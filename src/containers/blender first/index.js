import React from "react";
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import texture from "./textures/baked.jpg";
import model from "./models/portal.glb"

export default class helloBlender extends React.Component {
    componentDidMount() {
        this.initThree();
    }

    initThree = () => {
        // /* 
        // Spector JS
        // */
        // const SPECTOR = require("spectorjs");
        // spector = new SPECTOR.Spector()
        // spector.displayUI()
        /* 
        Base
        */
        // Canvas
        const canvas = document.querySelector("canvas.webgl");
        // Scene
        const scene = new THREE.Scene();
        /* 
        Models
        */
        // textures
        const textureLoader = new THREE.TextureLoader();
        const bakedTexture = textureLoader.load(texture);
        bakedTexture.flipY = false;
        bakedTexture.colorSpace = THREE.SRGBColorSpace;

        // baked material
        const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture });
        const poleLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffe5 });
        const portalLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffe5 })

        // model
        const gltfModel = new GLTFLoader();
        gltfModel.load(
            model,
            (gltf) => {
                gltf.scene.traverse(child => {
                    child.material = bakedMaterial;
                })
                // const bakedMesh = gltf.scene.children.find(child => child.name == "baked")
                const portalLightMesh = gltf.scene.children.find(child => child.name == "portalLight");
                const poleLightAMesh = gltf.scene.children.find(child => child.name == "poleLightA");
                const poleLightBMesh = gltf.scene.children.find(child => child.name == "poleLightB");

                // aplly material
                // bakedMesh.material = bakedMaterial; // 我的UV展开有问题 merge了以后 某些材质显示更不好了
                poleLightAMesh.material = poleLightMaterial;
                poleLightBMesh.material = poleLightMaterial;
                portalLightMesh.material = portalLightMaterial;
                scene.add(gltf.scene);
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
            sizes.width = window.innerWidth;
            sizes.height = window.innerHeight;

            camera.aspect = sizes.width / sizes.height;
            camera.updateProjectionMatrix();

            renderer.setSize(sizes.width, sizes.height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        })

        /* 
        Camera
        */
        const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
        camera.position.set(2, 2, 2);
        scene.add(camera);

        /* 
        Controls
        */
        const controls = new OrbitControls(camera, canvas);
        controls.target.set(0, 0.75, 0);
        controls.enableDamping = true;

        /* 
        Renderer
        */
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas
        });
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

        const clock = new THREE.Clock();
        let previousTime = 0;
        const tick = () => {
            const elapsedTime = clock.getElapsedTime();
            const deltaTime = elapsedTime - previousTime;
            previousTime = elapsedTime;

            renderer.render(scene, camera);
            controls.update();
            window.requestAnimationFrame(tick);
        }
        tick();


    }

    render() {
        return (
            <canvas className="webgl"></canvas>
        )
    }
}