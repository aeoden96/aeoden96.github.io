import React, {useEffect} from 'react';
import { Link,Route,Routes } from 'react-router-dom';
import './App.scss';
import Navigation from './components/navigation/index';
import Projects from './components/project';

function App() {

  const routes = [
    {
      name: "Projects",
      path: "/projects",
      subRoutes: [
        {
          name: "Math",
          path: "/projects/math",
          subRoutes: [
            {
              name: "Project 1",
              path: "/projects/math/project-1",
            },
            {
              name: "Project 2",
              path: "/projects/math/project-2",
            },
          ],
        },
        {
          name: "ML",
          path: "/projects/machine-learning",
          subRoutes: [
            {
              name: "Project 3",
              path: "/projects/machine-learning/project-3",
            },
            {
              name: "Project 4",
              path: "/projects/machine-learning/project-4",
            },
          ],
        },
      ],

      
    },
    {
      name: "Experiments",
      path: "/experiments",
      subRoutes: [
        {
          name: "Sub Item 1",
          path: "/projects/sub-item-1",
        },
        {
          name: "Sub Item 2",
          path: "/projects/sub-item-2",
        },
      ],
    },
  ];


  return (
    <div className="application-wrapper">
      <Navigation routes={routes} />
      <div className="application-content">
        <Routes>
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:category" element={<Projects />} />
          <Route path="/projects/:category/:project" element={<Projects />} />
          <Route path="/experiments" element={<div>Experiments</div>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
