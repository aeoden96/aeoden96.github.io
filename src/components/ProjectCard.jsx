import React,{ forwardRef }  from 'react';
import { Canvas } from '@react-three/fiber';
import SmallBlob from './three_components/SmallBlob';


type Props = {
  title: string,
  description: string,
};


const ProjectCard = forwardRef((props: Props, ref) => {

return (
  <div ref = {ref}
  className="project-card">
    <h3>{props.title}</h3>
    <p>{props.description}</p>
  </div>
);
});

export default ProjectCard;