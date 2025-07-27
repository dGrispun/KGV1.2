# Kingdom Guard - Inventory Management App

A full-stack web application built with Next.js 14, TypeScript, Tailwind CSS, and Supabase for managing Kingdom Guard inventory and MK event calculations.

## Features

- **User Authentication**: Secure login/signup with Supabase Auth
- **Inventory Management**: Track your bag items with quantities
- **MK Event Calculator**: Calculate points across 6 event days
- **Real-time Sync**: Data synchronization across multiple tabs
- **Mobile Responsive**: Optimized for mobile and desktop
- **Custom Items**: Add custom items to your inventory and MK events

## Tech Stack

- **Frontend**: Next.js 14 with App Router, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **State Management**: React Context API
- **Forms**: React Hook Form with Zod validation
- **Notifications**: Sonner (toast notifications)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd kingdom-guard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Set up your Supabase database:
   - Follow the instructions in `SUPABASE_SETUP.md`
   - Run the provided SQL commands in your Supabase SQL Editor

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Schema

### Tables

- `bag_items`: Stores user inventory with quantities
- `mk_points`: Stores customizable points per item per MK day
- Row Level Security (RLS) ensures users can only access their own data

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── bag/               # Inventory management page
│   ├── mk/                # MK event calculator page
│   └── page.tsx           # Login page
├── components/            # Reusable React components
│   ├── ui/                # shadcn/ui components
│   ├── Navbar.tsx         # Navigation component
│   └── ProtectedRoute.tsx # Route protection wrapper
├── contexts/              # React Context providers
│   └── AuthContext.tsx    # Authentication context
├── lib/                   # Utility functions
│   ├── supabase.ts        # Supabase client configuration
│   └── utils.ts           # Helper utilities
├── types/                 # TypeScript type definitions
│   └── index.ts           # App-wide types
└── SUPABASE_SETUP.md      # Database setup instructions
```

## Usage

### Authentication
- Create an account or sign in with email/password
- Protected routes require authentication

### Bag Management
- View and update quantities for predefined items
- Items are grouped by categories (Currency, Magic Books, etc.)
- Add custom items with the "Add Item" button
- Changes are saved to your personal database

### MK Event Calculator
- Six tabs represent different event days (I-VI)
- Each day shows relevant items with point values
- Inventory items automatically show quantities from your bag
- Action-based events have quantity inputs per day
- Points are calculated in real-time: quantity × points per unit
- Customize point values for any item
- Add custom events per day

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

- TypeScript strict mode enabled
- ESLint configuration included
- Tailwind CSS for styling
- shadcn/ui for consistent components

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
1. Check the existing issues on GitHub
2. Create a new issue with detailed information
3. Provide steps to reproduce any bugs
