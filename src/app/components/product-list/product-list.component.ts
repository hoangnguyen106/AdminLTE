import { Component, OnInit, TemplateRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ProjectService } from 'src/app/services/project.service';
import { Project } from 'src/app/shared/models/project.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  projects: Project[] = [];
  editMode = false;

  //Pagination
  page: number = 1;
  count: number = 0;
  tableSize: number = 5;
  tableSizes: any = [3, 6, 9, 12];

  //Popup
  modalRef?: BsModalRef;

  constructor(
    private projectService: ProjectService,
    private toastrService: ToastrService,
    private modalService: BsModalService
  ) {}
  ngOnInit(): void {
    this.loadProject();
  }

  loadProject() {
    this.projectService.getAllProject().subscribe((res) => {
      this.projects = res;
      console.log(res);
      res.map((a) => {
        console.log('teamMember===>', a.teamMember);
      });
    });
  }

  onTableDataChange(event: any) {
    this.page = event;
    this.loadProject();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.loadProject();
  }

  onDeleteProject(id: any) {
    if (confirm('Are you sure to delete project?'))
      this.projectService.deleteProject(id).subscribe((res) => {
        this.toastrService.success(`Delete Project ${id} Successful`);
        this.loadProject();
        console.log(res);
      });
  }

  //Open modal Add and Edit
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
}
