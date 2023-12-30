import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

export interface BullJob {
  jobID: string;
  name: string;
  uuid: string;
}

interface FireJobData {
  name: string;
  fireData: string;
  uuid: string;
}

interface FireJob {
  data: FireJobData;
  attemptsMade: number;
  id: string;
  progress: number;
  finishedOn: number;
}

@Injectable({
  providedIn: 'root',
})
export class ImsaferService {
  constructor(private http: HttpClient, private router: Router) {}

  blastJob(data: FormData): Observable<any> {
    return this.http.post<BullJob>(
      'http://localhost:3001/optimize/blast',
      data
    );
  }

  getBullJob(jobID: string) {
    return this.http.get<{
      completed?: boolean;
      failed?: boolean;
      failedReason?: string;
      progress?: string;
    }>(`http://localhost:3001/optimize/bullJob/${jobID}`);
  }

  getBlastJob(jobID: string) {
    return this.http.get<{
      completed?: boolean;
      failed?: boolean;
      failedReason?: string;
    }>(`http://localhost:3001/optimize/blast/${jobID}`);
  }

  getBlastJobImage(jobID: string) {
    return this.http.get(
      `http://localhost:3001/optimize/blast/${jobID}/picture`,
      {
        responseType: 'blob',
      }
    );
  }

  reloadComponent(path: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([path]);
    });
  }

  downloadResults(baseURL: string, jobID: string, filename: string): void {
    const _baseUrl = `${baseURL}/${jobID}`;

    this.http
      .get(_baseUrl, { responseType: 'blob' as 'json' })
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
    const baseUrl = `http://localhost:3001/optimize/fireResults/${jobID}`;

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

  createImageFromBlob(image: Blob): string | ArrayBuffer | null {
    const reader = new FileReader();
    if (image) {
      reader.readAsDataURL(image);
    }
    return reader.result;
  }

  getFireJobs() {
    return this.http.get<FireJob[]>('http://localhost:3001/optimize/fire');
  }

  getFireJob(jobID: string) {
    return this.http.get<{
      completed?: boolean;
      failed?: boolean;
      failedReason?: string;
      progress?: number;
    }>(`http://localhost:3001/optimize/fire/${jobID}`);
  }

  fireJob(data: FormData): Observable<any> {
    return this.http.post<BullJob>('http://localhost:3001/optimize/fire', data);
  }
}
