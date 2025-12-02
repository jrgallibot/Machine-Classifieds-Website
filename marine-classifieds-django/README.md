# Marine Classifieds - Django Backend

This is an alternative Django backend implementation for the Marine Classifieds Website.

## 🛠 Tech Stack

- **Django 4.2+** - Web framework
- **Django REST Framework** - API framework
- **PostgreSQL** - Database
- **Django Channels** - WebSocket support for real-time messaging
- **Celery** - Background task processing
- **Redis** - Caching and message broker
- **Stripe** - Payment processing
- **AWS S3** - File storage
- **Django CORS Headers** - Cross-origin resource sharing

## 📦 Installation

### Prerequisites
- Python 3.9+
- PostgreSQL
- Redis
- Virtual environment

### 1. Create virtual environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Environment setup
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 4. Database setup
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```

### 5. Run development server
```bash
python manage.py runserver
```

## 🔧 Environment Variables (.env)

```env
DEBUG=True
SECRET_KEY=your_django_secret_key_here
DATABASE_URL=postgresql://username:password@localhost:5432/marine_classifieds
REDIS_URL=redis://localhost:6379/0

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_STORAGE_BUCKET_NAME=marine-classifieds-images
AWS_S3_REGION_NAME=us-east-1

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=your_app_password
```

## 🚀 Running the Application

### Development
```bash
# Terminal 1: Django server
python manage.py runserver

# Terminal 2: Celery worker
celery -A marine_classifieds worker -l info

# Terminal 3: Redis (if not running as service)
redis-server
```

### Production
```bash
# Collect static files
python manage.py collectstatic

# Run with Gunicorn
gunicorn marine_classifieds.wsgi:application

# Run Celery worker
celery -A marine_classifieds worker -l info

# Run Celery beat (for scheduled tasks)
celery -A marine_classifieds beat -l info
```

## 📁 Project Structure

```
marine-classifieds-django/
├── manage.py
├── requirements.txt
├── marine_classifieds/          # Main project settings
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── apps/
│   ├── users/                   # User management
│   ├── listings/                # Ad listings
│   ├── payments/                # Payment processing
│   ├── messaging/               # User messaging
│   └── analytics/               # Admin analytics
├── templates/                   # HTML templates
├── static/                      # Static files
└── media/                       # User uploaded files
```

## 🔐 Authentication

Django's built-in authentication system with JWT tokens:
- User registration and login
- Password reset functionality
- Email verification
- Social authentication (Google, Facebook)

## 💳 Payment Integration

Stripe integration with Django:
- Payment intent creation
- Webhook handling
- Payment history tracking
- Subscription management

## 📸 File Upload

AWS S3 integration with Django:
- Automatic file upload to S3
- Image optimization
- Secure file access
- CDN integration

## 🧪 Testing

```bash
# Run all tests
python manage.py test

# Run specific app tests
python manage.py test apps.listings

# Run with coverage
coverage run --source='.' manage.py test
coverage report
```

## 📦 Deployment

### Using Docker
```bash
# Build and run with Docker Compose
docker-compose up --build
```

### Manual Deployment
1. Set up production database
2. Configure environment variables
3. Run migrations
4. Collect static files
5. Set up reverse proxy (Nginx)
6. Configure SSL certificates

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `POST /api/auth/refresh/` - Refresh JWT token

### Listings
- `GET /api/listings/` - Get all listings
- `POST /api/listings/` - Create new listing
- `GET /api/listings/{id}/` - Get specific listing
- `PUT /api/listings/{id}/` - Update listing
- `DELETE /api/listings/{id}/` - Delete listing

### Payments
- `POST /api/payments/create/` - Create payment intent
- `GET /api/payments/history/` - Get payment history
- `POST /api/payments/webhook/` - Stripe webhook

### Users
- `GET /api/users/profile/` - Get user profile
- `PUT /api/users/profile/` - Update user profile
- `GET /api/users/listings/` - Get user's listings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. 