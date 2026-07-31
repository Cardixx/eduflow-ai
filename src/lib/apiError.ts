import axios from "axios";

interface ApiErrorPayload {
  message?: string;
  validationErrors?: Record<string, string>;
}

export function getApiErrorMessage(error: unknown, fallback = "Une erreur est survenue") {
  if (axios.isAxiosError<ApiErrorPayload>(error)) {
    const validationErrors = error.response?.data?.validationErrors;
    if (validationErrors) {
      const firstValidationError = Object.values(validationErrors)[0];
      if (firstValidationError) return firstValidationError;
    }

    const message = error.response?.data?.message;
    if (message) return message;

    if (error.response?.status === 403) {
      return "Accès refusé : vous n'avez pas les autorisations nécessaires.";
    }
    if (error.response?.status === 401) {
      return "Session expirée ou non autorisée. Veuillez vous reconnecter.";
    }
  }

  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

