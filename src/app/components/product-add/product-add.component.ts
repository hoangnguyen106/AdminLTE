import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';
import { Project } from 'src/app/shared/models/project.model';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.scss'],
})
export class ProductAddComponent implements OnInit {
  addProject: FormGroup;

  constructor(
    private projectService: ProjectService,
    public fb: FormBuilder,
    private router: Router
  ) {
    this.addProject = this.fb.group({
      projectName: [''],
      description: [''],
      teamMember: this.fb.array([]),
      progress: [],
      status: [''],
      created: [''],
    });
  }

  ngOnInit(): void {}

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

  onAddProject() {
    this.projectService.addProject(this.addProject.value).subscribe((res) => {
      console.log(res);
      // this.addProject.reset();
      // this.router.navigate(['admin/product-list']);
    });
  }
}
