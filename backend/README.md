# Mirsarai General Hospital - Backend API

Production-ready backend boilerplate built with **Node.js**, **Express.js**, and **MongoDB** following **MVC Architecture** with a **Service Layer**.

## 🚀 Features

- ✅ Clean MVC Architecture with Service Layer
- ✅ ES Modules (import/export)
- ✅ MongoDB with Mongoose
- ✅ JWT Authentication
- ✅ Role-based Authorization
- ✅ Request Validation with Zod
- ✅ Global Error Handling
- ✅ Rate Limiting
- ✅ Security Headers (Helmet)
- ✅ CORS Configured
- ✅ Compression
- ✅ Morgan Logging
- ✅ Environment Validation
- ✅ Standardized API Responses
- ✅ Async Error Handling
- ✅ Graceful Shutdown

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js       # MongoDB connection
│   │   └── env.js             # Environment validation
│   ├── controllers/           # Request handlers (to be added)
│   ├── services/              # Business logic (to be added)
│   ├── models/                # Mongoose schemas (to be added)
│   ├── routes/
│   │   └── index.js           # API routes
│   ├── middlewares/
│   │   ├── auth.middleware.js        # JWT authentication
│   │   ├── error.middleware.js       # Global error handler
│   │   └── validate.middleware.js    # Request validation
│   ├── validators/            # Zod schemas (to be added)
│   ├── utils/
│   │   ├── ApiError.js        # Custom error class
│   │   ├── ApiResponse.js     # Response helpers
│   │   └── catchAsync.js      # Async wrapper
│   ├── constants/
│   │   └── index.js           # App constants
│   └── app.js                 # Express app setup
├── server.js                  # Server entry point
├── .env.example               # Environment template
├── .gitignore
├── package.json
└── README.md
```

## 🛠️ Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create `.env` file from the example:

```bash
cp .env.example .env
```

Update the following variables in `.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/mirsarai_hospital
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

### 3. Start MongoDB

Make sure MongoDB is running locally or update `MONGODB_URI` with your MongoDB Atlas connection string.

### 4. Run the Server

**Development mode** (with auto-reload):

```bash
npm run dev
```

**Production mode**:

```bash
npm start
```

## 📡 API Endpoints

### Health Check

```http
GET /api/v1/health
```

**Response:**
```json
{
  "success": true,
  "message": "API is running",
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "uptime": 123.456,
    "environment": "development",
    "version": "1.0.0"
  }
}
```

### Test Endpoint

```http
GET /api/v1/test
```

### Root

```http
GET /api/v1
```

## 🏗️ Architecture

### MVC + Service Layer

```
Request → Route → Controller → Service → Model → Database
                                    ↓
Response ← Controller ← Service ←  Data
```

**Controllers**: Handle HTTP requests/responses
**Services**: Contain business logic
**Models**: Define database schemas
**Routes**: Define API endpoints
**Middlewares**: Handle cross-cutting concerns

## 🔒 Security

- **Helmet**: Sets security HTTP headers
- **Rate Limiting**: Prevents abuse
- **CORS**: Configured for specific origins
- **JWT**: Secure authentication
- **Password Hashing**: bcrypt
- **Input Validation**: Zod schemas
- **Environment Variables**: Protected sensitive data

## 🧪 Adding New Modules

### 1. Create Model (`src/models/user.model.js`)

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
```

### 2. Create Service (`src/services/user.service.js`)

```javascript
import User from '../models/user.model.js';

export const getAllUsers = async () => {
  return await User.find();
};
```

### 3. Create Controller (`src/controllers/user.controller.js`)

```javascript
import catchAsync from '../utils/catchAsync.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import * as UserService from '../services/user.service.js';

export const getUsers = catchAsync(async (req, res) => {
  const users = await UserService.getAllUsers();
  sendSuccess(res, 200, users, 'Users fetched successfully');
});
```

### 4. Create Validator (`src/validators/user.validator.js`)

```javascript
import { z } from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    email: z.string().email(),
  }),
});
```

### 5. Create Routes (`src/routes/user.routes.js`)

```javascript
import express from 'express';
import * as userController from '../controllers/user.controller.js';
import validate from '../middlewares/validate.middleware.js';
import { createUserSchema } from '../validators/user.validator.js';

const router = express.Router();

router.get('/', userController.getUsers);
router.post('/', validate(createUserSchema), userController.createUser);

export default router;
```

### 6. Register Routes (`src/routes/index.js`)

```javascript
import userRoutes from './user.routes.js';
router.use('/users', userRoutes);
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `MONGODB_URI` | MongoDB connection string | Required |
| `JWT_SECRET` | JWT signing secret (min 32 chars) | Required |
| `JWT_EXPIRES_IN` | Token expiration | `7d` |
| `CLIENT_URL` | Frontend URL | `http://localhost:3000` |

## 🤝 Contributing

1. Follow MVC + Service Layer architecture
2. Keep business logic in services
3. Use `catchAsync` for async controllers
4. Validate all inputs with Zod
5. Use standardized responses (`sendSuccess`, `sendError`)
6. Handle errors properly
7. Write clean, readable code

## 📄 License

MIT

---

**Built with ❤️ for Mirsarai General Hospital**
