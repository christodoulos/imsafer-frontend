import { Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { BlastComponent } from './blast/blast.component';
import { RobustComponent } from './robust/robust.component';
import { ResultsComponent } from './results/results.component';
import { FireComponent } from './fire/fire.component';
import { EvacuationComponent } from './evacuation/evacuation.component';
import { RiskComponent } from './risk/risk.component';
import { AssessmentComponent } from './assessment/assessment.component';

export const routes: Routes = [
  { path: 'blast', component: BlastComponent },
  { path: 'robust', component: RobustComponent },
  { path: 'results', component: ResultsComponent },
  { path: 'fire', component: FireComponent },
  { path: 'evacuation', component: EvacuationComponent },
  { path: 'risk', component: RiskComponent },
  { path: 'assessment', component: AssessmentComponent },
  { path: '', component: WelcomeComponent },
];
