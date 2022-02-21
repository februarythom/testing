import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { flatMap, map, switchMap, tap } from 'rxjs/operators';
import { Visitor } from '../model/visitor.model';

@Injectable({
  providedIn: 'root'
})
export class VisitorService {

  visitors: Visitor[] = [];

  constructor(private httpClient: HttpClient) { }

  getVisitorData(): Observable<Visitor[]> {
    return this.httpClient.get('http://localhost:3000/api/visitor').pipe(
      map((data: any) => {
        const { visitors, err } = data;
        if(!err) {
          return visitors;

        } else {
          return [];
        }
      })
    );
  }

  addVisitor(data: any): Observable<Visitor> {
    return this.httpClient.post('http://localhost:3000/api/visitor/add', data).pipe(
      map((data: any) => {
        const { add_visitor, err } = data;
        if(!err) {
          return add_visitor;
        } else {
          return null;
        }
      })
    );
  }

  editVisitor(id: string, data: any): Observable<Visitor> {
    return this.httpClient.put('http://localhost:3000/api/visitor/edit/' + id, data).pipe(
      map((data: any) => {
        const { updated_visitor, err } = data;
        if(!err) {
          return updated_visitor;
        } else {
          return null;
        }
      })
    );
  }

  deleteVisitor(id: string): Observable<Visitor>  {
    return this.httpClient.delete('http://localhost:3000/api/visitor/delete/' + id).pipe(
      map((data: any) => {
        const { deleted_visitor, err } = data;
        if(!err) {
          return deleted_visitor;
        } else {
          return null;
        }
      })
    );
  }

}
