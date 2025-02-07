import React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default class raycasterAndMouseEvent extends React.Component {
    componentDidMount() {
        this.initThree();
    }

    initThree = () => {
        // Canvas
        const canvas = document.querySelector("canvas.webgl");
        // Scene
        const scene = new THREE.Scene();

        /**
         * Objects
         */
        const object1 = new THREE.Mesh(
            new THREE.SphereGeometry(0.5, 16, 16),
            new THREE.MeshBasicMaterial({ color: "#ff0000" })
        );
        object1.position.x = -2;

        const object2 = new THREE.Mesh(
            new THREE.SphereGeometry(0.5, 16, 16),
            new THREE.MeshBasicMaterial({ color: "#ff0000" })
        );

        const object3 = new THREE.Mesh(
            new THREE.SphereGeometry(0.5, 16, 16),
            new THREE.MeshBasicMaterial({ color: "#ff0000" })
        );
        object3.position.x = 2;

        scene.add(object1, object2, object3);

        /* 
        Raycaster
        */
        const raycaster = new THREE.Raycaster();

        /**
         * Sizes
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
        Cursor
        */
        const mouse = new THREE.Vector2()

        window.addEventListener("mousemove", (event) => {
            /**
             * mouse.x & mouse.y = -1 ~ 1
             */
            mouse.x = event.clientX / sizes.width * 2 - 1
            mouse.y = - (event.clientY / sizes.height * 2 - 1)
            /**
             * we will cast ray in the tick function instead of mousemove event handler function,
             * because mousemove event is fired more frequently than tick function
             */
        })

        window.addEventListener("click", (event) => {
            if (currentIntersect) {
                switch (currentIntersect.object) {
                    case object1:
                        console.log("clicked object1");
                        break;
                    case object2:
                        console.log("clicked object2");
                        break;
                    case object3:
                        console.log("clicked object3");
                        break;
                }
            }
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
        camera.position.z = 3;
        scene.add(camera);

        // Controls
        const controls = new OrbitControls(camera, canvas);
        controls.enableDamping = true;

        /**
         * Renderer
         */
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
        });
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        /* 
        Model
        */
        const gltfLoader = new GLTFLoader()
        let model = null;
        gltfLoader.load(
            "./models/Duck/glTF-Binary/Duck.glb",
            (gltf) => {
                model = gltf.scene
                model.position.y = -1.2
                scene.add(model)
            }
        )
        /* 
        Lights
        */
        const ambientLight = new THREE.AmbientLight("#ffffff", 0.3)
        scene.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight("#ffffff", 0.7)
        directionalLight.position.set(1, 2, 3)
        scene.add(directionalLight)
        /**
         * Animate
         */
        const clock = new THREE.Clock();

        let currentIntersect = null;

        const tick = () => {
            const elapsedTime = clock.getElapsedTime()

            // animate objects
            object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5
            object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5
            object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5

            // cast a ray
            // const rayOrigin = new THREE.Vector3(-3, 0, 0);
            // const rayDirection = new THREE.Vector3(1, 0, 0)
            // rayDirection.normalize()
            // raycaster.set(rayOrigin, rayDirection);
            raycaster.setFromCamera(mouse, camera)

            const objectsToTest = [object1, object2, object3]
            const intersects = raycaster.intersectObjects(objectsToTest)

            for (const object of objectsToTest) {
                object.material.color.set("#ff0000")
            }

            for (const intersect of intersects) {
                intersect.object.material.color.set("#0000ff")
            }

            if (intersects.length) {
                if (currentIntersect == null) {
                    console.log("mouse enter");
                }
                currentIntersect = intersects[0];
            }
            else {
                if (currentIntersect) {
                    console.log("mouse leave");

                }
                currentIntersect = null;
            }

            // Test intersect with model
            if (model) {
                const modelIntersects = raycaster.intersectObject(model);
                if (modelIntersects.length) {
                    model.scale.set(1.2, 1.2, 1.2);
                }
                else {
                    model.scale.set(1, 1, 1)
                }
            }

            // update controls
            controls.update()

            // Renderer
            renderer.render(scene, camera)

            // Call tick again on the next frame
            window.requestAnimationFrame(tick)
        }
        tick()
    }

    render() {
        return (
            <canvas className="webgl"></canvas>
        )
    }
}