
import * as THREE from 'three';



export default function TestComponent() {


  return (
    <div ref={(ref) => {
      if (!ref) return;
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
      
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize( 400,400 );
      ref.appendChild( renderer.domElement );
      
      const geometry = new THREE.BoxGeometry( 1, 1, 1 );
      const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
      const cube = new THREE.Mesh( geometry, material );
      scene.add( cube );
      camera.position.z = 5;
      renderer.render( scene, camera );
      

    }} className="w-[500px] h-[500px]" />
  );
}