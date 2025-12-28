import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Vérifier si connecté
  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  // 2. Récupérer les rôles attendus par la route (ex: ['ROLE_DOCTORANT'])
  const expectedRoles = route.data?.['roles'] as string[] | string | undefined;

  if (expectedRoles) {
    const rolesArray = Array.isArray(expectedRoles) ? expectedRoles : [expectedRoles];
    
    // Récupérer le rôle brut de l'utilisateur (ex: "DOCTORANT")
    const currentUser = authService.getCurrentUser();
    const rawRole = currentUser && currentUser.role ? currentUser.role.toUpperCase() : '';

    // Normaliser le rôle utilisateur pour qu'il matche ceux des routes
    let normalizedUserRole = rawRole;
    
    if (rawRole === 'DOCTORANT') normalizedUserRole = 'ROLE_DOCTORANT';
    else if (rawRole === 'DIRECTEUR_THESE' || rawRole === 'ENCADRANT') normalizedUserRole = 'ROLE_ENCADRANT';
    else if (rawRole === 'PERSONNEL_ADMIN' || rawRole === 'ADMIN') normalizedUserRole = 'ROLE_ADMINISTRATIF';
    
    // Vérifier la correspondance
    if (!rolesArray.includes(normalizedUserRole)) {
      console.warn(`Accès refusé. Rôle utilisateur: ${normalizedUserRole} (brut: ${rawRole}), Attendu: ${rolesArray}`);
      // Optionnel : Rediriger vers une page "403 Forbidden" ou Dashboard par défaut
      // Pour l'instant, retour au login pour éviter une page blanche
      router.navigate(['/login']); 
      return false;
    }
  }

  return true;
};