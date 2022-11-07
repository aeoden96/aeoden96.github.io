import React from 'react';
import { Link,Route,Routes } from 'react-router-dom';
import './App.scss';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Projects from './projects/Projects';

function App() {
  const [refValue1,setRefValue] = React.useState(0);
  const direction = React.useRef(1);

  /*React.useEffect(() => {
    if(refValue1 === 0){
      direction.current = 1;
    }
    if(refValue1 === 100){
      direction.current = -1;
    }
    const interval = setInterval(() => {
      setRefValue(refValue1 + direction.current);
    }, 100);
    return () => clearInterval(interval);
  }, [refValue1]);*/

  return (
    <div className="App">
      <div>
        <nav>
          <div id="navigation">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/projects">Projects</Link>          
            <Link to="/contact">Contact</Link>
          </div>
        </nav>
        <svg className='svg-navbar'
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 200 100"
          width={400}
          height={200}
          preserveAspectRatio="none"
        >
          <path
            fill="none"
            stroke="lightgrey"
            d="M20,50 C20,-50 180,150 180,50 C180-50 20,150 20,50 z" />

          <circle r="5" fill="red">
            <animateMotion
              dur="10s"
              repeatCount="indefinite"
              path="M20,50 C20,-50 180,150 180,50 C180-50 20,150 20,50 z" />
          </circle>
        </svg>

      </div>
        <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      </div>
        );
}

export default App;
