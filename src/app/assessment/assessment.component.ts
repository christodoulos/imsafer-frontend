import { Component, inject } from '@angular/core';
import { ImsaferService } from '../app.service';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
@Component({
  selector: 'app-assessment',
  standalone: true,
  imports: [
    CommonModule,
    FileUploadComponent,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './assessment.component.html',
  styleUrl: './assessment.component.css',
})
export class AssessmentComponent {
  service = inject(ImsaferService);

  jobID: string | undefined;
  completed: boolean | undefined;
  thumbnail: ArrayBuffer | string | null | undefined;
  jobFailed = false;
  failedReason = '';
  caseName = '';
  progress = 0;

  submitCase(data: FormData) {
    this.service.assessmentJob(data).subscribe((data) => {
      console.log('ASSESSMENT JOB', data);
      this.jobID = data['jobID'];
      this.caseName = data['name'];
      if (this.jobID) {
        this.service.getAssessmentJob(this.jobID).subscribe((job) => {
          console.log('ASSESSMENT SUBMIT JOB', job);
          this.completed = job.completed;
        });
      }
    });
  }

  refresh() {
    console.log('REFRESHING');
    if (this.jobID)
      this.service.getAssessmentJob(this.jobID).subscribe((job) => {
        console.log('REFRESH', job);
        this.progress = job.progress || 0;
        if (job.completed && !job.failed && this.jobID) {
          this.completed = true;
          this.service.getAssessmentJobImage(this.jobID).subscribe((img) => {
            this.createImageFromBlob(img);
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

  reload() {
    this.service.reloadComponent('/assessment');
  }

  // downloadResults() {
  //   this.service.downloadResults(
  //     'http://localhost:3001/optimize/evacuationResults',
  //     this.jobID || '',
  //     this.caseName
  //   );
  // }

  downloadResults() {
    this.service.downloadAssessment(this.jobID || '', this.caseName);
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
}
