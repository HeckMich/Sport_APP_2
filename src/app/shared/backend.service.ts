import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StoreService } from './store.service';
import { Course } from './Interfaces/Course';
import { Registration } from './Interfaces/Registration';
import {catchError, tap, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http: HttpClient, private storeService: StoreService) { }

  public getCourses() {
    this.http.get<Course[]>('http://localhost:5000/courses?_expand=eventLocation').subscribe(data => {
      this.storeService.courses = data;
    });
  }

  public getRegistrations(page: number) {

    const options = {
      observe: 'response' as const,
      transferCache: {
        includeHeaders: ['X-Total-Count']
      }
    };

    this.http.get<Registration[]>(`http://localhost:5000/registrations?_expand=course&_page=${page}&_limit=4`, options).subscribe(data => {
      this.storeService.registrations = data.body!;
      this.storeService.registrationTotalCount = Number(data.headers.get('X-Total-Count'));
    });
  }

  /*
  public addRegistration(registration: any, page: number) {
    this.http.post('http://localhost:5000/registrations', registration).subscribe(_ => {
      this.getRegistrations(page);
    })
  }
   */

  public addRegistration(registration: any, page: number) {
    const registrationWithDate = {
      ...registration,
      registrationDate: new Date() // Aktuelles Datum hinzufügen
    };
    this.http.post('http://localhost:5000/registrations', registrationWithDate).subscribe(_ => {
      this.getRegistrations(page);
    });
  }

  public deleteRegistration(registrationId: string) {
    const url = `http://localhost:5000/registrations/${registrationId}`;
    return this.http.delete(url).pipe(
      catchError(error => {
        console.error('Error deleting registration:', error);
        return throwError(error);
      }),
      tap(() => this.removeRegistrationFromStore(registrationId)) // Call after successful deletion
    );
  }

  private removeRegistrationFromStore(registrationId: string) {
    this.storeService.registrations = this.storeService.registrations.filter(reg => reg.id !== registrationId);
  }


}
