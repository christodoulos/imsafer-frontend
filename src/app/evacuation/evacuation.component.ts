import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { MatButtonModule } from '@angular/material/button';
import { ImsaferService } from '../app.service';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-evacuation',
  standalone: true,
  imports: [
    CommonModule,
    FileUploadComponent,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './evacuation.component.html',
  styleUrl: './evacuation.component.css',
})
export class EvacuationComponent {
  service = inject(ImsaferService);

  // jobID: string | undefined;
  jobID = '';
  completed: boolean | undefined;
  thumbnail: ArrayBuffer | string | null | undefined;
  jobFailed = false;
  failedReason = '';
  caseName = '';
  progress = 0;

  submitCase(data: FormData) {
    this.service.evacuationJob(data).subscribe((data) => {
      console.log('EVACUATION JOB', data);
      this.jobID = data['jobID'];
      this.caseName = data['name'];
      if (this.jobID) {
        this.service.getEvacuationJob(this.jobID).subscribe((job) => {
          console.log('EVACUATION SUBMIT JOB', job);
          this.completed = job.completed;
        });
      }
    });
  }

  refresh() {
    console.log('REFRESHING');
    // if (this.jobID)
    this.service.getEvacuationJob(this.jobID).subscribe((job) => {
      console.log('REFRESH', job);
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
    this.service.reloadComponent('/evacuation');
  }

  // downloadResults() {
  //   this.service.downloadResults(
  //     'http://localhost:3001/optimize/evacuationResults',
  //     this.jobID || '',
  //     this.caseName
  //   );
  // }

  downloadResults() {
    this.service.downloadEvacuation(this.jobID || '', this.caseName);
  }
}
