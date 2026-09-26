# EnsieShop

Full-stack dropshipping product storefront adapted from an existing ecommerce structure for a practical everyday product catalog.

## Features

- Product-first landing page with generated product imagery
- Shop, product detail, cart, Stripe checkout, and order success/cancel flows
- Admin portal for product listings, images, listing order, shipping settings, and fulfillment
- Prisma-backed products, orders, order items, and shipping settings
- SendGrid/Twilio hooks for order and shipping notifications

## Getting Started

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Admin Portal

- URL: [http://localhost:3000/admin](http://localhost:3000/admin)
- Default password: `200Orders!` (change `ADMIN_PASSWORD` in `.env`)

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS 4
- Prisma
- Stripe checkout
- Vercel Blob-ready image uploads
