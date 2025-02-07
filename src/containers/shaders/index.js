import React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import testVertexShader from "./vertex.glsl?raw";
import testFragmentShader from "./fragment.glsl?raw";
import flag from "./textures/indian-flag.png";

export default class Shaders extends React.Component {
    componentDidMount() {
        this.initThree();
    }

    initThree = () => {
        // Debug
        const gui = new GUI();
        // Canvas
        const canvas = document.querySelector("canvas.webgl")
        // scene
        const scene = new THREE.Scene();

        /* 
        Textures
        */
        const textureLoader = new THREE.TextureLoader();
        const flagTexture = textureLoader.load(flag);

        /* 
        Test mesh
        */
        // geometry
        const geometry = new THREE.PlaneGeometry(1, 1, 32, 32)

        const count = geometry.attributes.position.count;
        const randoms = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            randoms[i] = Math.random()
        }
        // setting a custom attribute to the geometry which will be used in the vertex shader
        geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1))

        // material
        const material = new THREE.RawShaderMaterial({
            vertexShader: `
            uniform mat4 projectionMatrix;
            uniform mat4 viewMatrix;
            uniform mat4 modelMatrix;
            uniform vec2 uFrequency;
            uniform float uTime;

            attribute vec3 position;
            attribute float aRandom;
            attribute vec2 uv;

            varying float vRandom;
            varying vec2 vUv;
            varying float vElevation;

            void main()
            {
                vec4 modelPosition = modelMatrix * vec4(position, 1.0);
                float elevation = sin(modelPosition.x * uFrequency.x + uTime) * 0.1;
                elevation += sin(modelPosition.y * uFrequency.y + uTime) * 0.1;
                modelPosition.z += elevation;
                // modelPosition.z += aRandom * 0.1;

                vec4 viewPosition = viewMatrix * modelPosition;
                vec4 projectedPosition = projectionMatrix * viewPosition;
                gl_Position = projectedPosition;

                vRandom = aRandom;
                vUv = uv;
                vElevation = elevation;
            }
            `,
            fragmentShader: `
            precision mediump float;

            uniform vec3 uColor;
            uniform sampler2D uTexture;

            varying float vRandom;
            varying vec2 vUv;
            varying float vElevation;

            void main()
            {
                vec4 textureColor = texture2D(uTexture, vUv);
                textureColor.rgb *= vElevation * 2.0 + 0.8;
                // gl_FragColor = vec4(uColor, 1.0);
                gl_FragColor = textureColor;
            }
            `,
            side: THREE.DoubleSide,
            transparent: true,
            uniforms:
            {
                uFrequency: { value: new THREE.Vector2(10, 5) },
                uTime: { value: 0 },
                uColor: { value: new THREE.Color("orange") },
                uTexture: { value: flagTexture }
            }
        })

        gui.add(material.uniforms.uFrequency.value, "x").min(0).max(20).step(0.01).name("frequencyX")
        gui.add(material.uniforms.uFrequency.value, "y").min(0).max(20).step(0.01).name("frequencyY")

        // mesh
        const mesh = new THREE.Mesh(geometry, material)
        scene.add(mesh)

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

            // update material
            material.uniforms.uTime.value = elapsedTime;

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