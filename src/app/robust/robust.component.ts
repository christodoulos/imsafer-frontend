import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ImsaferService } from '../app.service';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { MatButtonModule } from '@angular/material/button';
import { environment } from '../../environments/environment';

const API = environment.apiUrl;

@Component({
  selector: 'app-robust',
  standalone: true,
  imports: [CommonModule, FileUploadComponent, MatButtonModule],
  templateUrl: './robust.component.html',
  styleUrl: './robust.component.css',
})
export class RobustComponent {
  service = inject(ImsaferService);

  jobID: string | undefined;
  completed: boolean | undefined;
  thumbnail: ArrayBuffer | string | null | undefined;
  jobFailed = false;
  failedReason = '';
  caseName = '';
  progress = 0;

  submitCase(data: FormData) {
    this.service.robustJob(data).subscribe((data) => {
      console.log('ROBUST JOB', data);
      this.jobID = data['jobID'];
      this.caseName = data['name'];
      if (this.jobID) {
        this.service.getRobustJob(this.jobID).subscribe((job) => {
          this.completed = job.completed;
        });
      }
    });
  }

  refresh() {
    if (this.jobID)
      this.service.getRobustJob(this.jobID).subscribe((job) => {
        console.log(job);
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
    this.service.reloadComponent('/robust');
  }

  downloadResults() {
    this.service.downloadResults(
      `${API}/optimize/robustResults`,
      this.jobID || '',
      this.caseName
    );
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
