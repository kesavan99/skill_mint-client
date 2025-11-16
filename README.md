# SkillMint Client

A HackerRank-like assessment platform - Frontend Application

## 🚀 Live Demo

[https://bejewelled-alpaca-18236b.netlify.app/](https://bejewelled-alpaca-18236b.netlify.app/)

## 📋 Features

- User Authentication (Sign In / Sign Up)
- Home Dashboard
- Modern React + TypeScript + Vite setup

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Routing**: React Router
- **Styling**: CSS
- **Deployment**: Netlify

## 🏃 Getting Started

### Prerequisites

- Node.js v20.x or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/kesavan99/skill_mint-client.git

# Navigate to project directory
cd skill_mint-client

# Install dependencies
npm install

# Create .env file
echo "VITE_API_BASE_URL=http://localhost:3000" > .env

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080`

## 📦 Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
skill_mint-client/
├── public/
│   └── _redirects          # Netlify SPA routing config
├── src/
│   ├── assets/             # Static assets
│   ├── client-configuration/
│   │   └── home-API.ts     # API configuration
│   ├── component/
│   │   ├── Home.tsx        # Home page
│   │   ├── SignInForm.tsx  # Sign in form
│   │   └── SignUpForm.tsx  # Sign up form
│   ├── service/
│   │   └── authService.ts  # Authentication service
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── .env                    # Environment variables
└── package.json
```

## 🔗 Related Repositories

- Backend: [skill_mint-server](https://github.com/kesavan99/skill_mint-server)

## 👤 Author

**kesavan99**
- GitHub: [@kesavan99](https://github.com/kesavan99)

## 📄 License

This project is part of a personal learning initiative.