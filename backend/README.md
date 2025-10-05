# Game Database Backend API

A modern Node.js backend server built with NestJS framework and MongoDB database, featuring TypeScript, Swagger documentation, and comprehensive API functionality for managing video game data.

## Features

- **NestJS Framework** - Scalable Node.js server-side applications
- **MongoDB Integration** - Using Mongoose ODM for database operations
- **TypeScript** - Full TypeScript support with type safety
- **Swagger Documentation** - Interactive API documentation
- **Validation** - Request validation with class-validator
- **CORS Support** - Cross-origin resource sharing enabled
- **Modular Architecture** - Clean separation of concerns
- **Error Handling** - Comprehensive error handling middleware
- **RAWG API Integration** - External game data source integration

## Project Structure

```
backend/
├── src/
│   ├── achievement/          # Achievement module
│   │   ├── achievement.controller.ts
│   │   ├── achievement.module.ts
│   │   ├── achievement.schema.ts
│   │   └── achievement.service.ts
│   ├── entity-base/          # Base entity module
│   │   ├── entity-base.controller.ts
│   │   ├── entity-base.module.ts
│   │   ├── entity-base.schema.ts
│   │   └── entity-base.service.ts
│   ├── game/                 # Game module
│   │   ├── dto/              # Data Transfer Objects
│   │   │   └── create-game.dto.ts
│   │   ├── schema/           # MongoDB schemas
│   │   │   └── game.schema.ts
│   │   ├── game.controller.ts
│   │   ├── game.module.ts
│   │   └── game.service.ts
│   ├── rawg/                 # RAWG API integration
│   │   ├── rawg.controller.ts
│   │   ├── rawg.module.ts
│   │   └── rawg.service.ts
│   ├── screenshot/           # Screenshot module
│   │   ├── screenshot.controller.ts
│   │   ├── screenshot.module.ts
│   │   ├── screenshot.schema.ts
│   │   └── screenshot.service.ts
│   ├── trailer/              # Trailer module
│   │   ├── trailer.controller.ts
│   │   ├── trailer.module.ts
│   │   ├── trailer.schema.ts
│   │   └── trailer.service.ts
│   ├── app.controller.ts     # Main app controller
│   ├── app.service.ts        # Main app service
│   ├── app.module.ts         # Root module
│   ├── enum.ts               # Global enumerations
│   └── main.ts               # Application entry point
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── .gitignore                # Git ignore file
├── .npmignore                # npm publish ignore file
├── .dockerignore             # Docker build ignore file
└── README.md                 # This file
```

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Setup Instructions

1. **Install dependencies:**

   ```bash
   cd backend
   npm install
   ```

2. **Set up MongoDB:**
   - Install MongoDB locally or use MongoDB Atlas
   - Start MongoDB service: `mongod`
   - Default connection: `mongodb://localhost:27017/demo`

3. **Create environment file:**
   Create a `.env` file in the backend directory:

   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/demo
   NODE_ENV=development
   ```

4. **Start the application:**

   ```bash
   # Development mode (with auto-restart)
   npm run start:dev

   # Production mode
   npm run build
   npm run start:prod
   ```

5. **Verify the application:**
   - API: `http://localhost:3000`
   - Swagger Documentation: `http://localhost:3000/api`
   - Health Check: `http://localhost:3000/health`

## API Endpoints

### Base Routes

- `GET /` - Welcome message
- `GET /health` - Health check (if configured)

### Games API (`/game`)

- `POST /game/upsert` - Fetch and upsert games from RAWG API
- `GET /game/get-game/:id` - Get game by ID

### RAWG API (`/rawg`)

- Integration with RAWG external API for game data

### Achievements API (`/achievement`)

- Endpoints for managing game achievements

### Trailers API (`/trailer`)

- Endpoints for managing game trailers

### Screenshots API (`/screenshot`)

- Endpoints for managing game screenshots

## Example API Usage

### Upsert games from RAWG

```bash
curl -X POST http://localhost:3000/game/upsert
```

### Get game by ID

```bash
curl http://localhost:3000/game/get-game/GAME_ID
```

## Database Schema

### Game Schema

```typescript
{
  id: number(required, unique);
  name: string(required);
  slug: string(required);
  description: string;
  released: Date;
  background_image: string;
  rating: number;
  metacritic: number;
  playtime: number;
  platforms: Array;
  genres: Array;
  tags: Array;
  esrb_rating: Object;
  developers: Array;
  publishers: Array;
  screenshots: Array;
  trailers: Array;
  achievements: Array;
  createdAt: Date(auto - generated);
  updatedAt: Date(auto - generated);
}
```

### Achievement Schema

```typescript
{
  id: number (required)
  name: string (required)
  description: string
  image: string
  percent: number
  gameId: ObjectId (references Game)
}
```

### Trailer Schema

```typescript
{
  id: number (required)
  name: string
  preview: string
  data: Object
  gameId: ObjectId (references Game)
}
```

### Screenshot Schema

```typescript
{
  id: number (required)
  image: string
  gameId: ObjectId (references Game)
}
```

## Available Scripts

- `npm run start:dev` - Start in development mode with watch
- `npm run start:debug` - Start in debug mode
- `npm run start:prod` - Start in production mode
- `npm run build` - Build the application
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:cov` - Run tests with coverage
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Dependencies

### Core Dependencies

- **@nestjs/common** - NestJS common utilities
- **@nestjs/core** - NestJS core framework
- **@nestjs/mongoose** - MongoDB integration for NestJS
- **@nestjs/platform-express** - Express platform for NestJS
- **@nestjs/swagger** - Swagger documentation
- **mongoose** - MongoDB object modeling
- **class-validator** - Validation decorators
- **class-transformer** - Object transformation

### Development Dependencies

- **@nestjs/cli** - NestJS command line interface
- **typescript** - TypeScript compiler
- **jest** - Testing framework
- **eslint** - Code linting
- **prettier** - Code formatting

## Environment Variables

- `PORT` - Server port (default: 3000)
- `MONGODB_URI` - MongoDB connection string
- `NODE_ENV` - Environment mode (development/production)

## Version Control & Deployment

### Ignore Files

The project includes several ignore files to ensure proper version control and deployment:

#### .gitignore

Contains patterns for files that should be excluded from version control:

- Build outputs (`/dist/`, `/build/`)
- Dependencies (`node_modules/`)
- Environment variables (`.env`)
- IDE settings
- Logs and temporary files

#### .npmignore

Specifies files that should be excluded when publishing to npm:

- Source files (only built files should be published)
- Test files
- Configuration files
- Documentation

#### .dockerignore

Excludes unnecessary files from Docker build context:

- Version control files
- Dependencies (will be installed during build)
- Environment files
- Development and test files

### Contribution Guidelines

1. **Fork the repository**
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Run tests**:
   ```bash
   npm run test
   ```
5. **Format code**:
   ```bash
   npm run format
   ```
6. **Submit a pull request**

## Next Steps

This is a solid foundation. You can extend it by adding:

- **Authentication & Authorization** (JWT, Passport)
- **File Upload** (Multer)
- **Caching** (Redis)
- **Rate Limiting**
- **Database Migrations**
- **Unit & E2E Tests**
- **Docker Configuration**
- **CI/CD Pipeline**
- **Monitoring & Logging**
- **API Versioning**
