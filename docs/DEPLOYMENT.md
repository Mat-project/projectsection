# Deployment Guide

## Prerequisites

1. A web server (Nginx or Apache)
2. Python 3.9+ for backend
3. Node.js 16+ for frontend
4. PostgreSQL database
5. Email service credentials 
6. Google OAuth client ID and secret

## Backend Deployment

### 1. Prepare Environment

```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and set all required variables:

