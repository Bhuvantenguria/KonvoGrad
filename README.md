# 🚀 KonvoGrad - Professional Networking Platform

<div align="center">

![KonvoGrad Logo](https://img.shields.io/badge/KonvoGrad-Professional%20Networking-blue?style=for-the-badge&logo=linkedin)
![Live Demo](https://img.shields.io/badge/Live%20Demo-https://konvo--grad.vercel.app-green?style=for-the-badge&logo=vercel)
![Status](https://img.shields.io/badge/Status-Live%20Production-brightgreen?style=for-the-badge)

**Connect with Alumni & Developers Instantly**  
*Experience random matching with verified professionals, build meaningful connections, and grow your network through secure video and text conversations.*

[🌐 Live Demo](https://konvo-grad.vercel.app/) | [📖 Documentation](https://github.com/your-username/KonvoGrad) | [🐛 Report Issues](https://github.com/your-username/KonvoGrad/issues)

</div>

---

## 🎯 **What is KonvoGrad?**

KonvoGrad is a **professional networking platform** that revolutionizes how alumni and developers connect. Think of it as "Omegle for professionals" - but with verified users, secure video calls, and meaningful conversations.

### 🌟 **Key Features**

| Feature | Description |
|---------|-------------|
| 🎲 **Random Matching** | Connect instantly with verified professionals through our Omegle-style matching system |
| ✅ **Professional Verification** | LinkedIn integration ensures you're connecting with real, verified professionals |
| 🎥 **Video & Text Chat** | Seamless video calling and text messaging with real-time notifications |
| 👥 **Friend Connections** | Build lasting connections with invite codes and reconnect with past conversations |
| 🔔 **Real-time Updates** | Push notifications and live updates keep you connected to your network |
| 🛡️ **Secure & Moderated** | Advanced moderation tools and admin oversight ensure a safe networking environment |

---

## 🛠️ **Tech Stack**

### **Frontend**
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn UI** - Beautiful, accessible components
- **Framer Motion** - Smooth animations and transitions

### **Backend & Services**
- **Firebase Firestore** - Real-time NoSQL database
- **Firebase Cloud Messaging** - Push notifications
- **Clerk** - Authentication & user management
- **Cloudinary** - Media storage and optimization
- **WebRTC** - Peer-to-peer video calling

### **Development Tools**
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Vercel** - Deployment platform

---

## 🚀 **Live Demo**

**Experience KonvoGrad in action:** [https://konvo-grad.vercel.app/](https://konvo-grad.vercel.app/)

### 🎬 **Demo Features**
- ✅ **Live Video Chat** - Test the Omegle-style matching
- ✅ **Professional Profiles** - View verified user profiles
- ✅ **Real-time Messaging** - Experience instant chat
- ✅ **Theme Switching** - Try different UI themes
- ✅ **Responsive Design** - Works on all devices

---

## 📦 **Installation & Setup**

### **Prerequisites**
- Node.js 18+ 
- npm/pnpm/yarn
- Firebase account
- Clerk account
- Cloudinary account

### **1. Clone Repository**
```bash
git clone https://github.com/your-username/KonvoGrad.git
cd KonvoGrad
```

### **2. Install Dependencies**
```bash
# Using pnpm (recommended)
pnpm install

# Using npm
npm install

# Using yarn
yarn install
```

### **3. Environment Configuration**

Copy the example environment file:
```bash
cp env.example .env.local
```

#### **Firebase Configuration**
Get these values from your [Firebase Console](https://console.firebase.google.com/):

```env
# Firebase Client (Public)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your_vapid_key

# Firebase Admin (Server-side)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Private_Key\n-----END PRIVATE KEY-----"
```

#### **Clerk Authentication**
Get these from your [Clerk Dashboard](https://dashboard.clerk.com/):

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key
CLERK_SECRET_KEY=sk_test_your_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
```

#### **Cloudinary Configuration**
Get these from your [Cloudinary Dashboard](https://cloudinary.com/console):

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### **4. Firebase Setup**

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication (Email/Password, Google)
   - Enable Firestore Database
   - Enable Cloud Messaging

2. **Configure Firestore Rules**
   ```javascript
   // firestore.rules
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Allow read/write for authenticated users
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

3. **Create Indexes**
   ```bash
   # Deploy Firestore indexes
   npx firebase deploy --only firestore:indexes
   ```

### **5. Clerk Setup**

1. **Create Clerk Application**
   - Go to [Clerk Dashboard](https://dashboard.clerk.com/)
   - Create a new application
   - Configure authentication providers (Google, Email)
   - Set up redirect URLs

2. **Configure Webhooks** (Optional)
   - Set up webhooks for user events
   - Configure custom user attributes

### **6. Run Development Server**

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

Visit [http://localhost:3000](http://localhost:3000) to see your app!

---

## 📁 **Project Structure**

```
KonvoGrad/
├── 📁 app/                          # Next.js App Router
│   ├── 📁 (auth)/                   # Authentication routes
│   ├── 📁 dashboard/                # User dashboard
│   ├── 📁 chat/                     # Chat interface
│   ├── 📁 match/                    # Matching system
│   ├── 📁 video-chat/               # Video call interface
│   ├── 📁 onboarding/               # User profile setup
│   ├── 📄 layout.tsx                # Root layout
│   └── 📄 globals.css               # Global styles
├── 📁 components/                   # React components
│   ├── 📁 ui/                       # Reusable UI components
│   │   ├── 📄 shared-navigation.tsx # Navigation component
│   │   └── 📄 theme-provider.tsx    # Theme management
│   ├── 📁 video-chat/               # Video call components
│   ├── 📁 matching/                 # Matching interface
│   └── 📁 chat/                     # Chat components
├── 📁 hooks/                        # Custom React hooks
│   ├── 📄 use-video-call.ts         # Video call logic
│   ├── 📄 use-matching.ts           # Matching system
│   ├── 📄 use-chat.ts               # Chat functionality
│   └── 📄 use-firebase-user.ts      # Firebase user management
├── 📁 lib/                          # Utility libraries
│   ├── 📄 firebase.ts               # Firebase client config
│   ├── 📄 firebase-admin.ts         # Firebase admin config
│   ├── 📄 firebase-client-utils.ts  # Client-side Firebase ops
│   ├── 📄 firebase-messaging.ts     # Push notifications
│   ├── 📄 cloudinary.ts             # Media uploads
│   └── 📄 webrtc-utils.ts           # WebRTC utilities
├── 📁 public/                       # Static assets
├── 📄 firebase.json                 # Firebase config
├── 📄 firestore.rules               # Firestore security rules
├── 📄 firestore.indexes.json        # Database indexes
└── 📄 package.json                  # Dependencies
```

---

## 🎨 **Features Deep Dive**

### **🎲 Random Matching System**
- **Omegle-style Interface**: Instant connection with random professionals
- **Professional Verification**: LinkedIn integration for user verification
- **Smart Filtering**: Match based on skills, interests, and location
- **Session Management**: Unique session IDs for anonymous connections

### **🎥 Video Chat Experience**
- **WebRTC Integration**: Peer-to-peer video calling
- **Media Controls**: Toggle video/audio, screen sharing
- **Chat Integration**: Side chat panel during video calls
- **Connection Quality**: Automatic quality adjustment
- **Device Management**: Camera and microphone controls

### **💬 Real-time Messaging**
- **Firestore Listeners**: Instant message updates
- **File Sharing**: Support for images, documents, and media
- **Read Receipts**: Message status indicators
- **Typing Indicators**: Real-time typing notifications
- **Message History**: Persistent chat history

### **🎨 Modern UI/UX**
- **Theme System**: Multiple gradient themes with dark/light mode
- **Responsive Design**: Mobile-first approach
- **Smooth Animations**: Framer Motion powered transitions
- **Glassmorphism**: Modern glass effect design
- **Interactive Elements**: Hover effects and micro-interactions

### **🔐 Security & Privacy**
- **Clerk Authentication**: Secure user authentication
- **Firebase Security Rules**: Database access control
- **Content Moderation**: Admin oversight and reporting
- **Privacy Controls**: User data protection
- **Session Management**: Secure session handling

---

## 🚀 **Deployment**

### **Vercel Deployment** (Recommended)

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Deploy to Vercel
   vercel
   ```

2. **Configure Environment Variables**
   - Add all environment variables in Vercel dashboard
   - Set production Firebase configuration
   - Configure Clerk production keys

3. **Custom Domain** (Optional)
   - Add custom domain in Vercel dashboard
   - Configure DNS settings

### **Firebase Hosting**

```bash
# Build the project
pnpm build

# Deploy to Firebase
npx firebase deploy
```

### **Other Platforms**

- **Netlify**: Connect GitHub repository
- **Railway**: Deploy with Railway CLI
- **Docker**: Use provided Dockerfile

---

## 🤝 **Contributing**

We welcome contributions! Here's how you can help:

### **Development Setup**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

### **Code Standards**
- Follow TypeScript best practices
- Use ESLint and Prettier
- Write meaningful commit messages
- Add tests for new features
- Update documentation

### **Issue Reporting**
- Use GitHub Issues for bug reports
- Provide detailed reproduction steps
- Include browser/device information
- Attach screenshots if applicable

---

## 📊 **Performance & Analytics**

### **Performance Metrics**
- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **Core Web Vitals**: Optimized for all metrics
- **Bundle Size**: Optimized with Next.js tree shaking
- **Loading Speed**: < 2s initial load time

### **Monitoring**
- **Vercel Analytics**: Real-time performance monitoring
- **Firebase Analytics**: User behavior tracking
- **Error Tracking**: Automatic error reporting

---

## 📱 **Mobile Experience**

KonvoGrad is fully responsive and optimized for mobile devices:

- **Progressive Web App (PWA)**: Install as native app
- **Touch Optimized**: Mobile-friendly interactions
- **Offline Support**: Basic functionality without internet
- **Push Notifications**: Real-time updates on mobile

---

## 🔧 **Troubleshooting**

### **Common Issues**

#### **Firebase Connection Issues**
```bash
# Check Firebase configuration
firebase projects:list
firebase use your-project-id
```

#### **Clerk Authentication Problems**
- Verify environment variables
- Check redirect URLs in Clerk dashboard
- Ensure proper domain configuration

#### **Video Call Issues**
- Check camera/microphone permissions
- Verify WebRTC support in browser
- Test with different browsers

#### **Build Errors**
```bash
# Clear cache and reinstall
rm -rf node_modules .next
pnpm install
pnpm build
```

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 **Acknowledgments**

- **Clerk** for authentication
- **Firebase** for backend services
- **Cloudinary** for media storage
- **Vercel** for hosting
- **Next.js** team for the amazing framework
- **Tailwind CSS** for styling utilities

---

## 📞 **Support & Contact**

- **Live Demo**: [https://konvo-grad.vercel.app/](https://konvo-grad.vercel.app/)
- **Documentation**: [GitHub Wiki](https://github.com/your-username/KonvoGrad/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-username/KonvoGrad/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/KonvoGrad/discussions)

---

<div align="center">

**Made with ❤️ by the KonvoGrad Team**

[![GitHub stars](https://img.shields.io/github/stars/your-username/KonvoGrad?style=social)](https://github.com/your-username/KonvoGrad)
[![GitHub forks](https://img.shields.io/github/forks/your-username/KonvoGrad?style=social)](https://github.com/your-username/KonvoGrad)
[![GitHub issues](https://img.shields.io/github/issues/your-username/KonvoGrad)](https://github.com/your-username/KonvoGrad/issues)

</div>
