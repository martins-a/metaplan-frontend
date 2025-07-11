
import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {mockMeta} from '../../mocks/meta-mocks';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MyMeta} from '../../models/my-meta';
import {MatButton} from '@angular/material/button';
import {MatTooltip} from '@angular/material/tooltip';
import {RouterLink} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-pages-meta-list',
  templateUrl: './meta-list-page.component.html',
  styleUrls: ['./meta-list-page.component.scss'],
  imports: [MatTableModule, MatPaginatorModule, MatButton,  MatTooltip, RouterLink, MatIconModule, CommonModule],
  standalone: true
})
export class MetaListPageComponent implements AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['name', 'description', 'reserve', 'objective', 'actions'];
  dataSource = new MatTableDataSource<MyMeta>(mockMeta);

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  editRecord(id: number): void {
    // const newRecord: TableData = {
    //   id: this.nextId++,
    //   name: `User ${this.nextId - 1}`,
    //   email: `user${this.nextId - 1}@example.com`,
    //   position: 'Employee'
    // };
    //
    // this.dataSource = [...this.dataSource, newRecord];
  }

  deleteRecord(id: number): void {
    // this.dataSource = this.dataSource.filter(record => record.id !== id);
  }
}
