import {ICircle} from "./circle.interface";

export class IProject {
  id!: string;
  name!: string;
  size!: number;
  circles!: ICircle[];
  userEmail!: string;
}
