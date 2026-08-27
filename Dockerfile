# Multi-stage Dockerfile for Single-Container Deployment on Render
# Stage 1: Build React Frontend
FROM node:20-alpine AS builder

WORKDIR /frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# Stage 2: Python FastAPI Backend + Serving Built Frontend
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend files
COPY backend/ .

# Copy built frontend assets into backend/static for single-terminal serving
COPY --from=builder /frontend/dist /app/static

# Create data directory for SQLite database storage
RUN mkdir -p /app/data /app/uploads

ENV DATABASE_URL="sqlite:////app/data/app.db"
ENV PORT=8000

EXPOSE 8000

# Run FastAPI app with Uvicorn on 0.0.0.0
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
