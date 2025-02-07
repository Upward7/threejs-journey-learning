import React from "react";
import "./index.css"
import * as THREE from "three"
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import gsap from "gsap";
import texture from "./textures/3.jpg";

export default class scrollBasedAnimation extends React.Component {
    componentDidMount() {
        this.initThree();
    }

    initThree = () => {
        /* 
        Debug
        */
        const gui = new GUI();

        const parameters = {
            materialColor: "#ffeded"
        }

        gui
            .addColor(parameters, "materialColor")
            .onChange(() => {
                material.color.set(parameters.materialColor);
                particleMaterial.color.set(parameters.materialColor);
            })

        /* 
        Base
        */
        // Canvas
        const canvas = document.querySelector("canvas.webgl")
        // Scene
        const scene = new THREE.Scene();
        /* 
        Objects
        */
        // Texture
        const textureLoader = new THREE.TextureLoader();
        const gradientTexture = textureLoader.load(texture);
        gradientTexture.magFilter = THREE.NearestFilter;

        // Material
        const material = new THREE.MeshToonMaterial({
            color: parameters.materialColor,
            gradientMap: gradientTexture
        });
        // Meshes
        const objectDistance = 4;

        const mesh1 = new THREE.Mesh(
            new THREE.TorusGeometry(1, 0.4, 16, 60),
            material
        )
        const mesh2 = new THREE.Mesh(
            new THREE.ConeGeometry(1, 2, 32),
            material
        )
        const mesh3 = new THREE.Mesh(
            new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
            material
        )

        mesh1.position.y = - objectDistance * 0;
        mesh2.position.y = - objectDistance * 1;
        mesh3.position.y = - objectDistance * 2;

        mesh1.position.x = 2;
        mesh2.position.x = - 2;
        mesh3.position.x = 2;

        scene.add(mesh1, mesh2, mesh3);

        const sectionMeshes = [mesh1, mesh2, mesh3];

        /* 
        Particles
        */
        // geometry
        const particlesCount = 200;
        const positions = new Float32Array(particlesCount * 3);
        for (let i = 0; i < particlesCount; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 10
            positions[i3 + 1] = objectDistance * 0.5 - Math.random() * objectDistance * sectionMeshes.length;
            positions[i3 + 2] = (Math.random() - 0.5) * 10
        }
        const particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        // Material
        const particleMaterial = new THREE.PointsMaterial({
            color: parameters.materialColor,
            sizeAttenuation: true,
            size: 0.03
        });
        // Points
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particles);

        /* 
        Lights
        */
        const directionalLight = new THREE.DirectionalLight("#ffffff", 1);
        directionalLight.position.set(1, 1, 0);
        scene.add(directionalLight);

        /* 
        Sizes
        */
        const sizes = {
            width: window.innerWidth,
            height: window.innerHeight,
        };

        window.addEventListener("resize", () => {
            // Update sizes
            sizes.width = window.innerWidth;
            sizes.height = window.innerHeight;

            // Update camera
            camera.aspect = sizes.width / sizes.height;
            camera.updateProjectionMatrix();

            // Update renderer
            renderer.setSize(sizes.width, sizes.height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        });

        /* 
        Camera
        */
        // Group
        const cameraGroup = new THREE.Group();
        scene.add(cameraGroup)

        // Base camera
        const camera = new THREE.PerspectiveCamera(
            35,
            sizes.width / sizes.height,
            0.1,
            100
        );
        camera.position.z = 8;
        cameraGroup.add(camera);

        /* 
        Renderer
        */
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
        });
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        /* 
        Scroll
        */
        let scrollY = window.scrollY;
        let currentSection = 0;

        window.addEventListener("scroll", () => {
            scrollY = window.scrollY;

            const newSection = Math.round(scrollY / sizes.height);

            if (newSection != currentSection) {
                currentSection = newSection;

                gsap.to(
                    sectionMeshes[currentSection].rotation,
                    {
                        duration: 1.5,
                        ease: "power2.inOut",
                        x: "+=6",
                        y: "+=3",
                        z: "+=1.5"
                    }
                )
            }
        })

        /* 
        Cursor
        */
        const cursor = {};
        cursor.x = 0;
        cursor.y = 0;

        window.addEventListener("mousemove", (event) => {
            cursor.x = event.clientX / sizes.width - 0.5;
            cursor.y = event.clientY / sizes.height - 0.5;

        })

        /* 
        Animation
        */
        const clock = new THREE.Clock();
        let previousTime = 0;

        const tick = () => {
            const elapsedTime = clock.getElapsedTime();
            const deltaTime = elapsedTime - previousTime;
            previousTime = elapsedTime;

            // Animate camera
            camera.position.y = - scrollY / sizes.height * objectDistance; // 下降一个单位 * 物体之间的距离

            // 视差用相机组
            const parallaxX = cursor.x * 0.5;
            const parallaxY = - cursor.y * 0.5;
            // smooth
            cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime;
            cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime;

            // Animate meshes
            for (const mesh of sectionMeshes) {
                mesh.rotation.x += deltaTime * 0.1;
                mesh.rotation.y += deltaTime * 0.12;
            }

            // Render
            renderer.render(scene, camera);

            // Call tick again on the next frame
            window.requestAnimationFrame(tick)
        }
        tick()
    }

    render() {
        return (
            <>
                <canvas className="webgl"></canvas>

                <section className="section">
                    <h1>My Portfolio</h1>
                </section>
                <section className="section">
                    <h1>My projects</h1>
                </section>
                <section className="section">
                    <h1>Contact me</h1>
                </section>
            </>
        )
    }
}