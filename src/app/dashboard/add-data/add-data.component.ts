import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { Validators, FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { StoreService } from '../../shared/store.service';
import { BackendService } from '../../shared/backend.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-add-data',
  standalone: true,  // standalone-Komponente
  imports: [SharedModule, ReactiveFormsModule],  // Import der benötigten Module
  templateUrl: './add-data.component.html',
  styleUrls: ['./add-data.component.css']
})
export class AddDataComponent implements OnInit {
  registrationForm!: FormGroup;

  submittedData: any = {}; //Data for modal

  constructor(
    private formBuilder: FormBuilder,
    public storeService: StoreService,
    private backendService: BackendService,
    private modalService: NgbModal
  ) {}


  ngOnInit(): void {
    this.registrationForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]],
      courseId: ['', Validators.required],
      birthdate: [null, [Validators.required]],
      newsletter: [false]
    });
  }

  onSubmit(content: any) {
    const formValue = this.registrationForm.value;

    if (this.registrationForm.valid) {
      this.backendService.addRegistration(this.registrationForm.value, this.storeService.currentPage);
      this.registrationForm.reset({
        newsletter: false
      });

      const selectedCourse = this.storeService.courses.find(course => course.id === formValue.courseId);

      this.submittedData = {
        name: formValue.name,
        birthdate: formValue.birthdate,
        course: selectedCourse ? selectedCourse.name : '???',
        newsletter: formValue.newsletter ? 'Ja' : 'Nein'
      };

      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
    } else {
      this.registrationForm.markAllAsTouched();
    }
  }
}
