import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  todayDate: Date = new Date();

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  changePage(path) {
    this.router.navigate(['/' + path]);
  }

}
