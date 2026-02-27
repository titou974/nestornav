export const i18nConfig = {
  defaultLocale: "fr",
  locales: ["fr", "en"],
} as const;

export type Locale = typeof i18nConfig.locales[number];

export const translations = {
  fr: {
    common: {
      loading: "Chargement...",
      error: "Une erreur est survenue",
      save: "Enregistrer",
      cancel: "Annuler",
      delete: "Supprimer",
      edit: "Modifier",
      search: "Rechercher",
    },
  },
  en: {
    common: {
      loading: "Loading...",
      error: "An error occurred",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      search: "Search",
    },
  },
} as const;
