import React from "react";
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import circleTexture from "./textures/circle_02.png"

export default class Particles extends React.Component {
    componentDidMount() {
        this.initThree();
    }

    initThree = () => {
        /* canvas */
        const canvas = document.querySelector("canvas.webgl");
        /* scene */
        const scene = new THREE.Scene();
        /* Textures */
        // https://www.kenney.nl/assets/particle-pack
        const textureLoader = new THREE.TextureLoader();
        const particleTexture = textureLoader.load(circleTexture);
        /* 
        Particles
        */
        // geometry
        const particleGeometry = new THREE.BufferGeometry();
        const count = 500;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        for (let i = 0; i < count * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 10;
            colors[i] = Math.random();
        }
        particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
        // material
        const particleMateiral = new THREE.PointsMaterial({
            size: 0.1,
            sizeAttenuation: true // 粒子大小会根据摄像机距离自动调整，离得越远越小，反之。
        });
        particleMateiral.transparent = true;
        particleMateiral.alphaMap = particleTexture;
        // particleMateiral.alphaTest = 0.001;
        // particleMateiral.depthTest = false;
        particleMateiral.depthWrite = false;
        particleMateiral.blending = THREE.AdditiveBlending; // 光的叠加效果
        particleMateiral.vertexColors = true;

        // points
        const point = new THREE.Points(particleGeometry, particleMateiral);
        scene.add(point);

        /* sizes */
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

        /* camera */
        const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
        camera.position.set(2, 2, 2);
        scene.add(camera);

        /* controls */
        const controls = new OrbitControls(camera, canvas);
        controls.enableDamping = true;

        /* renderer */
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas
        });
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        /* Animate */
        const clock = new THREE.Clock();

        const tick = () => {

            const elapsedTime = clock.getElapsedTime();

            // update particles

            // update controls
            controls.update();

            // update renderer
            renderer.render(scene, camera);

            // call tick again on the next frame
            window.requestAnimationFrame(tick);
        }
        tick();
    }

    render() {
        return (
            <>
                <canvas className="webgl"></canvas>
            </>
        )
    }
}