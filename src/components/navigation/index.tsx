import React from "react";
import { home, search } from "ionicons/icons";
import "./style.scss";
import NavigationItem from "./NavigationItem";
import { map } from "lodash";
import { Link } from "react-router-dom";

type Props = {
  routes: any
};

function Navigation(props: Props) {
  return (
    <div className="navigation-wrapper">
      <div className="navigation-items">
        {map(props.routes, (route: any, index: number) => (
          <Link
            to={route.path}
            className="navigation-item-link"
            key={index}
          >
            <NavigationItem icon={home} label={route.name} routes={route.subRoutes} />
          </Link>
        ))}
      </div>


    </div>
  );
}

export default Navigation;
