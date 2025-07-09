
import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {mockMeta} from '../../mocks/meta-mocks';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MyMeta} from '../../models/my-meta';
import {MatButton} from '@angular/material/button';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
  selector: 'app-pages-meta-list',
  templateUrl: './meta-list-page.component.html',
  styleUrls: ['./meta-list-page.component.scss'],
  imports: [MatTableModule, MatPaginatorModule, MatButton,  MatTooltip],
  standalone: true
})
export class MetaListPageComponent implements AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['name', 'description', 'reserve', 'objective'];
  dataSource = new MatTableDataSource<MyMeta>(mockMeta);

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
