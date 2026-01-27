# Sensitive Keys Conversion Guide

All sensitive keys and credentials have been converted to placeholders. This document tracks what was replaced.

## Backend Configuration Files

### `backend/src/main/resources/application.properties`
**Original values replaced with placeholders:**

| Key | Original Type | Placeholder | Location |
|-----|---------------|------------|----------|
| `spring.data.mongodb.uri` | MongoDB Atlas Connection String | `YOUR_MONGODB_URI` | Line 5 |
| `jwt.secret` | Base64-encoded JWT Secret | `YOUR_JWT_SECRET` | Line 9 |
| `cors.allowed-origins` | Comma-separated CORS URLs | `YOUR_ALLOWED_ORIGINS` | Line 36 |

**How to restore:**
1. Set `spring.data.mongodb.uri` to your MongoDB Atlas connection string
2. Set `jwt.secret` to your base64-encoded JWT secret key
3. Set `cors.allowed-origins` to your allowed origin URLs (comma-separated)

### `backend/src/main/resources/application-prod.properties`
**Status:** Already using environment variables (secure)
- `spring.data.mongodb.uri=${SPRING_DATA_MONGODB_URI}` ✓
- `jwt.secret=${JWT_SECRET}` ✓
- `cors.allowed-origins=https://dish-ly.vercel.app` (Consider updating to placeholder if needed)

## Frontend Configuration Files

### `frontend/src/app/api/upload/route.ts`
**Environment variables that need values:**
- `process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
- `process.env.CLOUDINARY_API_KEY` - Your Cloudinary API key
- `process.env.CLOUDINARY_API_SECRET` - Your Cloudinary API secret

### `frontend/next.config.js`
**Environment variables that need values:**
- `process.env.NEXT_PUBLIC_API_BASE_URL` - Backend API base URL (defaults to `http://localhost:8080/api`)

## How to Set Up Environment Variables

### Development Environment

Create a `.env.local` file in the `frontend/` directory:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

For the backend, create `backend/src/main/resources/application-local.properties`:
```
spring.data.mongodb.uri=mongodb+srv://username:password@cluster.mongodb.net/database
jwt.secret=your_base64_encoded_secret
cors.allowed-origins=http://localhost:3000,http://localhost:5173
```

### Production Environment

Set environment variables in your deployment platform:

**Render (for backend):**
- `SPRING_DATA_MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRATION`
- `PORT`

**Vercel (for frontend):**
- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

## Security Checklist

- ✅ Sensitive data removed from version control
- ✅ All credentials converted to environment variable placeholders
- ✅ Production configuration uses environment variables
- ⚠️ Ensure `.env*` files are in `.gitignore`
- ⚠️ Never commit actual secrets to the repository
- ⚠️ Rotate secrets if they were previously exposed

## Files to Review

Ensure these files contain placeholders or environment variables (not actual secrets):
1. `backend/src/main/resources/application.properties` ✓
2. `backend/src/main/resources/application-prod.properties` ✓
3. `frontend/src/app/api/upload/route.ts` - Uses env vars ✓
4. `frontend/next.config.js` - Uses env vars ✓
