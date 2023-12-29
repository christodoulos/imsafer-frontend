import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ImsaferService } from '../app.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blast',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './blast.component.html',
  styleUrl: './blast.component.css',
})
export class BlastComponent {
  service = inject(ImsaferService);

  jobID: string | undefined;
  completed: boolean | undefined;
  thumbnail: ArrayBuffer | string | null | undefined;
  jobFailed = false;
  failedReason = '';
  caseName = '';

  numberRegEx = /^-?\d*\.?\d*$/;
  form = new FormGroup({
    blastCaseID: new FormControl('', [Validators.required]),
    chargeWeight: new FormControl('', [
      Validators.required,
      Validators.pattern(this.numberRegEx),
    ]),
    distance: new FormControl('', [
      Validators.required,
      Validators.pattern(this.numberRegEx),
    ]),
    structureWidth: new FormControl('', [
      Validators.required,
      Validators.pattern(this.numberRegEx),
    ]),
    structureLength: new FormControl('', [
      Validators.required,
      Validators.pattern(this.numberRegEx),
    ]),
    structureHeight: new FormControl('', [
      Validators.required,
      Validators.pattern(this.numberRegEx),
    ]),
  });

  onSubmit() {
    const formData = new FormData();
    formData.append('name', this.form.value.blastCaseID ?? '');
    formData.append('data', JSON.stringify(this.form.value));

    this.service.blastJob(formData).subscribe((data) => {
      this.jobID = data['jobID'];
      this.caseName = data['name'];
      if (this.jobID) {
        this.service.getBlastJob(this.jobID).subscribe((job) => {
          this.completed = job.completed;
        });
      }
    });
  }

  refresh() {
    if (this.jobID)
      this.service.getBlastJob(this.jobID).subscribe((job) => {
        if (job.completed && !job.failed && this.jobID) {
          this.completed = true;
          this.service.getBlastJobImage(this.jobID).subscribe((img) => {
            this.createImageFromBlob(img);
          });
        }
        if (job.failed) {
          this.failedReason = job.failedReason || '';
          this.jobFailed = true;
          this.completed = true;
        }
      });
  }

  createImageFromBlob(image: Blob) {
    const reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        this.thumbnail = reader.result;
      },
      false
    );

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  reload() {
    this.service.reloadComponent('/blast');
  }

  downloadResults() {
    this.service.downloadResults(
      'http://localhost:3001/optimize/blastResults',
      this.jobID || '',
      this.caseName
    );
  }
}
