# BlogHub - Multi-tenant Blog Platform

A modern, multi-tenant blog platform built with Next.js 15, Clerk authentication, and Drizzle ORM. Each organization gets its own dedicated blog space with custom subdomains.

## Features

- 🏢 **Multi-tenant Architecture**: Each organization has its own blog space
- 🔐 **Authentication & Authorization**: Powered by Clerk
- 📝 **Blog Creation & Management**: Intuitive editor for creating and managing posts
- 🌐 **Custom Subdomains**: Each organization gets a unique subdomain (e.g., `org-name.localhost:3000`)
- 📱 **Responsive Design**: Beautiful, modern UI that works on all devices
- ⚡ **Fast Performance**: Built with Next.js 15 and optimized for speed
- 🎨 **Modern UI**: Clean, professional design with smooth animations

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Authentication**: Clerk
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Radix UI primitives
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- PostgreSQL database
- Clerk account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd my-app
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Fill in your environment variables:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/bloghub"

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# For development subdomains
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

4. Set up the database:
```bash
# Push the schema to your database
pnpm db:push

# (Optional) Open Drizzle Studio to view/edit data
pnpm db:studio
```

5. Run the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
my-app/
├── app/
│   ├── (root)/                 # Main app routes (authenticated)
│   │   ├── layout.tsx         # Root layout with Clerk provider
│   │   ├── page.tsx           # Home page with dashboard
│   │   └── org/
│   │       └── [slug]/
│   │           ├── page.tsx   # Blog creation page
│   │           ├── blogs/     # Blog listing page
│   │           └── action.ts  # Server actions
│   ├── (subdomain)/           # Public blog routes
│   │   ├── layout.tsx         # Subdomain layout
│   │   └── s/
│   │       └── [subdomain]/
│   │           └── page.tsx   # Public blog page
│   ├── api/
│   │   └── blogs/
│   │       └── route.ts       # API for fetching blogs
│   └── components/
│       ├── nav.tsx            # Navigation component
│       ├── dashboard.tsx      # Organization dashboard
│       └── loading.tsx        # Loading component
├── components/
│   └── ui/                    # Reusable UI components
├── db/
│   ├── index.ts              # Database connection
│   └── schema.ts             # Database schema
└── lib/
    └── utils.ts              # Utility functions
```

## Usage

### For Organizations

1. **Sign Up/In**: Use Clerk authentication to create an account
2. **Create Organization**: Create an organization in Clerk
3. **Create Blog Posts**: Navigate to your organization's blog creation page
4. **Manage Posts**: View and manage all your organization's posts
5. **Public Blog**: Your blog is automatically available at `your-org-slug.localhost:3000`

### For Readers

- Visit any organization's public blog at `org-slug.localhost:3000`
- Read posts without authentication
- Clean, responsive reading experience

## Database Schema

```sql
CREATE TABLE blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(80) NOT NULL,
  body TEXT NOT NULL,
  org_id TEXT NOT NULL
);
```

## Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm db:push` - Push schema changes to database
- `pnpm db:studio` - Open Drizzle Studio
- `pnpm db:generate` - Generate migrations

### Adding New Features

1. **New Pages**: Add routes in the `app/` directory
2. **Database Changes**: Modify `db/schema.ts` and run `pnpm db:push`
3. **API Endpoints**: Add routes in `app/api/`
4. **Components**: Create reusable components in `app/components/`

## Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Set up environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support, please open an issue in the GitHub repository or contact the development team.
