This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### Quick Vercel deployment checklist

- Push your code to a Git provider (GitHub, GitLab, Bitbucket).
- In Vercel, import the repository and select the branch you want to deploy (e.g., `mobile`).
- Make sure build command is `npm run build` and the output directory is handled by Next.js (default).
- If you use Cloudinary remote media (images/videos), confirm `next.config.mjs` contains the `images.remotePatterns` entry for `res.cloudinary.com` (already added).
- Optionally set environment variables in Project Settings if you later need private API keys.

If you want I can also add a small `vercel` GitHub Action or connect automatic branch previews — tell me which branch you want to auto-deploy and I'll add the configuration.
