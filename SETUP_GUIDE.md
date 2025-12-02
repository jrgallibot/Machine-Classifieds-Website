# Marine Classifieds Website - Complete Setup Guide

This guide will walk you through setting up and running the Marine Classifieds Website with both frontend and backend components.

## 🎯 Project Overview

The Marine Classifieds Website is a full-stack application with:
- **Frontend**: Next.js with Material-UI and TypeScript
- **Backend**: Node.js with Express and TypeORM (or Django alternative)
- **Database**: PostgreSQL
- **Payments**: Stripe integration
- **File Storage**: AWS S3
- **Authentication**: JWT tokens

## 📋 Prerequisites

Before starting, ensure you have the following installed:

### Required Software
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **PostgreSQL 12+** - [Download here](https://www.postgresql.org/download/)
- **Git** - [Download here](https://git-scm.com/)

### Optional (for Django backend)
- **Python 3.9+** - [Download here](https://www.python.org/downloads/)
- **Redis** - [Download here](https://redis.io/download)

### Services (Free tiers available)
- **Stripe Account** - [Sign up here](https://stripe.com/)
- **AWS Account** - [Sign up here](https://aws.amazon.com/)
- **PostgreSQL Database** - Use [Supabase](https://supabase.com/) (free tier) or local installation

## 🚀 Quick Start (Node.js Backend)

### Step 1: Clone and Setup

```bash
# Clone the repository
git clone <your-repository-url>
cd Machine-Classifieds-Website

# Install frontend dependencies
cd marine-classifieds
npm install

# Install backend dependencies
cd ../marine-classifieds-backend
npm install
```

### Step 2: Database Setup

```bash
# Create PostgreSQL database
psql -U postgres
CREATE DATABASE marine_classifieds;
\q

# Or use Supabase (recommended for development)
# 1. Go to https://supabase.com
# 2. Create new project
# 3. Get connection string from Settings > Database
```

### Step 3: Environment Configuration

**Frontend (.env.local)**
```bash
cd marine-classifieds
# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000" > .env.local
```

**Backend (.env)**
```bash
cd marine-classifieds-backend
# Create .env file
echo "PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/marine_classifieds
JWT_SECRET=your_jwt_secret_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=marine-classifieds-images" > .env
```

### Step 4: Run the Application

**Terminal 1 - Backend:**
```bash
cd marine-classifieds-backend
npm run dev
# Server will start at http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd marine-classifieds
npm run dev
# Application will start at http://localhost:3000
```

## 🐍 Django Backend Alternative

If you prefer Django over Node.js:

### Step 1: Setup Django Environment

```bash
# Create Django directory
mkdir marine-classifieds-django
cd marine-classifieds-django

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Django and dependencies
pip install django djangorestframework django-cors-headers psycopg2-binary stripe boto3 celery redis
```

### Step 2: Create Django Project

```bash
# Create Django project
django-admin startproject marine_classifieds .

# Create apps
python manage.py startapp users
python manage.py startapp listings
python manage.py startapp payments
python manage.py startapp messaging
```

### Step 3: Configure Django

**settings.py**
```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'users',
    'listings',
    'payments',
    'messaging',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    # ... other middleware
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}
```

### Step 4: Run Django

```bash
# Apply migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run server
python manage.py runserver
# Django will start at http://localhost:8000
```

## 🔧 Configuration Details

### Stripe Setup

1. **Create Stripe Account**
   - Go to [stripe.com](https://stripe.com)
   - Sign up for a free account
   - Get your API keys from Dashboard

2. **Configure Webhooks**
   - Go to Developers > Webhooks
   - Add endpoint: `http://localhost:5000/api/payments/webhook`
   - Select events: `payment_intent.succeeded`
   - Copy webhook secret to your .env file

### AWS S3 Setup

1. **Create S3 Bucket**
   - Go to AWS Console > S3
   - Create bucket: `marine-classifieds-images`
   - Configure CORS for your domain

2. **Create IAM User**
   - Go to IAM > Users
   - Create user with S3 access
   - Get Access Key ID and Secret Access Key

### Database Configuration

**Local PostgreSQL:**
```bash
# Install PostgreSQL
# On macOS: brew install postgresql
# On Ubuntu: sudo apt-get install postgresql postgresql-contrib
# On Windows: Download from postgresql.org

# Start PostgreSQL service
# On macOS: brew services start postgresql
# On Ubuntu: sudo systemctl start postgresql
# On Windows: Start from Services

# Create database
psql -U postgres
CREATE DATABASE marine_classifieds;
CREATE USER marine_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE marine_classifieds TO marine_user;
\q
```

**Supabase (Recommended):**
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Get connection string from Settings > Database
4. Use connection string in your .env file

## 🚀 Running in Production

### Frontend Deployment (Vercel)

1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Deploy**
   ```bash
   cd marine-classifieds
   vercel --prod
   ```

3. **Set Environment Variables**
   - Go to Vercel Dashboard > Project Settings > Environment Variables
   - Add all variables from .env.local

### Backend Deployment (Railway/Heroku)

**Railway:**
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

**Heroku:**
```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create marine-classifieds-backend

# Set environment variables
heroku config:set DATABASE_URL=your_database_url
heroku config:set JWT_SECRET=your_jwt_secret
# ... set other variables

# Deploy
git push heroku main
```

### Database Migration

```bash
# Node.js backend
cd marine-classifieds-backend
npm run typeorm migration:run

# Django backend
cd marine-classifieds-django
python manage.py migrate
```

## 🧪 Testing the Application

### Frontend Testing
```bash
cd marine-classifieds
npm test
```

### Backend Testing
```bash
# Node.js
cd marine-classifieds-backend
npm test

# Django
cd marine-classifieds-django
python manage.py test
```

### Manual Testing Checklist

1. **User Registration/Login**
   - [ ] Register new user
   - [ ] Login with credentials
   - [ ] Access protected routes

2. **Listing Management**
   - [ ] Create new listing
   - [ ] Upload images
   - [ ] Choose payment tier
   - [ ] View listing details

3. **Payment Processing**
   - [ ] Select premium/featured tier
   - [ ] Complete Stripe payment
   - [ ] Verify listing activation

4. **Search and Filtering**
   - [ ] Search listings
   - [ ] Filter by category/price
   - [ ] Sort results

5. **User Dashboard**
   - [ ] View user listings
   - [ ] Edit profile
   - [ ] View payment history

## 🔍 Troubleshooting

### Common Issues

**Frontend won't start:**
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

**Backend connection issues:**
```bash
# Check database connection
psql -U postgres -d marine_classifieds -c "SELECT 1;"

# Check environment variables
echo $DATABASE_URL
```

**Payment issues:**
- Verify Stripe keys are correct
- Check webhook endpoint is accessible
- Ensure webhook secret matches

**File upload issues:**
- Verify AWS credentials
- Check S3 bucket permissions
- Ensure CORS is configured

### Logs and Debugging

**Frontend logs:**
```bash
cd marine-classifieds
npm run dev
# Check browser console and terminal output
```

**Backend logs:**
```bash
cd marine-classifieds-backend
npm run dev
# Check terminal output for errors
```

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review the logs for error messages
3. Verify all environment variables are set correctly
4. Ensure all prerequisites are installed
5. Create an issue in the repository with:
   - Error message
   - Steps to reproduce
   - Environment details

## 🎉 Success!

Once everything is running, you should have:

- ✅ Frontend running on http://localhost:3000
- ✅ Backend API running on http://localhost:5000
- ✅ Database connected and migrated
- ✅ Stripe payments working
- ✅ File uploads to S3 working
- ✅ User authentication working

You can now start using the Marine Classifieds Website! 