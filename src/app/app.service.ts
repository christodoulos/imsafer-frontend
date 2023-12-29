import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

export interface StrengthenJob {
  jobID: string;
  name: string;
  uuid: string;
}

@Injectable({
  providedIn: 'root',
})
export class ImsaferService {
  constructor(private http: HttpClient, private router: Router) {}

  uploadStrengthen(data: FormData): Observable<StrengthenJob> {
    return this.http.post<StrengthenJob>(
      'http://localhost:3001/optimize/strengthen',
      data
    );
  }

  blastJob(data: FormData): Observable<any> {
    return this.http.post<StrengthenJob>(
      'http://localhost:3001/optimize/blast',
      data
    );
  }

  getStrengthenJob(jobID: string) {
    return this.http.get<{
      completed?: boolean;
      failed?: boolean;
      failedReason?: string;
      progress?: string;
    }>(`http://localhost:3001/optimize/strengthenJob/${jobID}`);
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

  getStrengthenJobImage(jobID: string) {
    return this.http.get(
      `http://localhost:3001/optimize/strengthen/${jobID}/picture`,
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

  createImageFromBlob(image: Blob): string | ArrayBuffer | null {
    const reader = new FileReader();
    // reader.addEventListener(
    //   'load',
    //   async () => {
    //     return reader.result;
    //   },
    //   false
    // );

    if (image) {
      reader.readAsDataURL(image);
    }
    return reader.result;
  }
}
