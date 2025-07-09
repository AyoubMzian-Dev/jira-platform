# Jira Service Desk Platform

A modern, responsive web application built with Next.js 15 for managing Jira Service Desk requests. This platform provides an intuitive dashboard interface for viewing, managing, and tracking service desk tickets with real-time data visualization and advanced filtering capabilities.

<img width="1413" alt="Screenshot 2025-07-09 at 19 47 50" src="https://github.com/user-attachments/assets/6e83ff0e-650b-477f-bec5-a497b360a213" />

## 🚀 Features

### Authentication & Security
- **Secure Login System**: Basic authentication with Jira Service Desk API integration
- **Session Management**: HTTP-only cookies for secure credential storage
- **Auto-redirect**: Automatic redirection to dashboard for authenticated users
- **Mock Data Support**: Development mode with demo data for testing

### Dashboard Analytics
- **Real-time Statistics**: Live display of total, open, resolved, and pending requests
- **Visual Progress Indicators**: Progress bars and trend charts for quick insights
- **Status Monitoring**: API connection status indicators with fallback handling
- **Responsive Design**: Mobile-first design that works across all devices

### Service Request Management
- **Complete Request Listing**: View all service desk requests with detailed information
- **Advanced Filtering**: Filter requests by status, priority, and other criteria
- **Request Details**: Expandable detailed view for each service request
- **Status Tracking**: Real-time status updates and progress tracking
- **Delete Functionality**: Remove requests with proper permission handling

### User Interface
- **Modern Dark Theme**: Beautiful gradient backgrounds with glassmorphism effects
- **Sidebar Navigation**: Collapsible sidebar with user profile and navigation menu
- **Responsive Layout**: Adaptive design for desktop, tablet, and mobile devices
- **Loading States**: Skeleton loaders and progress indicators for better UX
- **Toast Notifications**: Real-time feedback for user actions

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with Suspense and Server Components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library

### Backend & APIs
- **Jira Service Desk API** - Real-time integration with Jira
- **Next.js API Routes** - Server-side API handling
- **Server Actions** - Direct server-side data mutations

### Development Tools
- **pnpm** - Fast, disk space efficient package manager
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing and optimization

## 📦 Installation

### Prerequisites
- Node.js 18.17 or later
- pnpm (recommended) or npm
- Access to a Jira Service Desk instance

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jira-platform
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Configuration**
   Create a `.env.local` file in the root directory:
   ```env
   # Jira Configuration
   JIRA_BASE_URL=https://your-jira-instance.com
   JIRA_SERVICE_DESK_ID=your-service-desk-id
   
   # Development Settings
   NEXT_PUBLIC_USE_MOCK_DATA=false  # Set to 'true' for demo mode
   NODE_ENV=development
   ```

4. **Start the development server**
   ```bash
   pnpm dev
   ```

5. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Usage

### Authentication
1. Navigate to the login page
2. Enter your Jira Service Desk credentials
3. The application will authenticate with your Jira instance
4. Upon successful login, you'll be redirected to the dashboard

### Dashboard Navigation
- **Dashboard**: Overview of all service requests with statistics
- **Service Requests**: Detailed list view of all requests (future feature)
- **Settings**: User preferences and configuration (future feature)

### Managing Requests
- View request details by clicking on any request card
- Monitor request status and progress
- Delete requests (requires appropriate permissions)
- Refresh data using the refresh button

### Demo Mode
For development and testing, enable mock data mode:
```env
NEXT_PUBLIC_USE_MOCK_DATA=true
```

## 🔧 Configuration

### Jira Service Desk Integration
The application integrates with the following Jira APIs:
- `/rest/api/2/myself` - User authentication and profile
- `/rest/servicedeskapi/request/` - Service desk requests

### Supported Jira Versions
- Jira Service Desk 4.0+
- Jira Cloud
- Jira Server/Data Center

### API Permissions Required
- Browse projects
- View service desk requests
- Manage service desk requests (for delete functionality)

## 📁 Project Structure

```
jira-platform/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Dashboard pages and layouts
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Home/Login page
├── components/            # React components
│   ├── ui/               # Reusable UI components (Radix UI + Tailwind)
│   ├── app-sidebar.tsx   # Application sidebar
│   ├── login-form.tsx    # Authentication form
│   └── service-requests.tsx # Service requests management
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and configurations
│   ├── auth.ts          # Authentication and API functions
│   └── utils.ts         # General utilities
├── public/              # Static assets
└── styles/              # Additional styles
```

## 🎨 UI Components

The application uses a comprehensive design system built on:
- **Radix UI Primitives**: Accessible, unstyled components
- **Tailwind CSS**: Utility-first styling
- **Custom Theme**: Dark mode with gradient backgrounds
- **Responsive Design**: Mobile-first approach

Key components include:
- Cards, Buttons, Dialogs
- Tables, Badges, Avatars
- Navigation, Breadcrumbs, Sidebar
- Forms, Inputs, Select dropdowns
- Charts, Progress indicators
- Toast notifications, Loading states

## 🔒 Security Features

- **HTTP-Only Cookies**: Secure credential storage
- **CSRF Protection**: Built-in Next.js protections
- **Input Validation**: Form validation with Zod schemas
- **Error Handling**: Comprehensive error boundaries
- **Timeout Protection**: API request timeouts to prevent hanging

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables for Production
```env
NODE_ENV=production
JIRA_BASE_URL=https://your-production-jira.com
NEXT_PUBLIC_USE_MOCK_DATA=false
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use semantic commit messages
- Ensure responsive design
- Add proper error handling
- Write comprehensive tests

## 🐛 Troubleshooting

### Common Issues

**Authentication Failed**
- Verify Jira credentials and permissions
- Check network connectivity to Jira instance
- Ensure Jira instance supports REST API

**API Connection Issues**
- Verify JIRA_BASE_URL in environment variables
- Check CORS settings on Jira instance
- Enable mock data mode for development

**Build Errors**
- Clear Next.js cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && pnpm install`
- Check TypeScript configuration

### Debug Mode
Enable detailed logging by setting:
```env
DEBUG=true
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - For the excellent React framework
- **Radix UI** - For accessible component primitives
- **Tailwind CSS** - For the utility-first CSS framework
- **Lucide** - For the beautiful icon library

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the troubleshooting section

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
