import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

export interface Risk {
  hazardType: string;
  buildingStructure: string;
  emergencyResponsePlan: string;
}

@Component({
  selector: 'app-risk',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './risk.component.html',
  styleUrl: './risk.component.css',
})
export class RiskComponent {
  form = new FormGroup({
    hazardType: new FormControl('', [Validators.required]),
    buildingStructure: new FormControl('', [Validators.required]),
    emergencyResponsePlan: new FormControl('', [Validators.required]),
  });
  riskIndex = 0;

  onSubmit() {
    const { hazardType, buildingStructure, emergencyResponsePlan } = this.form
      .value as Risk;
    this.riskIndex =
      parseFloat(hazardType) *
      parseFloat(buildingStructure) *
      parseFloat(emergencyResponsePlan);
  }
}
