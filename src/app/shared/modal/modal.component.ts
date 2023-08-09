import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ProjectService } from 'src/app/services/project.service';
import { Project } from '../models/project.model';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  @ViewChild('template') template: TemplateRef<any>;
  projects: Project[] = [];
  addProject: FormGroup;

  modalRef?: BsModalRef;

  constructor(
    private projectService: ProjectService,
    public fb: FormBuilder,
    private router: Router,
    private toastrService: ToastrService,
    private modalService: BsModalService
  ) {
    this.addProject = this.fb.group({
      projectName: ['', Validators.required],
      description: ['', Validators.required],
      teamMember: this.fb.array([]),
      progress: ['', [Validators.min(1), Validators.max(100)]],
      status: ['', Validators.required],
      created: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.loadProject();
  }

  createItem(data): FormGroup {
    return this.fb.group(data);
  }

  get photos(): FormArray {
    return this.addProject.get('teamMember') as FormArray;
  }

  onFileChange(event) {
    let files = event.target.files;
    if (files) {
      for (let file of files) {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.photos.push(
            this.createItem({
              url: e.target.result, //Base64 string for preview image
            })
          );
        };
        reader.readAsDataURL(file);
      }
    }
  }

  loadProject() {
    this.projectService.getAllProject().subscribe((res) => {
      this.projects = res;
    });
  }

  onAddProject() {
    this.projectService.addProject(this.addProject.value).subscribe((res) => {
      console.log(res);
      this.toastrService.success(`Add ${res.projectName} Successfully!!!`);
      this.modalRef.hide();
      this.addProject.reset();
      this.loadProject();

      // this.addProject.reset();
      // this.router.navigate(['admin/product-list']);
    });
  }

  onEditProject() {
    
  }

  // onUpdateProject() {
  //   if (this.addProject.value.id != null) {
  //     if (this.addProject.valid) {
  //       const index: number = this.projects.findIndex(
  //         (project: Project) => project.id === this.addProject.value.id
  //       );
  //       if (index !== -1) {
  //         this.addProject[index] = {
  //           id: this.addProject.value.id,
  //           projectName: this.addProject.value.projectName,
  //           description: this.addProject.value.description,
  //           teamMember: this.addProject.value.teamMember,
  //           progress: this.addProject.value.progress,
  //           status: this.addProject.value.status,
  //           created: this.addProject.value.created,
  //         } as Project;
  //       }
  //       this.modalRef.hide();
  //     }
  //   } else {
  //     if (this.addProject.valid) {
  //       const project: Project = {
  //         id: this.projects.length,
  //         projectName: this.addProject.value.projectName,
  //         description: this.addProject.value.description,
  //         teamMember: this.addProject.value.teamMember,
  //         progress: this.addProject.value.progress,
  //         status: this.addProject.value.status,
  //         created: this.addProject.value.created,
  //       } as Project;

  //       this.projects.push(project);

  //       this.modalRef.hide();
  //     }
  //   }
  // }

  //Open modal Add and Edit
  openModal() {
    this.modalRef = this.modalService.show(this.template);
  }
}
