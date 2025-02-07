import React from "react";
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js"
import * as CANNON from "cannon-es";
import sound from "./sounds/hit.mp3";
import texturenx from "./textures/nx.png";
import textureny from "./textures/ny.png";
import texturenz from "./textures/nz.png";
import texturepx from "./textures/px.png";
import texturepy from "./textures/py.png";
import texturepz from "./textures/pz.png";

export default class Physics extends React.Component {
    componentDidMount() {
        this.initThree();
    }

    initThree = () => {
        /* 
        Debug
        */
        const gui = new GUI();
        const debugObject = {}
        debugObject.createSphere = () => {
            createSphere(
                0.5 * Math.random(),
                {
                    x: (Math.random() - 0.5) * 3,
                    y: 3,
                    z: (Math.random() - 0.5) * 3
                }
            )
        }
        debugObject.createBox = () => {
            createBox(
                Math.random(),
                Math.random(),
                Math.random(),
                {
                    x: (Math.random() - 0.5) * 3,
                    y: 3,
                    z: (Math.random() - 0.5) * 3
                }
            )
        }
        gui.reset = () => {
            for (const object of objectsToUpdate) {
                // remove body
                object.body.removeEventListener("collide", playHitSound);
                world.removeBody(object.body)

                // remove mesh
                scene.remove(object.mesh)
            }
            objectsToUpdate.splice(0, objectsToUpdate.length);
        }
        gui.add(debugObject, "createSphere")
        gui.add(debugObject, "createBox")
        gui.add(debugObject, "reset")

        /* 
        Base
        */
        // canvas
        const canvas = document.querySelector("canvas.webgl")
        // scene
        const scene = new THREE.Scene();
        /* 
        Sounds
        */
        const hitSound = new Audio(sound);
        const playHitSound = (collision) => {
            const impactStrength = collision.contact.getImpactVelocityAlongNormal();
            if (impactStrength > 1.5) {
                hitSound.volume = Math.random();
                hitSound.currentTime = 0
                hitSound.play();
            }
        }

        /* 
        Textures
        */
        const cubeTextureLoader = new THREE.CubeTextureLoader();
        const environmentMapTexture = cubeTextureLoader.load([
            texturepx,
            texturenx,
            texturepy,
            textureny,
            texturepz,
            texturenz
        ])

        /* 
        Physics
        */
        // World
        const world = new CANNON.World();
        world.gravity.set(0, -9.82, 0);
        world.broadphase = new CANNON.SAPBroadphase(world);
        world.allowSleep = true;

        // Materials
        const defaultMaterial = new CANNON.Material("default")
        const defaultContactMaterial = new CANNON.ContactMaterial(
            defaultMaterial,
            defaultMaterial,
            {
                friction: 0.1,
                restitution: 0.7
            }
        )
        world.addContactMaterial(defaultContactMaterial);
        world.defaultContactMaterial = defaultContactMaterial;

        // // Sphere
        // const sphereShape = new CANNON.Sphere(0.5);
        // const sphereBody = new CANNON.Body({
        //     mass: 1,
        //     position: new CANNON.Vec3(0, 3, 0),
        //     shape: sphereShape
        // })
        // world.addBody(sphereBody);

        // Floor
        const floorShape = new CANNON.Plane();
        const floorBody = new CANNON.Body();
        floorBody.mass = 0;
        floorBody.addShape(floorShape);
        floorBody.quaternion.setFromAxisAngle(
            new CANNON.Vec3(-1, 0, 0),
            Math.PI * 0.5
        )
        world.addBody(floorBody);

        // /* 
        // Test sphere
        // */
        // const sphere = new THREE.Mesh(
        //     new THREE.SphereGeometry(0.5, 32, 32),
        //     new THREE.MeshStandardMaterial({
        //         metalness: 0.3,
        //         roughness: 0.4,
        //         envMap: environmentMapTexture
        //     })
        // )
        // sphere.castShadow = true;
        // sphere.position.y = 0.5;
        // scene.add(sphere)

        /* 
        Floor
        */
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(10, 10),
            new THREE.MeshStandardMaterial({
                color: "#777777",
                metalness: 0.3,
                roughness: 0.4,
                envMap: environmentMapTexture
            })
        )
        floor.receiveShadow = true;
        floor.rotation.x = - Math.PI * 0.5;
        scene.add(floor);

