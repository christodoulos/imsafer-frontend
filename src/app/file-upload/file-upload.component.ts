import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css',
})
export class FileUploadComponent {
  @ViewChild('fileInput') fileElementRef: ElementRef | undefined;
  @Output() case = new EventEmitter<FormData>();
  @Input() fileType = '';
  fileInput: HTMLInputElement | undefined;
  file: File | null = null;
  name = '';
  formData: FormData | undefined;

  ngAfterViewInit(): void {
    this.fileInput = this.fileElementRef?.nativeElement;
  }

  onFileAdded() {
    if (this.fileInput && this.fileInput.files) {
      this.file = this.fileInput.files[0];
      this.formData = new FormData();
      this.formData.append('file', this.file);
    } else {
      this.formData = undefined;
      this.file = null;
    }
  }

  emitCase() {
    this.formData?.append('name', this.name);

    // Log FormData contents
    this.formData?.forEach((value, key) => {
      console.log(key, value);
    });

    this.case.emit(this.formData);
  }
}
