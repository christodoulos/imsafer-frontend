import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
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
  http = inject(HttpClient);
  router = inject(Router);

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

  createImageFromBlob(image: Blob): string | ArrayBuffer | null {
    const reader = new FileReader();
    if (image) {
      reader.readAsDataURL(image);
    }
    return reader.result;
  }

  getBullJob(jobID: string) {
    return this.http.get<{
      completed?: boolean;
      failed?: boolean;
      failedReason?: string;
      progress?: string;
    }>(`http://localhost:3001/optimize/bullJob/${jobID}`);
  }

  // BLAST ////////////////////////////////////////////////

  blastJob(data: FormData): Observable<any> {
    return this.http.post<BullJob>(
      'http://localhost:3001/optimize/blast',
      data
    );
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

  // FIRE ////////////////////////////////////////////////

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

  // ROBUST ////////////////////////////////////////////////

  robustJob(data: FormData): Observable<any> {
    console.log('ROBUST JOB SUBMITTED', data);
    return this.http.post<BullJob>(
      'http://localhost:3001/optimize/robust',
      data
    );
  }

  getRobustJob(jobID: string) {
    return this.http.get<{
      completed?: boolean;
      failed?: boolean;
      failedReason?: string;
      progress?: number;
    }>(`http://localhost:3001/optimize/robust/${jobID}`);
  }

  getRobustJobImage(jobID: string) {
    return this.http.get(
      `http://localhost:3001/optimize/robust/${jobID}/picture`,
      {
        responseType: 'blob',
      }
    );
  }

  // EVACUATION ////////////////////////////////////////////////

  evacuationJob(data: FormData): Observable<any> {
    return this.http.post<BullJob>(
      'http://localhost:3001/optimize/evacuation',
      data
    );
  }

  getEvacuationJob(jobID: string) {
    console.log('GET EVACUATION JOB SERVICE', jobID);
    return this.http.get<{
      completed?: boolean;
      failed?: boolean;
      failedReason?: string;
      progress?: number;
    }>(`http://localhost:3001/optimize/evacuation/${jobID}`);
  }

  downloadEvacuation(jobID: string, filename: string): void {
    console.log(jobID, filename);
    const baseUrl = `http://localhost:3001/optimize/evacuationResults/${jobID}`;

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
        if (filename) downloadLink.setAttribute('download', `${filename}.zip`);
        document.body.appendChild(downloadLink);
        downloadLink.click();
      });
  }

  // ASSESSMENT ////////////////////////////////////////////////

  assessmentJob(data: FormData): Observable<any> {
    return this.http.post<BullJob>(
      'http://localhost:3001/optimize/assessment',
      data
    );
  }

  getAssessmentJob(jobID: string) {
    console.log('GET ASSESSMENT JOB SERVICE', jobID);
    return this.http.get<{
      completed?: boolean;
      failed?: boolean;
      failedReason?: string;
      progress?: number;
    }>(`http://localhost:3001/optimize/assessment/${jobID}`);
  }

  getAssessmentJobImage(jobID: string) {
    return this.http.get(
      `http://localhost:3001/optimize/assessment/${jobID}/picture`,
      {
        responseType: 'blob',
      }
    );
  }

  downloadAssessment(jobID: string, filename: string): void {
    console.log(jobID, filename);
    const baseUrl = `http://localhost:3001/optimize/assessmentResults/${jobID}`;

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
        if (filename) downloadLink.setAttribute('download', `${filename}.zip`);
        document.body.appendChild(downloadLink);
        downloadLink.click();
      });
  }
}
