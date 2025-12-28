import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DoctorantDashboardComponent } from './components/doctorant/doctorant-dashboard.component';
import { InscriptionComponent } from './components/doctorant/inscription.component';
import { UploadDocsComponent } from './components/doctorant/upload-docs.component';
import { DossierStatusComponent } from './components/doctorant/dossier-status.component';
import { SoutenanceRequestComponent } from './components/doctorant/soutenance-request.component';
import { EncadrantDashboardComponent } from './components/encadrant/encadrant-dashboard.component';
import { NotificationsComponent } from './components/encadrant/notifications.component';
import { ValidateDossierComponent } from './components/encadrant/validate-dossier.component';
import { ProposeJuryComponent } from './components/encadrant/propose-jury.component';
import { SuperviseesComponent } from './components/encadrant/supervisees.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard.component';
import { CampaignsComponent } from './components/admin/campaigns.component';
import { ValidateDossiersComponent } from './components/admin/validate-dossiers.component';
import { PlanningComponent } from './components/admin/planning.component';
import { UserManagementComponent } from './components/admin/user-management.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'doctorant/dashboard', component: DoctorantDashboardComponent, canActivate: [AuthGuard], data: { roles: 'ROLE_DOCTORANT' } },
  { path: 'doctorant/inscription', component: InscriptionComponent, canActivate: [AuthGuard], data: { roles: 'ROLE_DOCTORANT' } },
  { path: 'doctorant/upload-docs', component: UploadDocsComponent, canActivate: [AuthGuard], data: { roles: 'ROLE_DOCTORANT' } },
  { path: 'doctorant/dossier-status', component: DossierStatusComponent, canActivate: [AuthGuard], data: { roles: 'ROLE_DOCTORANT' } },
  { path: 'doctorant/soutenance-request', component: SoutenanceRequestComponent, canActivate: [AuthGuard], data: { roles: 'ROLE_DOCTORANT' } },
  { path: 'encadrant/dashboard', component: EncadrantDashboardComponent, canActivate: [AuthGuard], data: { roles: 'ROLE_ENCADRANT' } },
  { path: 'encadrant/notifications', component: NotificationsComponent, canActivate: [AuthGuard], data: { roles: 'ROLE_ENCADRANT' } },
  { path: 'encadrant/validate-dossier', component: ValidateDossierComponent, canActivate: [AuthGuard], data: { roles: 'ROLE_ENCADRANT' } },
  { path: 'encadrant/propose-jury', component: ProposeJuryComponent, canActivate: [AuthGuard], data: { roles: 'ROLE_ENCADRANT' } },
  { path: 'encadrant/supervisees', component: SuperviseesComponent, canActivate: [AuthGuard], data: { roles: 'ROLE_ENCADRANT' } },
  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard], data: { roles: 'ROLE_ADMINISTRATIF' } },
  { path: 'admin/campaigns', component: CampaignsComponent, canActivate: [AuthGuard], data: { roles: 'ROLE_ADMINISTRATIF' } },
  { path: 'admin/validate-dossiers', component: ValidateDossiersComponent, canActivate: [AuthGuard], data: { roles: 'ROLE_ADMINISTRATIF' } },
  { path: 'admin/planning', component: PlanningComponent, canActivate: [AuthGuard], data: { roles: 'ROLE_ADMINISTRATIF' } },
  { path: 'admin/users', component: UserManagementComponent, canActivate: [AuthGuard], data: { roles: 'ROLE_ADMINISTRATIF' } },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];