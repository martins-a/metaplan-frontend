
import {AfterViewInit, Component, inject, ViewChild} from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {mockMeta} from '../../mocks/meta-mocks';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MyMeta} from '../../models/my-meta';
import {MatButton} from '@angular/material/button';
import {MatTooltip} from '@angular/material/tooltip';
import {Router, RouterLink} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {MetaApiService} from '../../services/meta-api.service';
import {environment} from '../../../environment/environment';

@Component({
  selector: 'app-pages-meta-list',
  templateUrl: './meta-list-page.component.html',
  styleUrls: ['./meta-list-page.component.scss'],
  imports: [MatTableModule, MatPaginatorModule, MatButton,  MatTooltip, RouterLink, MatIconModule, CommonModule],
  standalone: true
})
export class MetaListPageComponent implements AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private router: Router,
  ) {}

  displayedColumns: string[] = ['name', 'description', 'reserve', 'objective', 'actions'];
  dataSource: MatTableDataSource<MyMeta> =  new MatTableDataSource<MyMeta>();
  metaApiService: MetaApiService = inject(MetaApiService);

  ngAfterViewInit() {
    this.getRecords();
  }

  getRecords(): void {
    if (environment.useMock) {
      this.dataSource = new MatTableDataSource<MyMeta>(mockMeta);
    } else {
      this.metaApiService.getAllMetas()
        .subscribe(meta => {
          this.dataSource = new MatTableDataSource<MyMeta>(meta);
        })
    }
    this.dataSource.paginator = this.paginator;
  }

  editRecord(id: number): void {
    this.router.navigate(['/meta-create'], {
      queryParams: {
        id: id
      }
    });
  }

  deleteRecord(id: string): void {
    alert(id);
    debugger;
    if (environment.useMock) {
      alert('deleted');
    } else {
      this.metaApiService.deleteMeta(id)
        .subscribe(() => {
          alert('deleted');
        })
    }
  }
}
