import {Component, EventEmitter, Input, Output} from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { StoreService } from '../../shared/store.service';
import { BackendService } from '../../shared/backend.service';
import {FormGroup} from "@angular/forms";
import {Registration} from "../../shared/Interfaces/Registration";

@Component({
  selector: 'app-data',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './data.component.html',
  styleUrl: './data.component.css'
})
export class DataComponent {

  @Input() registration: any;
  @Output() registrationDeleted = new EventEmitter<string>();

  constructor(public storeService: StoreService, private backendService: BackendService) {}

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
        }
      });
    }
  }



}
