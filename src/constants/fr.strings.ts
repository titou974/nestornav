/**
 * Fichier de constantes pour les textes en français
 * Centralise tous les textes de l'application pour faciliter la maintenance
 */

export const FR_STRINGS = {
  // Actions de pointage
  actions: {
    start: {
      label: "Début",
      description: "Commencer la journée",
    },
    resume: {
      label: "Reprendre",
      description: "Reprendre",
    },
    pause: {
      label: "Pause",
      description: "Faire une pause",
    },
    end: {
      label: "Fin",
      description: "Terminer la journée",
    },
  },

  // Messages de succès
  success: {
    title: "C'est bien noté",
    description: "Pour réeffectuer une action, scannez le QR code.",
  },

  // Messages d'erreur
  error: {
    title: "Erreur",
    generic: "Une erreur est survenue",
    createEmployee: "Erreur lors de la création du collaborateur",
    invalidToken: "Token invalide ou expiré",
  },

  // Formulaire de pointage
  pointageForm: {
    title: "Que voulez-vous indiquer ?",
    lastAction: "Dernière action :",
    lastActionAt: "le",
    selectEmployee: "Sélectionnez votre nom",
    selectEmployeeDescription: "Choisissez votre nom dans la liste",
    selectEmployeePlaceholder: "Sélectionnez un employé",
    employee: "Employé",
    employees: "Employés",
    selectAction: "Choisissez l'action que vous souhaitez effectuer",
    newCollaborator: "+ Nouveau collaborateur",
    loading: "Chargement...",
  },

  // Formulaire de création d'employé
  createEmployee: {
    title: "Nouveau collaborateur",
    description: "Remplissez vos informations pour créer votre profil",
    firstName: "Prénom",
    firstNamePlaceholder: "Votre prénom",
    firstNameRequired: "Le prénom est requis",
    lastName: "Nom",
    lastNamePlaceholder: "Votre nom",
    lastNameRequired: "Le nom est requis",
    cancel: "Annuler",
    create: "Créer mon profil",
  },

  // Actions de pointage (traduction des valeurs)
  actionLabels: {
    START: "Début",
    PAUSE: "Pause",
    END: "Fin",
  },
} as const;

export type FRStrings = typeof FR_STRINGS;
