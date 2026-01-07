# College Placement Prediction Web Application

## Overview

This is a full-stack College Placement Prediction web application that uses machine learning to predict whether a student will be placed based on their academic and skill profile. The application features a modern dark neon theme with smooth animations, built using React on the frontend and Express on the backend, with a PostgreSQL database for storing prediction history.

The core functionality allows students to input their CGPA, internship count, project count, skill level, and communication score to receive a placement probability prediction along with personalized recommendations and a career roadmap.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with custom dark neon theme
- **UI Components**: shadcn/ui component library (Radix UI primitives)
- **Animations**: Framer Motion for page transitions and micro-interactions
- **Charts**: Recharts for data visualization (feature importance, radar charts)
- **Build Tool**: Vite with HMR support

The frontend follows a component-based architecture with custom hooks for data fetching (`use-predictions.ts`) and reusable input components (`InputSlider`, `InputNumber`).

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful endpoints with Zod schema validation
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Session Management**: connect-pg-simple for PostgreSQL-backed sessions

The backend implements a simple prediction API that loads pre-trained model weights from a JSON file and performs logistic regression inference in JavaScript.

### Machine Learning Component
- **Training**: Python with scikit-learn (Logistic Regression)
- **Model Storage**: Exported as JSON with coefficients, intercept, and accuracy
- **Inference**: JavaScript implementation of logistic regression using stored weights

The model predicts placement probability based on 5 features: CGPA, internships, projects, skill level, and communication score.

### Data Flow
1. User inputs profile data via React form
2. Frontend sends POST request to `/api/predict`
3. Backend validates input with Zod, runs ML inference
4. Prediction result stored in PostgreSQL via Drizzle
5. Response includes probability, confidence level, recommendations, and roadmap
6. Frontend displays animated results with charts

### Shared Types
The `/shared` directory contains schemas and route definitions used by both frontend and backend, ensuring type safety across the full stack.

## External Dependencies

### Database
- **PostgreSQL**: Primary database accessed via `DATABASE_URL` environment variable
- **Drizzle ORM**: Schema defined in `shared/schema.ts`, migrations in `/migrations`

### Third-Party Libraries
- **Radix UI**: Accessible UI primitives (dialogs, dropdowns, sliders, etc.)
- **TanStack Query**: Server state management and caching
- **Framer Motion**: Animation library
- **Recharts**: React charting library
- **Zod**: Runtime type validation
- **date-fns**: Date utility library

### Development Tools
- **Vite**: Development server and build tool
- **Drizzle Kit**: Database migration tooling
- **TypeScript**: Static type checking
- **PostCSS/Autoprefixer**: CSS processing

### Python Dependencies (for model training)
- pandas, numpy, scikit-learn for ML pipeline
- Model weights exported to `model/model.json`