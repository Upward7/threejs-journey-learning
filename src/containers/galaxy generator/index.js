import React from "react";
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js"

export default class Galaxy extends React.Component {
    componentDidMount() {
        this.initThree();
    }

    initThree = () => {
        /* debug */
        const gui = new GUI();
        /* canvas */
        const canvas = document.querySelector("canvas.webgl");
        /* scene */
        const scene = new THREE.Scene();
        /* 
        Galaxy
        */
        const parameters = {};
        parameters.count = 200;
        parameters.size = 0.02;
        parameters.radius = 5;
        parameters.branch = 3;
        parameters.spin = 1;
        parameters.randomness = 0.2;
        parameters.randomnessPower = 3;
        parameters.insideColor = "#ff6030";
        parameters.outsideColor = "#1b3984";

        let geometry = null;
        let material = null;
        let points = null;
        const generateGalaxy = () => {
            // destroy old galaxy
            if (points != null) {
                geometry.dispose();
                material.dispose();
                scene.remove(points);
            }
            // geometry
            const positions = new Float32Array(parameters.count * 3);
            const colors = new Float32Array(parameters.count * 3);

            const colorInside = new THREE.Color(parameters.insideColor);
            const colorOutside = new THREE.Color(parameters.outsideColor);

            for (let i = 0; i < parameters.count; i++) {
                const i3 = i * 3;

                // Position
                const radius = Math.random() * parameters.radius;

                const spinAngle = radius * parameters.spin; // radius越大，旋转越多
                // 0 1 2 0 1 2 ...  // 0 0.33 0.66 0 0.33 0.66 ...
                const branchAngle = (i % parameters.branch) / parameters.branch * Math.PI * 2; 

                const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);
                const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);
                const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);

                positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
                positions[i3 + 1] = randomY;
                positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

                // Color
                const mixedColor = colorInside.clone();
                mixedColor.lerp(colorOutside, radius / parameters.radius);
                colors[i3] = mixedColor.r;
                colors[i3 + 1] = mixedColor.g;
                colors[i3 + 2] = mixedColor.b;
            }
            geometry = new THREE.BufferGeometry();
            geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

            // material
            material = new THREE.PointsMaterial({
                size: parameters.size,
                sizeAttenuation: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
                vertexColors: true
            })

            // points
            points = new THREE.Points(geometry, material);
            scene.add(points);
        }
        generateGalaxy();
        gui.add(parameters, "count", 100, 10000, 100).onFinishChange(generateGalaxy);
        gui.add(parameters, "size", 0.01, 0.1, 0.01).onFinishChange(generateGalaxy);
        gui.add(parameters, "radius", 0.01, 10, 0.01).onFinishChange(generateGalaxy);
        gui.add(parameters, "branch", 2, 10, 1).onFinishChange(generateGalaxy);
        gui.add(parameters, "spin", -5, 5, 0.01).onFinishChange(generateGalaxy);
        gui.add(parameters, "randomness", 0, 2, 0.01).onFinishChange(generateGalaxy);
        gui.add(parameters, "randomnessPower", 1, 10, 0.01).onFinishChange(generateGalaxy);
        gui.add(parameters, "insideColor").onFinishChange(generateGalaxy);
        gui.add(parameters, "outsideColor").onFinishChange(generateGalaxy);

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