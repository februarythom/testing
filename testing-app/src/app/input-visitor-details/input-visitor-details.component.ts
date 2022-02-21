import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { VisitorService } from 'src/app/service/visitor.service';

@Component({
  selector: 'app-input-visitor-details',
  templateUrl: './input-visitor-details.component.html',
  styleUrls: ['./input-visitor-details.component.scss']
})
export class InputVisitorDetailsComponent implements OnInit, OnDestroy {

  subcription$ = new Subscription();

  visitorForm: FormGroup;

  operationFlag: { id?: string, type?: string } = {};

  constructor(
    private _activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private visitorService: VisitorService
  ) {

    this.visitorForm = this.fb.group({
      name: ['', Validators.required],
      phone_number: ['', Validators.required],
      queue_line: ['', Validators.required],
    });

  }

  ngOnInit(): void {

    let self = this;

    this.subcription$.add(
      self._activatedRoute.params.pipe(
        switchMap((params) => {
          if (!(Object.keys(params).length === 0)) {
            self.operationFlag = params; // access the visitor param
            let visiorById = self.visitorService.visitors.find((visitor) => visitor._id === params['id']);
            return of(visiorById)
          } else {
            return of(null)
          }
        }),
      ).subscribe((params) => {
        if (params) {
          self.visitorForm.patchValue({
            name: params['name'],
            phone_number: params['phone_number'],
            queue_line: params['queue_line'],
          })
        }

      })
    );

  }

  cancel() {
    this.router.navigateByUrl('/visitor-list');
  }

  save() {

    if (!(Object.keys(this.operationFlag).length === 0)) {

      //edit
      this.visitorService.editVisitor(this.operationFlag.id, { ...this.visitorForm.value }).subscribe((editedUser) => {

        if (editedUser) {
          console.log({ 'edited User': { ...editedUser } })
          this.router.navigateByUrl('/visitor-list');
        }
      });

    } else {

      //create
      this.visitorService.addVisitor({ ...this.visitorForm.value }).subscribe((adduser) => {

        if (adduser) {
          console.log({ 'new User': { ...adduser } })
          this.router.navigateByUrl('/visitor-list');
        }

      });

    }

  }

  ngOnDestroy() {
    this.subcription$.unsubscribe();
  }

}
