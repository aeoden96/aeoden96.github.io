import { IonIcon } from '@ionic/react';
import classNames from 'classnames';
import React from 'react';
import { Variants, motion } from "framer-motion";
import { Link } from 'react-router-dom';
import { map } from 'lodash';


type Props = {
    icon: string,
    label: string,
    index: number,
    routes: any,
};

function NavigationItem(props: Props) {

    const variants: Variants = {
        open: { opacity: 1, height: "110px" },
        closed: { opacity: 0, height: 0 },
    };

    const textVariants: Variants = {
        open: {
            opacity: 1,
            x: 0,
            display: "block",
            transition: { 
                delay: 0.3,
            }
        },
        closed: {
            opacity: 0,
            x: 20,
            display: "none",
        },
    };

    const itemVariants: Variants = {
        open: { opacity: 1, x: 0 },
        closed: { opacity: 0, x: 20 },
    };


    const [expanded, setExpanded] = React.useState(false);

    const [selected, setSelected] = React.useState(-1);

    const handleSelect = (e: any, index: number) => {
        e.stopPropagation();
        setSelected(index);
    };



    return (
        <>
            <div
                className={classNames("navigation-sub-item unselectable",
                    { "navigation-sub-item-expanded": expanded }
                )}
                onClick={() => setExpanded(!expanded)}
            >
                <div
                    className="navigation-item-icon-wrapper"
                >
                    {expanded && <div className="navigation-item-text">{props.label}</div>}
                    <IonIcon icon={props.icon} className="navigation-item-icon" />
                </div>

                <div className="navigation-item-content-wrapper">

                    <motion.nav
                        animate={expanded ? "closed" : "open"}
                        variants={textVariants}
                        className="navigation-item-text"
                    >
                        {props.label}
                    </motion.nav>
                    <motion.nav
                        animate={expanded ? "open" : "closed"}
                        variants={variants}
                    >

                        <div className="navigation-subitem-wrapper">
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
                                <div className={classNames("navigation-subitem", { selected: selected === index })} onClick={(e) => handleSelect(e, index)}>
                                    {route.name}
                                </div>
                            </motion.nav>
                            </Link>
                            ))}
                        </div>
                    </motion.nav>
                </div>
            </div>

        </>
    );
}

export default NavigationItem;