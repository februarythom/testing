import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, Subscription } from 'rxjs';
import { VisitorService } from '../service/visitor.service';
import { Visitor } from '../model/visitor.model';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { RequestQueueNumberComponent } from '../request-queue-number/request-queue-number.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-visitor-list',
  templateUrl: './visitor-list.component.html',
  styleUrls: ['./visitor-list.component.scss']
})
export class VisitorListComponent implements OnInit, OnDestroy {

  @ViewChild('searchText', { static: false }) searchText: ElementRef<HTMLElement>;

  private searchUpdated = new Subject<{ searchText: string }>();

  subcription$ = new Subscription();

  dataSource = new MatTableDataSource<Visitor>();

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  visitor: Visitor[];

  displayedColumns: string[] = ['no', "name", "phone_number", "createdAt", "queue_line", 'action'];

  constructor(
    private router: Router,
    private visitorService: VisitorService,
    private dialog: MatDialog,
  ) {


  }

  ngOnInit(): void {

    let self = this;

    this.getVisitorData();

    this.searchUpdated.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(({ searchText }) => {

      let filteredVisitors = self.visitorService.visitors.filter((visitor) => {
        let isFound: boolean = false;
        Object.keys(visitor).forEach((key) => {
          let found = String(visitor[key]).toLocaleLowerCase().includes(searchText);
          if (found) {
            isFound = true;
          }
        })
        return isFound;
      })
      self.dataSource.data = filteredVisitors;
    })

  }

  getVisitorData() {

    let self = this;

    this.subcription$.add(
      self.visitorService.getVisitorData().subscribe((res: Visitor[]) => {
        self.visitorService.visitors = JSON.parse(JSON.stringify(res));
        self.dataSource.data = self.visitorService.visitors;
      })
    );
  }

  deleteVisitor(id: string) {
    let self = this;

    this.visitorService.deleteVisitor(id).subscribe((deletedUser) => {

      if (deletedUser) {

        let index = self.visitorService.visitors.findIndex((visitor) => String(visitor._id) === String(id))

        if (index >= 0) {
          self.visitorService.visitors.splice(index, 1);
          self.dataSource.data = self.visitorService.visitors;
        }
      }
    })
  }

  navigate(navTo: string) {

    this.router.navigateByUrl(navTo);
  }

  openQueue(id: string) {
    let self = this;

    let currentVisitor = self.visitorService.visitors.filter((visitor) => String(visitor._id) === id)[0]
    let visitorsByType = self.visitorService.visitors.filter((visitor) => String(visitor.queue_line) === String(currentVisitor.queue_line));

    let index = visitorsByType.findIndex((visitorByType) => visitorByType._id === currentVisitor._id);

    let lastCount= "";
    let queue_line = "";

    if(index === 0) {
      lastCount = String("001");
      queue_line = currentVisitor.queue_line + lastCount;
    } else {
      lastCount = String("000") + String(index + 1);
      queue_line = currentVisitor.queue_line + String(lastCount).substr(String(index).length, lastCount.length);
    }

    const dialogRef = this.dialog.open(RequestQueueNumberComponent, {
      // width: '250px',
      data: {...currentVisitor, queue_line }
    });

  }

  onKeyUp(value: any) {
    this.searchUpdated.next({ searchText: value });
  }

  ngOnDestroy() {
    //destroy any subcription
    this.subcription$.unsubscribe();
  }
}
