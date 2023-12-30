import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ImsaferService } from '../app.service';
import { Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './results.component.html',
  styleUrl: './results.component.css',
})
export class ResultsComponent {
  http = inject(HttpClient);
  service = inject(ImsaferService);

  // strengthenJobs$ = this.service.getStrengthenJobs();
  fireJobs$ = this.service.getFireJobs();

  // ngOnInit(): void {
  //   this.strengthenJobs$.subscribe((jobs) => {
  //     console.log(jobs);
  //   });
  //   this.fireJobs$.subscribe((jobs) => {
  //     console.log(jobs);
  //   });
  // }

  downloadFile(jobID: string, filename: string): void {
    const baseUrl = `/api/optimize/strengthen/${jobID}`;

    this.http
      .get(baseUrl, { responseType: 'blob' as 'json' })
      .subscribe((response: any) => {
        const dataType = response.type;
        const binaryData = [];
        binaryData.push(response);
        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(
          new Blob(binaryData, { type: dataType })
        );
        if (filename) downloadLink.setAttribute('download', `${filename}.zip`);
        document.body.appendChild(downloadLink);
        downloadLink.click();
      });
  }

  downloadFire(jobID: string, filename: string): void {
    console.log(jobID, filename);
    const baseUrl = `/api/optimize/fire/${jobID}`;

    this.http
      .get(baseUrl, { responseType: 'blob' })
      .subscribe((response: any) => {
        const dataType = response.type;
        console.log(response, dataType);
        const binaryData = [];
        binaryData.push(response);
        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(
          new Blob(binaryData, { type: dataType })
        );
        if (filename) downloadLink.setAttribute('download', `${filename}.txt`);
        document.body.appendChild(downloadLink);
        downloadLink.click();
      });
  }
}
