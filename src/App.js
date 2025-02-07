import { Route, HashRouter as Router, Routes } from "react-router-dom";
import { lazy, Suspense } from "react"

const Home = lazy(() => import("./containers/Home/index.js"))
const Particles = lazy(() => import("./containers/Particles/index.js"));
const Galaxy = lazy(() => import("./containers/galaxy generator/index.js"));
const ScrollBasedAnimation = lazy(() => import("./containers/scroll based animation/index.js"));
const Physics = lazy(() => import("./containers/Physics/index.js"));
const ImportedModels = lazy(() => import("./containers/imported models/index.js"));
const RaycasterAndMouseEvent = lazy(() => import("./containers/raycaster and mouse event/index.js"))
const Shaders = lazy(() => import("./containers/shaders/index.js"));
const EnvironmentMap = lazy(() => import("./containers/environment map/index.js"));
const HelloBlender = lazy(() => import("./containers/blender first/index.js"));
const ThreeText = lazy(() => import("./containers/3d text/index.js"));

export default function App() {
    return <div className="App">
        <Router>
            <Suspense fallback={<div className="loading_page">Loading...</div>}>
                <Routes>
                    <Route element={<Home />} path="/"></Route>
                    <Route element={<Particles />} path="/particles"></Route>
                    <Route element={ <Galaxy /> } path="/galaxy"></Route>
                    <Route element={ <ScrollBasedAnimation />} path="/scrollBasedAnimation"></Route>
                    <Route element= { <Physics /> } path="/physics"></Route>
                    <Route element= { <ImportedModels /> } path="/importedModels"></Route>
                    <Route element= { <RaycasterAndMouseEvent /> } path="/raycasterAndMouseEvent"></Route>
                    <Route element= { <Shaders /> } path="/shaders"></Route>
                    <Route element= { <EnvironmentMap /> } path="/environmentMap"></Route>
                    <Route element= { <HelloBlender /> } path="/helloBlender"></Route>
                    <Route element= { <ThreeText /> } path="/threeText"></Route>
                </Routes>
            </Suspense>
        </Router>
    </div>
}