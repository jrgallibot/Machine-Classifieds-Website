# Marine Classifieds Website

A full-stack marine classifieds platform built with Next.js, Node.js, and PostgreSQL. Features include user authentication, ad listing management, payment processing, and admin tools.

## 🚀 Features

### Frontend (Next.js)
- Modern, responsive UI with Material-UI
- User authentication and profile management
- Ad listing creation with payment tiers
- Advanced search and filtering
- User dashboard with listing management
- Mobile-responsive design

### Backend (Node.js + Express)
- RESTful API with TypeScript
- User authentication with JWT
- File upload with AWS S3
- Payment processing with Stripe
- Database management with TypeORM
- Admin tools and analytics

### Payment Tiers
- **Free**: Basic listing for 30 days
- **Premium ($10)**: Enhanced visibility for 60 days
- **Featured ($30)**: Top placement for 90 days

## 🛠 Tech Stack

### Frontend
- Next.js 15 with App Router
- React 19
- Material-UI v7
- TypeScript
- Tailwind CSS v4
- NextAuth.js

### Backend
- Node.js with Express
- TypeScript
- TypeORM with PostgreSQL
- JWT Authentication
- Stripe Payment Processing
- AWS S3 for file storage
- Multer for file uploads

### Database
- PostgreSQL
- TypeORM entities and migrations

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL
- AWS S3 bucket (for image storage)
- Stripe account (for payments)

### 1. Clone the repository
```bash
git clone <repository-url>
cd Machine-Classifieds-Website
```

### 2. Frontend Setup
```bash
cd marine-classifieds

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Edit .env.local with your configuration

# Run development server
npm run dev
```

### 3. Backend Setup
```bash
cd marine-classifieds-backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your configuration

# Run development server
npm run dev
```

## 🔧 Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

### Backend (.env)
```env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/marine_classifieds
JWT_SECRET=your_jwt_secret_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=marine-classifieds-images
```

## 🗄️ Database Setup

1. Create PostgreSQL database:
```sql
CREATE DATABASE marine_classifieds;
```

2. Run TypeORM migrations:
```bash
cd marine-classifieds-backend
npm run typeorm migration:run
```

## 🚀 Running the Application

### Development Mode

**Frontend:**
```bash
cd marine-classifieds
npm run dev
# Access at http://localhost:3000
```

**Backend:**
```bash
cd marine-classifieds-backend
npm run dev
# API available at http://localhost:5000
```

### Production Build

**Frontend:**
```bash
cd marine-classifieds
npm run build
npm start
```

**Backend:**
```bash
cd marine-classifieds-backend
npm run build
npm start
```

## 📁 Project Structure

```
Machine-Classifieds-Website/
├── marine-classifieds/          # Frontend (Next.js)
│   ├── src/
│   │   ├── app/                # App Router pages
│   │   ├── components/         # Reusable components
│   │   ├── hooks/             # Custom hooks
│   │   ├── types/             # TypeScript types
│   │   ├── theme/             # Material-UI theme
│   │   └── utils/             # Utility functions
│   └── package.json
├── marine-classifieds-backend/  # Backend (Node.js)
│   ├── src/
│   │   ├── config/            # Database configuration
│   │   ├── controllers/       # Route controllers
│   │   ├── entities/          # TypeORM entities
│   │   ├── middleware/        # Express middleware
│   │   ├── routes/            # API routes
│   │   └── utils/             # Utility functions
│   └── package.json
└── README.md
```

## 🔐 Authentication

The application uses JWT tokens for authentication. Users can:
- Register with email and password
- Login with credentials
- Access protected routes with JWT tokens
- Manage profile information

## 💳 Payment Integration

Stripe is integrated for payment processing:
- Secure payment processing
- Webhook handling for payment confirmations
- Multiple payment tiers (Free, Premium, Featured)
- Payment history tracking

## 📸 File Upload

AWS S3 is used for image storage:
- Secure file uploads
- Image optimization
- CDN delivery
- Automatic cleanup

## 🧪 Testing

```bash
# Frontend tests
cd marine-classifieds
npm test

# Backend tests
cd marine-classifieds-backend
npm test
```

## 📦 Deployment

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Set environment variables
3. Deploy automatically on push

### Backend (Railway/Heroku)
1. Connect repository to platform
2. Set environment variables
3. Configure database connection
4. Deploy application

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@marineclassifieds.com or create an issue in the repository. 