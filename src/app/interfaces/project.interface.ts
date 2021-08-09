import {ICircle} from "./circle.interface";

export interface IProject {
  id: string;
  name: string;
  size: number,
  circles: ICircle[];
}
