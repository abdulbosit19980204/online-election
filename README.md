# VoteSecure - Next-Gen Online Election Platform

VoteSecure is a professional, production-grade online voting platform built with **Django** and **Next.js**. It features military-grade encryption, real-time results, and 100% anonymous voting.

![Landing Page Preview](frontend/public/voting_hologram_3d_1777582708776.png)

## 🚀 Key Features

- **Military-Grade Security**: Fernet AES-128 encryption for all ballots.
- **Privacy First**: One-way SHA-256 hashing separates voter identity from the vote.
- **Real-Time Results**: Live updates via WebSockets (Django Channels).
- **Premium UI/UX**: Modern 3D design, glassmorphism, and fully responsive.
- **Admin Dashboard**: Full control over elections, candidates, and real-time analytics.
- **Multi-language Support**: Full support for English, Uzbek, and Russian.

---

## 🛠 Tech Stack

### Backend
- **Framework**: Django 5.1.1
- **Real-time**: Django Channels (WebSockets)
- **Database**: PostgreSQL (Production) / SQLite (Development)
- **Security**: Fernet Encryption, SHA-256 Hashing, JWT Auth
- **API**: Django Rest Framework (DRF)

### Frontend
- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Localization**: Next-Intl
- **State Management**: Zustand
- **Icons**: Lucide React

---

## 📦 Installation & Setup

### 1. Prerequisites
- Python 3.12+
- Node.js 20+
- Redis (Optional, for production WebSockets)

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Edit .env with your secrets

# Run migrations
python manage.py migrate
python manage.py createsuperuser

# Start server
python manage.py runserver
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your backend URL

# Build and start
npm run dev  # Development
# OR
npm run build && npm start  # Production
```

---

## 🔒 Security Architecture

VoteSecure uses a **two-step anonymization process**:
1. When a user registers, their National ID is hashed with a `VOTE_SALT`.
2. When a user votes, the vote is encrypted, and a `VoterHash` is generated. The system ensures `1 User = 1 Vote` without ever knowing *who* voted for *whom*.

---

## 🌍 Localization
The platform is fully localized in:
- 🇺🇿 **Uzbek**
- 🇷🇺 **Russian**
- 🇺🇸 **English**

Translation files are located in `frontend/messages/`.

---

## 📝 License
This project is proprietary. All rights reserved.

---
**Developed by Robiya/Abdulbosit 2026**
