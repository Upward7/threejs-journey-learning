import React from "react";
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import texture from "./textures/1.png";

export default class threeText extends React.Component {
    componentDidMount() {
        this.initThree();
    }

    initThree = () => {
        /* 
        Canvas 
        */
        const canvas = document.querySelector("canvas.webgl");
        /* 
        Scene 
        */
        const scene = new THREE.Scene();

        /* 
        Textures
        */
        const textureLoader = new THREE.TextureLoader();
        const matcapTexture = textureLoader.load(texture);
        // https:github.com/nidorx/matcaps

        /* 
        Font 
        */
        const fontLoader = new FontLoader();
        fontLoader.load(
            "./fonts/helvetiker_regular.typeface.json",
            (font) => {
                const textGeometry = new TextGeometry(
                    "Hello ThreeJS",
                    {
                        font: font,
                        size: 0.5,
                        depth: 0.2,
                        curveSegments: 4,
                        bevelEnabled: true,
                        bevelThickness: 0.03,
                        bevelSize: 0.02,
                        bevelOffset: 0,
                        bevelSegments: 5
                    }
                );
                // textGeometry.computeBoundingBox();
                // // bevelSize bevelThickness
                // textGeometry.translate(
                //     -(textGeometry.boundingBox.max.x - 0.02) * 0.5,
                //     -(textGeometry.boundingBox.max.y - 0.02) * 0.5,
                //     -(textGeometry.boundingBox.max.z - 0.03) * 0.5,
                // );
                textGeometry.center();

                // 快速实现具有高光效果的表面渲染，matcap纹理用于模拟材质的表面特性。
                const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
                // textMaterial.wireframe = true;
                const text = new THREE.Mesh(textGeometry, material);
                scene.add(text);

                const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
                for (let i = 0; i < 100; i++) {
                    const donut = new THREE.Mesh(donutGeometry, material);
                    donut.position.x = (Math.random() - 0.5) * 10;
                    donut.position.y = (Math.random() - 0.5) * 10;
                    donut.position.z = (Math.random() - 0.5) * 10;

                    donut.rotation.x = Math.random() * Math.PI;
                    donut.rotation.y = Math.random() * Math.PI;
                    const scale = Math.random();
                    donut.scale.set(scale, scale, scale);

                    scene.add(donut);
                }
            }
        )

        // Sizes
        const size = {
            width: window.innerWidth,
            height: window.innerHeight
        }

        window.addEventListener('resize', () => {
            // Update size
            size.width = window.innerWidth;
            size.height = window.innerHeight;

            // Update Camera
            camera.aspect = size.width / size.height;
            camera.updateProjectionMatrix();

            // Update renderer
            renderer.setSize(size.width, size.height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        })

        /* 
        Camera 
        */
        const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 100);
        camera.position.set(1, 2, 3);
        scene.add(camera);

        /* 
        Controls 
        */
        const controls = new OrbitControls(camera, canvas);
        controls.enableDamping = true;

        /* 
        render 
        */
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas
        });
        renderer.setSize(size.width, size.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        /*  Animations */

        const tick = () => {

            // Update Controls
            controls.update();

            // Render
            renderer.render(scene, camera);
            // Call tick again on the next frame
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