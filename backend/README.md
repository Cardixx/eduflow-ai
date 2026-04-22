# EMIT Feedback Platform Backend

Backend Spring Boot pour la plateforme de feedback et d'analyse de sentiment.

## Stack

- Java 17+
- Spring Boot 3.5.13
- Spring Security + JWT
- Spring Data JPA
- PostgreSQL
- Swagger / OpenAPI

## Lancement

1. Créer la base PostgreSQL `feedback_db`.
2. Adapter `src/main/resources/application.properties` si besoin.
3. Lancer:

```bash
mvn spring-boot:run
```

## URLs

- API: `http://localhost:8080/api`
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/api-docs`

## Comptes seedés

- Enseignant:
  - email: `teacher@emit.mg`
  - mot de passe: `password`

Les rôles `ADMIN`, `ETUDIANT`, `ENSEIGNANT` sont créés automatiquement au démarrage.

## Modules exposés

- `/api/auth`
- `/api/academic`
- `/api/students`
- `/api/teachers`
- `/api/feedbacks`
- `/api/notifications`
- `/api/reports`
