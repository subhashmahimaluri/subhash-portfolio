# Subhash Portfolio
A collection of projects showcasing Subhash's work and skills.

## Getting Started

To set up the project locally, follow these steps:

### Prerequisites
- Node.js version 20 or higher
- npm (Node Package Manager)

### Local Setup
1. Clone the repository:
   ```bash
   git clone [your-repo-url]
   cd subhash-portfolio
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a local environment file by copying the example:
   ```bash
   cp .env.local.example .env.local
   ```
4. Fill in the values for `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_SITE_NAME` in your new `.env.local` file.

### Run Commands

| Command           | Description                                    |
| :---------------- | :--------------------------------------------- |
| `npm run dev`     | Starts the development server on port 3005     |
| `npm run build`   | Builds the application for production          |
| `npm run start`   | Starts the production server on port 3005      |
| `npm run lint`    | Runs ESLint to check for code style issues     |
| `npm run type-check` | Runs TypeScript compiler for type validation |
| `npm run test`    | Runs unit tests with Vitest                    |
| `npm run test:watch` | Runs Vitest in watch mode                      |
| `npm run test:e2e` | Runs end-to-end tests with Playwright          |

### Docker
To run the application using Docker:
```bash
docker compose up
```

### Port Information
The development and production servers run on port `3005` by default.
