import { IonIcon } from '@ionic/react';
import React from 'react';
import NavigationSubItem from "./NavigationSubItem";
import classNames from 'classnames';
import { motion } from "framer-motion";
import { map } from 'lodash';
import { Link } from 'react-router-dom';



type Props = {
    icon: string,
    label: string,
    routes: any,
};

function NavigationItem(props: Props) {

    const variants = {
        closed: {
            opacity: 0,
            height: 0,
            transitionEnd: {
                display: "none",
            },
        },
        open: {
            opacity: 1,
            height: "auto",
            transitionStart: {
                display: "block",
            },

        },
    };

    const itemVariants = {
        open: { opacity: 1, x: 0 },
        closed: { opacity: 0, x: 20 },
    };


    const [expanded, setExpanded] = React.useState(false);

    return (
        <>
            <div
                className={classNames("navigation-item unselectable",
                    { "navigation-item-expanded": expanded }
                )}
                onClick={() => setExpanded(!expanded)}
            >
                <IonIcon icon={props.icon} className="navigation-item-icon" />
                <div className="navigation-item-text">{props.label}</div>
            </div>
            <motion.nav
                animate={expanded ? "open" : "closed"}
                variants={variants}
            >
                <div className="navigation-sub-item-wrapper">
                    {map(props.routes, (route: any, index: number) => (
                        <Link
                            to={route.path}
                            className="navigation-item-link"
                            key={index}
                        >
                            <motion.nav
                                animate={expanded ? "open" : "closed"}
                                variants={itemVariants}
                                transition={{ delay: index * 0.2 }}
                            >
                                <NavigationSubItem icon={props.icon} label={route.name} index={0} routes={route.subRoutes} />
                            </motion.nav>
                        </Link>
                    ))}
                </div>
            </motion.nav>

        </>
    );
}

export default NavigationItem;