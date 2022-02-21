import { Visitor } from 'src/app/model/visitor.model';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-request-queue-number',
  templateUrl: './request-queue-number.component.html',
  styleUrls: ['./request-queue-number.component.scss']
})
export class RequestQueueNumberComponent implements OnInit {

  visitor: Visitor;

  constructor(
    public dialogRef: MatDialogRef<RequestQueueNumberComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Visitor) {

      this.visitor= data;
      console.log(data)
  }

  ngOnInit(): void {
  }

}
