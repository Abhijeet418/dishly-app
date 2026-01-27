# Dishly Frontend

Modern, sleek recipe manager built with Next.js and Tailwind CSS.

## Features

- User authentication (register/login)
- Create, edit, and delete recipes
- Browse public recipes
- Save recipes to collections
- Generate shopping lists
- Rate recipes
- Responsive design with modern UI

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Backend API running on http://localhost:8080

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser and navigate to
http://localhost:3000
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Docker

```bash
# Build Docker image
docker build -t dishly-frontend .

# Run container
docker run -p 3000:3000 -e NEXT_PUBLIC_API_BASE_URL=<your-api-url> dishly-frontend
```

## Project Structure

```
src/
├── app/                    # Next.js app directory
├── components/            # Reusable components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── services/             # API services
├── store/                # Zustand state management
└── types/                # TypeScript type definitions
```

## Color Scheme

- **Primary (Red)**: #DC2626 (60%)
- **Accent (Gold)**: #F59E0B (20%)
- **Background (White)**: #FFFFFF (20%)
- **Dark**: #1F2937

## Technologies

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Zustand (State Management)
- Axios (HTTP Client)
- Framer Motion (Animations)
- Lucide React (Icons)
