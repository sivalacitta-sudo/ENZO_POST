# Personal Blog CMS

A full-stack personal blog content management system built with Vue3, NestJS, and TypeORM. Features a clean, minimal design inspired by Mintlify's design system.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Vue3 + Vite + TailwindCSS + Pinia |
| Backend | NestJS + TypeScript |
| Database | SQLite (dev) / MySQL (prod) via TypeORM |
| Auth | JWT + bcrypt |
| Deployment | Docker + docker-compose + Nginx |

## Features

- **User System**: Registration, login (JWT, 7-day expiry), role-based access (admin/user)
- **Post Management**: Create, edit, delete posts with Markdown editor, draft/publish status, tags, view count
- **Comment System**: Logged-in users can comment, admins can delete any comment
- **Tag System**: Multi-tag support for posts, tag-based filtering
- **Role-Based UI**: Different panels for admin and regular users

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Docker & Docker Compose (for production deployment)

### Local Development

#### Backend

```bash
cd server
npm install
npm run start:dev
```

The backend will run on `http://localhost:3000`.

#### Frontend

```bash
cd client
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`.

### Docker Deployment (Production)

#### Option 1: Using Environment Variables

```bash
# Copy production environment file
cp .env.production .env

# Edit .env and set strong passwords
nano .env

# Start all services (MySQL, Backend, Frontend, Nginx)
docker-compose up -d
```

Access the application at `http://localhost` (port 80).

#### Option 2: Direct Docker Compose

```bash
# Build and start all services
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

**Services included:**
- **MySQL** (port 3306): Production database
- **Backend** (internal port 3000): NestJS API server
- **Frontend** (internal): Vue3 static files served by Nginx
- **Nginx** (port 80): Reverse proxy and static file server

**Architecture:**
```
Client → Nginx (port 80) → Frontend (static files)
                      → Backend API (/api/* → server:3000)
Backend → MySQL (database)
```

## API Overview

All API responses follow the unified format: `{ code: number, message: string, data: any }`

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login and get JWT token | No |

### Posts

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/posts` | Get published posts (paginated) | No |
| GET | `/api/posts/:slug` | Get post by slug (increments view count) | No |
| POST | `/api/posts` | Create a new post | Any logged-in user |
| PATCH | `/api/posts/:id` | Update a post | Author or Admin |
| DELETE | `/api/posts/:id` | Delete a post | Author or Admin |
| GET | `/api/posts/my/posts` | Get current user's posts | Any logged-in user |
| GET | `/api/posts/admin/all` | Get all posts (admin view) | Admin only |

### Tags

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/tags` | Get all tags with post count | No |
| GET | `/api/tags/:slug` | Get tag by slug with posts | No |
| POST | `/api/tags` | Create a new tag | Admin only |
| DELETE | `/api/tags/:id` | Delete a tag | Admin only |

### Comments

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/comments?postId=1` | Get comments for a post | No |
| GET | `/api/comments` | Get all comments | No |
| POST | `/api/comments` | Create a comment | Any logged-in user |
| DELETE | `/api/comments/:id` | Delete a comment | Admin only |

### Users

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users/me` | Get current user profile | Yes |
| PATCH | `/api/users/profile` | Update user profile | Yes |

## Default Admin Account

After first startup, use these credentials to log in as admin:

```
Username: admin
Password: admin123456
```

**Important**: Change the admin password after first login!

## Project Structure

```
blog-cms/
├── client/                 # Vue3 frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── views/          # Page components
│   │   ├── layouts/        # Layout wrappers
│   │   ├── stores/         # Pinia state management
│   │   ├── services/       # API service layer
│   │   ├── router/         # Vue Router configuration
│   │   └── styles/         # Global styles
│   ├── Dockerfile          # Frontend container config
│   └── ...
├── server/                 # NestJS backend
│   ├── src/
│   │   ├── modules/        # Feature modules
│   │   ├── entities/       # TypeORM entities
│   │   ├── config/         # Configuration files
│   │   ├── common/         # Shared utilities
│   │   └── ...
│   ├── Dockerfile          # Backend container config
│   └── ...
├── nginx/                  # Nginx configuration
│   └── nginx.conf          # Reverse proxy config
├── docker-compose.yml      # Docker orchestration
├── .env.example            # Environment template
├── .env.production         # Production config example
└── README.md
```

## Permission System

### Regular User (user)
- ✅ Register and login
- ✅ Create posts
- ✅ Edit own posts
- ✅ Delete own posts
- ✅ Comment on any post
- ✅ View public posts

### Administrator (admin)
- ✅ All regular user permissions
- ✅ View all posts (admin panel)
- ✅ Manage tags (create/delete)
- ✅ Delete any post
- ✅ Delete any comment
- ✅ Access Comments Management page

## Design System

This project follows the Mintlify design system:

- **Colors**: White background (`#ffffff`), near-black text (`#0d0d0d`), mint green accent (`#18E299`)
- **Typography**: Inter font family, negative letter-spacing for headings
- **Borders**: Subtle `rgba(0,0,0,0.05)` borders instead of heavy shadows
- **Radius**: Full pill buttons (`9999px`), cards (`16px`), large cards (`24px`)

## Environment Variables

See `.env.example` and `.env.production` for available configuration options:

```env
# Database Configuration
DB_TYPE=mysql              # sqlite for dev, mysql for prod
DB_HOST=mysql              # localhost for dev, mysql for docker
DB_PORT=3306
DB_USERNAME=blog_user
DB_PASSWORD=your-password
DB_DATABASE=blog_cms

# JWT Configuration
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Application Configuration
PORT=3000
FRONTEND_URL=http://localhost
NODE_ENV=production
```

## Troubleshooting

### Docker Issues

```bash
# Rebuild containers
docker-compose up --build -d

# View logs
docker-compose logs -f

# Check container status
docker-compose ps

# Reset database (WARNING: deletes all data)
docker-compose down -v
docker-compose up -d
```

### Database Connection Issues

If using MySQL, ensure the database service is healthy:

```bash
docker-compose logs mysql
```
