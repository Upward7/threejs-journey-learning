"use strict";(self.webpackChunkreact_3d=self.webpackChunkreact_3d||[]).push([[947],{5042:(e,n,t)=>{t.r(n),t.d(n,{default:()=>p});var i=t(5043),a=t(9435),s=t(9408),o=t(7583),d=t(4322),r=t(4718),c=t(6064),w=t(4081);const h=t.p+"static/media/1k.fcc3cd66084c260655b5.hdr";var l=t(579);class p extends i.Component{constructor(){super(...arguments),this.initThree=()=>{const e=new r.B,n=(new a.ScU,new c.Y),t=(new w.H,new a.Tap,new d.Ay),i={},l=document.querySelector("canvas.webgl"),p=new a.Z58,u=()=>{p.traverse((e=>{e.isMesh&&e.material.isMeshStandardMaterial&&(e.material.envMapIntensity=i.envMapIntensity)}))};p.backgroundBlurriness=0,p.backgroundIntensity=1,t.add(p,"backgroundBlurriness").min(0).max(1).step(.001),t.add(p,"backgroundIntensity").min(0).max(10).step(.001),i.envMapIntensity=1,t.add(i,"envMapIntensity",0,10,.001).onChange(u),n.load(h,(e=>{e.mapping=a.wfO,p.background=e}));const g=new a.eaF(new a.O3Y(8,.5),new a.V9B({color:"white"}));g.position.y=3.5,g.layers.enable(1),p.add(g);const m=new a.o6l(256,{type:a.ix0});p.environment=m.texture;const v=new a.F1T(.1,100,m);v.layers.set(1);const b=new a.eaF(new a.UPV(1,.4,100,16),new a._4j({roughness:0,metalness:1,color:11184810}));b.position.x=-4,b.position.y=4,p.add(b),e.load("./models/FlightHelmet/glTF/FlightHelmet.gltf",(e=>{e.scene.scale.set(10,10,10),p.add(e.scene),u()}));const x={width:window.innerWidth,height:window.innerHeight};window.addEventListener("resize",(()=>{x.width=window.innerWidth,x.height=window.innerHeight,y.aspect=x.width/x.height,y.updateProjectionMatrix(),k.setSize(x.width,x.height),k.setPixelRatio(Math.min(window.devicePixelRatio,2))}));const y=new a.ubm(75,x.width/x.height,.1,100);y.position.set(4,1,-4),p.add(y);const M=new o.N(y,l);M.enableDamping=!0;const k=new s.JeP({canvas:l,antialias:!0});k.setSize(x.width,x.height),k.setPixelRatio(Math.min(window.devicePixelRatio,2));const F=new a.zD7,P=()=>{const e=F.getElapsedTime();g&&(g.rotation.x=2*Math.sin(e),v.update(k,p)),M.update(),k.render(p,y),window.requestAnimationFrame(P)};P()}}componentDidMount(){this.initThree()}render(){return(0,l.jsx)("canvas",{className:"webgl"})}}}}]);
//# sourceMappingURL=947.23a18a5f.chunk.js.map