        /* 
        Lights
        */
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
        scene.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.set(1024, 1024);
        directionalLight.shadow.camera.far = 15;
        directionalLight.shadow.camera.left = -7;
        directionalLight.shadow.camera.top = 7;
        directionalLight.shadow.camera.right = 7;
        directionalLight.shadow.camera.bottom = -7;
        /* 
        Sizes
        */
        const sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        }

        window.addEventListener('resize', () => {
            sizes.width = window.innerWidth;
            sizes.height = window.innerHeight;

            camera.aspect = sizes.width / sizes.height;
            camera.updateProjectionMatrix();

            renderer.render(scene, camera)
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        })

        /* 
        Camera
        */
        // Base camera
        const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100);
        camera.position.set(-3, 3, 3);

        // Controls
        const controls = new OrbitControls(camera, canvas);
        controls.enableDamping = true;

        /* 
        Renderer
        */
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas
        })
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFShadowMap;
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

        /* 
        Utils
        */
        const objectsToUpdate = [];

        // Sphere
        const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
        const sphereMaterial = new THREE.MeshStandardMaterial({
            metalness: 0.3,
            roughness: 0.4,
            envMap: environmentMapTexture
        })

        const createSphere = (radius, position) => {
            // Three.js mesh
            const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
            mesh.castShadow = true;
            mesh.scale.set(radius, radius, radius);
            mesh.position.copy(position);
            scene.add(mesh);

            // Cannon.js body
            const shape = new CANNON.Sphere(radius);
            const body = new CANNON.Body({
                mass: 1,
                shape,
                material: environmentMapTexture
            })
            body.position.copy(position);
            body.addEventListener("collide", playHitSound);
            world.addBody(body);

            // Save in objects to update
            objectsToUpdate.push({
                mesh,
                body
            })
        }
        createSphere(0.5, { x: 0, y: 3, z: 0 })

        // box
        const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
        const boxMaterial = new THREE.MeshStandardMaterial({
            metalness: 0.3,
            roughness: 0.4,
            envMap: environmentMapTexture
        })

        const createBox = (width, height, depth, position) => {
            // Three.js mesh
            const mesh = new THREE.Mesh(boxGeometry, boxMaterial)
            mesh.castShadow = true;
            mesh.scale.set(width, height, depth);
            mesh.position.copy(position);
            scene.add(mesh);

            // Cannon.js body
            const shape = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5));
            const body = new CANNON.Body({
                mass: 1,
                shape,
                material: environmentMapTexture
            })
            body.position.copy(position);
            body.addEventListener("collide", playHitSound);
            world.addBody(body);

            // Save in objects to update
            objectsToUpdate.push({
                mesh,
                body
            })
        }

        /* 
        Animation
        */
        const clock = new THREE.Clock();
        let oldElasedTime = 0;

        const tick = () => {

            const elapsedTime = clock.getElapsedTime();
            const deltaTime = elapsedTime - oldElasedTime;
            oldElasedTime = elapsedTime;

            // Update physics world
            // 1. a fixed time step
            // 2. how much time passed since the last step
            // 3. how much iterations the world can apply to catch up with a potential delay
            world.step(1 / 60, deltaTime, 3);
            // sphere.position.copy(sphereBody.position);

            for (const object of objectsToUpdate) {
                object.mesh.position.copy(object.body.position);
                object.mesh.quaternion.copy(object.body.quaternion); // update the rotation
            }

            // update controls
            controls.update();

            // renderer
            renderer.render(scene, camera);

            // call tick again on the next frame
            window.requestAnimationFrame(tick)
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