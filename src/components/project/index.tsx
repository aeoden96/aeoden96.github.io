import React from "react";
import "./style.scss";
import { useParams } from "react-router-dom";


function Projects() {

    // return GET params
    const { category, project } = useParams();
    return (
        <div className="project-wrapper">
        <h1>Projects {category} {project}</h1>
        </div>
    );
};


export default Projects;