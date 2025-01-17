import { Component } from '@angular/core';
import { DataComponent } from './data/data.component';
import { AddDataComponent } from './add-data/add-data.component';
import { SharedModule } from '../shared/shared.module';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DataComponent, AddDataComponent, SharedModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
