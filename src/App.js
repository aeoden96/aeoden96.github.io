import React, {useEffect} from 'react';
import { Link,Route,Routes } from 'react-router-dom';
import './App.scss';
import Projects from './projects/Projects';
import ProjectCard from './components/ProjectCard';
import { Canvas } from '@react-three/fiber';
import SmallBlob from './components/three_components/SmallBlob';


function App() {
  const direction = React.useRef(1);
  const [clicked,setClicked] = React.useState(false);

  const [pos, setPos] = React.useState([0, 0]);
  const [pos2, setPos2] = React.useState([0, 0]);

  const refValue1 = React.useRef(0);
  const refValue2 = React.useRef(0);


  useEffect(() => {
    if (refValue1.current) {
      console.log(refValue1.current);

      // get absolute position of the element
      let rect = refValue1.current.getBoundingClientRect();

      console.log(rect.top, rect.right, rect.bottom, rect.left);


      // scale it to the size of the canvas
      let x = (rect.left / window.innerWidth) * 2 - 1;
      let y = -(rect.top / window.innerHeight) * 2 + 1;

      console.log(x,y);

      setPos([x,y]);
    }
  }, [refValue1]);


  useEffect(() => {
    if (refValue2.current) {
      console.log(refValue2.current);

      // get absolute position of the element
      let rect = refValue2.current.getBoundingClientRect();

      console.log(rect.top, rect.right, rect.bottom, rect.left);


      // scale it to the size of the canvas
      let x = (rect.left / window.innerWidth) * 2 - 1;
      let y = -(rect.top / window.innerHeight) * 2 + 1;

      console.log(x,y);

      setPos2([x,y]);
    }
  }, [refValue2]);


  return (
    <div className="App">
      <Canvas
        orthographic
        camera={{ zoom: 100, position: [0, 0, 5] }}
        className="canvas"
        onClick={() => {
          console.log("Clicked");
          setClicked(!clicked);
        }}
      >
        <axesHelper args={[5]} />
        <pointLight position={[10, 10, 10]} />
        <ambientLight />
        <SmallBlob 
          clicked={clicked} 
          position={-100, 10 , 0}
          scale={0.3}
        />
        <SmallBlob 
          clicked={clicked}
          position={[pos2[0],pos2[1],3]}
          scale={0.3}
        />
      </Canvas>
      <section className="section">
        <div className="section-subtitle">Projects</div>
        <div className="section-title">My Projects</div>
        <div className="section-info">
          These are some of my projects. I have worked on a lot of projects, but I have not uploaded all of them to GitHub. I will upload them soon.
        </div>
        <div className="section-container">
          <ProjectCard
          ref={refValue1}
          title="React Portfolio"
          description="Some text"
          />
          <ProjectCard
          ref={refValue2}
          title="React Portfolio"
          description="Some text"
          />
        </div>
      </section>
    </div>
  );
}

export default App;
