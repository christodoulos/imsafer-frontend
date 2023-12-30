import { Component, inject } from '@angular/core';
import { ImsaferService } from '../app.service';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-fire',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './fire.component.html',
  styleUrl: './fire.component.css',
})
export class FireComponent {
  service = inject(ImsaferService);

  numberRegEx = /^-?\d*\.?\d*$/;
  formvals = ['1', '3'];
  formulations = ['Minimize budget', 'Maximize FSI'];

  jobID: string | undefined;
  completed: boolean | undefined;
  thumbnail: ArrayBuffer | string | null | undefined;
  jobFailed = false;
  failedReason = '';
  caseName = '';
  progress = 0;

  form0 = new FormGroup({
    fireCaseID: new FormControl('', [Validators.required]),
  });

  form1 = new FormGroup({
    formulation: new FormControl('', [
      Validators.required,
      Validators.pattern(this.numberRegEx),
    ]),
  });

  form2 = new FormGroup({
    area: new FormControl('7000.0', [
      Validators.required,
      Validators.pattern(this.numberRegEx),
    ]),
  });

  form3 = new FormGroup({
    1: new FormControl('40.0', [
      Validators.required,
      Validators.pattern(this.numberRegEx),
    ]),
    2: new FormControl('40.0', [
      Validators.required,
      Validators.pattern(this.numberRegEx),
    ]),
    3: new FormControl('10.0', [
      Validators.required,
      Validators.pattern(this.numberRegEx),
    ]),
    4: new FormControl('30.0', [
      Validators.required,
      Validators.pattern(this.numberRegEx),
    ]),
    5: new FormControl('10.0', [
      Validators.required,
      Validators.pattern(this.numberRegEx),
    ]),
    6: new FormControl('30.0', [
      Validators.required,
      Validators.pattern(this.numberRegEx),
    ]),
    7: new FormControl('20.0', [
      Validators.required,
      Validators.pattern(this.numberRegEx),
    ]),
    8: new FormControl('10.0', [
      Validators.required,
      Validators.pattern(this.numberRegEx),
    ]),
    9: new FormControl('30.0', [
      Validators.required,
      Validators.pattern(this.numberRegEx),
    ]),
    10: new FormControl('40.0', [
      Validators.required,
      Validators.pattern(this.numberRegEx),
    ]),
    11: new FormControl('40.0', [
      Validators.required,
      Validators.pattern(this.numberRegEx),
    ]),
    12: new FormControl('20.0', [
      Validators.required,
      Validators.pattern(this.numberRegEx),
    ]),
    13: new FormControl('10.0', [
      Validators.required,
      Validators.pattern(this.numberRegEx),
    ]),
    14: new FormControl('10.0', [
      Validators.required,
      Validators.pattern(this.numberRegEx),
    ]),
    15: new FormControl('20.0', [
      Validators.required,
      Validators.pattern(this.numberRegEx),
    ]),
    16: new FormControl('20.0', [
      Validators.required,
      Validators.pattern(this.numberRegEx),
    ]),
  });

  form4 = new FormGroup({
    targetBudget: new FormControl('1000000.0', [
      Validators.required,
      Validators.pattern(this.numberRegEx),
    ]),
    targetEpsilon: new FormControl('0.70', [
      Validators.required,
      Validators.pattern(this.numberRegEx),
    ]),
  });

  changeFormulation(e: any) {
    console.log(e);
    this.form1.controls.formulation.setValue(e.target.value, {
      onlySelf: true,
    });
  }

  onSubmit() {
    // Awfull hack but desparate times call for desparate measures
    if (
      this.form0.valid &&
      this.form1.valid &&
      this.form2.valid &&
      this.form3.valid &&
      this.form4.valid
    ) {
      let input = '';
      for (const [, v] of Object.entries(this.form1.value)) {
        input += v;
      }
      input += '\n';
      for (const [, v] of Object.entries(this.form2.value)) {
        input += v;
      }
      input += '\n';
      for (const [, v] of Object.entries(this.form3.value)) {
        input += `${v} `;
      }
      input = input.trim();
      input += '\n';
      for (const [, v] of Object.entries(this.form4.value)) {
        input += `${v} `;
      }
      input = input.trim();

      const formData = new FormData();
      formData.append('name', this.form0.value.fireCaseID ?? '');
      formData.append('atc', input);

      this.service.fireJob(formData).subscribe((data) => {
        console.log('FIRE JOB', data);
        this.jobID = data['jobID'];
        this.caseName = data['name'];
        if (this.jobID) {
          this.service.getFireJob(this.jobID).subscribe((job) => {
            console.log('FIRE JOB', job);
            this.completed = job.completed;
          });
        }
      });
    }
  }

  refresh() {
    if (this.jobID)
      this.service.getFireJob(this.jobID).subscribe((job) => {
        console.log('REFRESH FIRE JOB', job);
        this.progress = job.progress || 0;
        if (job.completed && !job.failed && this.jobID) {
          this.completed = true;
        }
        if (job.failed) {
          this.failedReason = job.failedReason || '';
          this.jobFailed = true;
          this.completed = true;
        }
      });
  }

  reload() {
    this.service.reloadComponent('/fire');
  }

  downloadResults() {
    // this.service.downloadResults(
    //   'http://localhost:3001/optimize/fireResults',
    //   this.jobID || '',
    //   this.caseName
    // );
    this.service.downloadFire(this.jobID || '', this.caseName);
  }
}
