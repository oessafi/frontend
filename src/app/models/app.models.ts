// --- DTOs pour requêtes/réponses ---
export interface CreateInscriptionRequest {
  doctorantId: string;
  sujetThese: string;
  directeurId: string;
}

export interface ValidateInscriptionRequest {
  approuve: boolean;
  commentaire?: string;
}

export interface PropositionJuryRequest {
  doctorantId: string;
  membres: { nom: string; role: string }[];
}

export interface CreateCampagneRequest {
  anneeAcademique?: string;
  dateDebut: string;
  dateFin: string;
}

export interface PlanificationRequest {
  date: string;
  lieu: string;
}

export interface InscriptionListResponse {
  data: Inscription[];
  total: number;
  message?: string;
  success: boolean;
  timestamp?: string;
}

export interface InscriptionResponse {
  data: Inscription;
  message?: string;
  success: boolean;
  timestamp?: string;
}
// Requêtes supplémentaires
export interface ValidateInscriptionRequest {
  approuve: boolean;
  commentaire?: string;
}

export interface PropositionJuryRequest {
  doctorantId: string;
  membres: { nom: string; role: string }[];
}

export interface CreateCampagneRequest {
  anneeAcademique?: string;
  nom?: string;
  dateDebut: string;
  dateFin: string;
}

export interface PlanificationRequest {
  date: string;
  lieu: string;
}

export interface InscriptionListResponse {
  data: Inscription[];
  total: number;
  message?: string;
  success: boolean;
  timestamp?: string;
}

// Types pour soutenances
export interface DemandeSoutenanceRequest {
  doctorantId: string;
  dateSoutenance: string;
  lieuSoutenance: string;
  sujetThese?: string;
  inscriptionId?: string;
}

export interface ValidationAdminRequest {
  approuve: boolean;
  commentaire?: string;
}
export enum UserRole {
  CANDIDAT = 'CANDIDAT',
  DOCTORANT = 'DOCTORANT',
  DIRECTEUR_THESE = 'DIRECTEUR_THESE',
  PERSONNEL_ADMIN = 'PERSONNEL_ADMIN'
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  studentId?: string;
}

export enum InscriptionType {
  INSCRIPTION_INITIALE = 'INSCRIPTION_INITIALE',
  REINSCRIPTION = 'REINSCRIPTION'
}

export enum InscriptionStatus {
  BROUILLON = 'BROUILLON',
  SOUMISE = 'SOUMISE',
  EN_ATTENTE_DIRECTEUR = 'EN_ATTENTE_DIRECTEUR',
  EN_ATTENTE_ADMIN = 'EN_ATTENTE_ADMIN',
  VALIDE = 'VALIDE',
  REFUSEE = 'REFUSEE'
  // Ajoutez d'autres statuts si nécessaire
}

export interface Inscription {
  id: string;
  doctorantId: string;
  doctorantName: string;
  directeurId: string;
  directeurName: string;
  type: InscriptionType;
  status: InscriptionStatus;
  sujetThese: string;
  laboratoire: string;
  anneeAcademique: string;
  documents?: string[];
}

export enum SoutenanceStatus {
  INITIEE = 'INITIEE',
  JURY_PROPOSE = 'JURY_PROPOSE',
  VALIDEE_ADMIN = 'VALIDEE_ADMIN',
  PLANIFIEE = 'PLANIFIEE',
  VALIDEE = 'VALIDEE'
  // Ajoutez d'autres statuts si nécessaire
}
export enum DocumentType {
  INSCRIPTION = 'INSCRIPTION',
  SOUTENANCE = 'SOUTENANCE',
  AUTRE = 'AUTRE',
}

export interface DemandeSoutenance {
  id: string;
  doctorantId: string;
  status: SoutenanceStatus;
  dateSoutenance: string;
  lieuSoutenance: string;
  jury?: string[];
  documents?: string[];
}

export interface Campagne {
  id: string;
  anneeAcademique: string;
  type: string;
  dateDebut: string;
  dateFin: string;
  active: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}
