import { World } from "miniplex";
import createReactAPI from "miniplex-react";

/* Our entity type */
export type Entity = {
  position: { x: number; y: number; z: number };
  health: number;
  three: {};
};

/* Create a Miniplex world that holds our entities */
const world = new World<Entity>();

/* Create and export React bindings */
export const ECS = createReactAPI(world);

export enum PlayerMovement {
  WALK_LEFT = "walk_left",
  WALK_RIGHT = "walk_right",
  IDLE = "idle",
}
