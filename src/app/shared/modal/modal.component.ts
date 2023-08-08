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
  projects: Project[] = [];
  addProject: FormGroup;
  @Input() modalRef: any;

  constructor(
    private projectService: ProjectService,
    public fb: FormBuilder,
    private router: Router,
    private toastrService: ToastrService
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
}
