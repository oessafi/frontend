// Correspond à AuthRequest.java
export interface AuthRequest {
  email: string;
  password: string;
}

// Représente le UserDTO.java du backend
export interface UserDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string; // Ex: "DOCTORANT", "PERSONNEL_ADMIN"
  status: string;
  specialty?: string;   // Optionnel car null pour ADMIN
  laboratory?: string;  // Optionnel car null pour ADMIN
  studentId?: string;   // Optionnel car null pour ADMIN/PROF
  createdAt: string;    // Format "yyyy-MM-dd HH:mm:ss"
  updatedAt: string;    // Format "yyyy-MM-dd HH:mm:ss"
}

// Correspond à AuthResponse.java
export interface AuthResponse {
  token: string;
  user: UserDTO;
}