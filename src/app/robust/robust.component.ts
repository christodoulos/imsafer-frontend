import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ImsaferService } from '../app.service';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-robust',
  standalone: true,
  imports: [CommonModule, FileUploadComponent],
  templateUrl: './robust.component.html',
  styleUrl: './robust.component.css',
})
export class RobustComponent {
  service = inject(ImsaferService);
  router = inject(Router);

  jobID: string | undefined;
  completed: boolean | undefined;
  progress = '0';
  thumbnail: ArrayBuffer | string | null | undefined;
  jobFailed = false;
  failedReason = '';
  caseName = '';

  submitCase(data: FormData) {
    console.log(data);
    // this.service.uploadStrengthen(data).subscribe((data) => {
    //   this.jobID = data['jobID'];
    //   this.caseName = data['name'];
    //   this.router.navigate(['Results']);
    //   if (this.jobID) {
    //     this.service.getBullJob(this.jobID).subscribe((job) => {
    //       this.completed = job.completed;
    //     });
    //   }
    // });
  }

  refresh() {
    if (this.jobID)
      this.service.getBullJob(this.jobID).subscribe((job) => {
        console.log(job);
        this.progress = job.progress || '';
        if (job.completed && !job.failed && this.jobID) {
          this.completed = true;
          // this.service.getStrengthenJobImage(this.jobID).subscribe((img) => {
          //   this.createImageFromBlob(img);
          //   // this.thumbnail = this.service.createImageFromBlob(img);
          // });
        }
        if (job.failed) {
          this.failedReason = job.failedReason || '';
          this.jobFailed = true;
          this.completed = true;
        }
      });
  }

  reload() {
    this.service.reloadComponent('/Strengthen');
  }

  downloadResults() {
    this.service.downloadResults(
      '/api/optimize/strengthen',
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
