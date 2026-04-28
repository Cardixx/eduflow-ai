# Welcome to your Lovable project

TODO: Document your project here

## Notes about mock data and backend connection

- The previous local mock data file `src/lib/mockData.ts` has been deprecated and removed. The frontend now calls the real backend API.
- Configure the frontend API base URL using the environment variable `VITE_API_URL`. Example in development:

	VITE_API_URL=http://localhost:8080/api

- The backend by default runs on port 8080 (see `backend/src/main/resources/application.properties`). CORS is configured to accept requests from any origin.

If you need temporary mock responses during development, implement them in your components or set up MSW (Mock Service Worker) rather than relying on the old shared `mockData.ts`.
