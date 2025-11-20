# Gujrat Book Shop Landing Page

A modern, responsive e-commerce landing page for Gujrat Book Shop - a stationery and books online store built with Next.js 14, TailwindCSS, and Framer Motion.

## Features

- **Hero Section** with full-width background image and call-to-action
- **Navigation Bar** with logo, search, categories, and cart/account icons
- **Featured Categories** in an elegant grid layout
- **Product Showcase** with carousel and hover effects
- **Editorial Section** with lifestyle imagery and content
- **Trending Products** in responsive grid
- **Newsletter Signup** with email validation
- **Footer** with multiple columns and social links
- **Dynamic Pages** with NestJS backend integration:
  - Products listing with filtering and pagination
  - Individual product detail pages
  - Category pages with product filtering
  - Brand pages with product collections
  - Search functionality with advanced filters
  - Customer dashboard with order management

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- TailwindCSS for styling
- Framer Motion for animations
- Lucide React for icons
- Responsive design (mobile-first)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env.local` file in the root directory:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
```

3. Start the NestJS backend:
```bash
cd ../ecommerce-nest
npm install
npm run start:dev
```

4. Run the Next.js development server:
```bash
npm run dev
```

5. Open [http://localhost:3001](http://localhost:3001) in your browser.

## Project Structure

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── ProductCard.tsx
│   ├── CategoryGrid.tsx
│   ├── ProductShowcase.tsx
│   ├── EditorialSection.tsx
│   ├── TrendingProducts.tsx
│   ├── Newsletter.tsx
│   └── Footer.tsx
└── lib/
    └── utils.ts
```

## Design Features

- Clean, modern aesthetic perfect for books and stationery
- Smooth animations and transitions
- Mobile-first responsive design
- Modern UI components with hover effects
- Clean typography and spacing
- High-quality placeholder images from Unsplash