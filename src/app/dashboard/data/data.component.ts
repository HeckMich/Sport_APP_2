import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {StoreService} from '../../shared/store.service';
import {BackendService} from '../../shared/backend.service';
import {FormGroup} from "@angular/forms";
import {Registration} from "../../shared/Interfaces/Registration";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-data',
  standalone: true,
  imports: [SharedModule, MatProgressSpinner],
  templateUrl: './data.component.html',
  styleUrl: './data.component.css'
})
export class DataComponent {
  @Input() registration: any;
  @Output() registrationDeleted = new EventEmitter<string>();
  isLoading = false; // Loading-Status für diese Reihe
  loadingId: string = "";


  constructor(public storeService: StoreService, private backendService: BackendService) {
  }

  public page: number = 0;

  selectPage(i: any) {
    let currentPage = i;
    this.storeService.currentPage = i;
    this.backendService.getRegistrations(currentPage);
  }

  public returnAllPages() {
    var pagesCount = Math.ceil(this.storeService.registrationTotalCount / 4);
    let res = [];
    for (let i = 0; i < pagesCount; i++) {
      res.push(i + 1);
    }
    return res;
  }

  deleteRegistration(registration: Registration) {
    this.isLoading = true; // Loading starten
    this.loadingId = registration.id;

    if (confirm("Möchten Sie diese Registrierung wirklich löschen?")) {
      this.backendService.deleteRegistration(registration.id).subscribe({
        next: (response) => {
          if (response) {
            console.log("Registration deleted successfully!");
            this.registrationDeleted.emit(registration.id); // Emit the ID!
          } else {
            console.error("Failed to delete registration.");
          }
        },
        error: (error) => {
          console.error("Error deleting registration:", error);
        },
        complete: () => {
          this.isLoading = false; // Loading beenden (immer, auch bei Fehlern)
          this.loadingId = "";
        }
      });

    } else {
      this.isLoading = false;
      this.loadingId = "";
    }


  }

  sortDirection: 'asc' | 'desc' = 'asc'; // Aktuelle Sortierrichtung

  sortByDate() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc'; // Richtung wechseln
    this.storeService.registrations.sort((a, b) => {
      const dateA = new Date(a.registrationDate);
      const dateB = new Date(b.registrationDate);
      return this.sortDirection === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    });
  }
}
