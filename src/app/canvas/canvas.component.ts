import { Component, OnInit } from '@angular/core';
import { ICircle } from '../models/circle.interface';
import { ECircleCount } from '../enums/circle-count.enum';
import { LocalStorageService } from '../services/storage.service';
import { IProject } from '../models/project.interface';
import { IUser } from '../models/user.interface';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css'],
})
export class CanvasComponent implements OnInit {
  circles: ICircle[] = [];
  projectName: string = '';
  projectList: IProject[] = [];
  projectListName = 'circlesProject';
  currentUser!: IUser;
  canvasSizes: number[] = [
    ECircleCount.MIN, // 100
    ECircleCount.MID, // 225
    ECircleCount.MAX, // 400
  ];
  currentUserProjects: IProject[] = [];
  selectedProject!: IProject;
  selectedSize: number = this.canvasSizes[0];
  boxSize!: number;
  currentColor: string = '#000000';
  inputError = {
    hasValueError: false,
    hasUniqueError: false,
  };
  isEditable = false;
  constructor(private storage: LocalStorageService) {}

  ngOnInit(): void {
    this.getProjects();
  }

  onGenerateCircles(): void {
    this.resetColors();
  }

  onSizeSelect(): void {
    this.circles = [];
    this.selectedProject = {} as IProject;
  }

  onCircleClick(circle: ICircle): void {
    this.circles[circle.id].color =
      circle.color !== this.currentColor ? this.currentColor : '#fff';
  }

  onResetColor(): void {
    if (!this.isEmpty(this.circles)) {
      this.resetColors();
    }
  }

  resetColors(): void {
    this.circles = [];
    this.currentColor = '#000000';
    this.inputError.hasUniqueError = false;
    this.inputError.hasValueError = false;
    this.isEditable = false;
    this.projectName = '';
    for (let i = 0; i < this.selectedSize; i++) {
      this.circles.push({
        id: i,
        uid: this.newId(),
        color: '',
      });
    }
  }

  onFillCircles(): void {
    if (this.isEmpty(this.circles)) {
      return;
    }
    this.circles.forEach((item) => {
      item.color = this.currentColor;
    });
  }

  isEmpty(arr: ICircle[]): boolean {
    return !arr.length;
  }

  newId(): string {
    return String(Date.now());
  }

  onSave(): void {
    const currentUser = this.storage.get('currentUser');
    if (currentUser) {
      this.currentUser = JSON.parse(currentUser);
    }

    if (this.isEmpty(this.circles) || !this.projectName) {
      this.inputError.hasValueError = true;
      return;
    }

    for (let i = 0; i < this.projectList.length; i++) {
      if (
        this.projectList[i].name.toLowerCase() ===
        this.projectName.toLowerCase()
      ) {
        this.inputError.hasUniqueError = true;
        this.inputError.hasValueError = false;
        break;
      }
      this.inputError.hasUniqueError = false;
    }

    if (!this.inputError.hasUniqueError && !this.isEditable) {
      this.projectList.push({
        id: this.newId(),
        name: this.projectName,
        size: this.selectedSize,
        circles: this.circles,
        userEmail: this.currentUser.email,
      });
      this.currentUserProjects.push({
        id: this.newId(),
        name: this.projectName,
        size: this.selectedSize,
        circles: this.circles,
        userEmail: this.currentUser.email,
      });
      this.projectName = '';
      this.inputError.hasUniqueError = false;
      this.inputError.hasValueError = false;
    }
    if (this.isEditable) {
      this.resetColors();
    }

    const projectsStr = JSON.stringify(this.projectList);
    this.storage.set(this.projectListName, projectsStr);
  }

  onDelete(project: IProject) {
    if (project === this.selectedProject) {
      this.selectedProject = {} as IProject;
    }
    const filteredProjects = this.projectList.filter((item) => {
      return item.id !== project.id;
    });

    this.projectList = filteredProjects;
    const projectsStr = JSON.stringify(filteredProjects);
    this.storage.set(this.projectListName, projectsStr);
  }

  getProjects(): void {
    const projects = this.storage.get(this.projectListName);
    if (projects) {
      this.projectList = JSON.parse(projects);
    }
    const currentUser = this.storage.get('currentUser');
    if (currentUser) {
      this.currentUser = JSON.parse(currentUser);
    }
    this.currentUserProjects = this.projectList.filter((project) => {
      return this.currentUser.email === project.userEmail;
    });
  }

  selectProject(project: IProject): void {
    this.circles = project.circles;
    this.selectedSize = project.size;
    this.projectName = project.name;
    this.isEditable = true;
    this.selectedProject = project;
  }
}
