import { Routes } from '@angular/router';
import { WelcomeComponent } from '../assets/welcome/welcome.component';
import { BlastComponent } from './blast/blast.component';

export const routes: Routes = [
  { path: 'blast', component: BlastComponent },
  { path: '', component: WelcomeComponent },
];
