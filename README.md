# 📝 Digi-Blog

A modern, full-featured blog application built with Next.js, designed for creating and sharing engaging content with a seamless user experience.

## Demo:[Digiblog](https://digi-blog-7p60j3ffm-mahdikhaniabolfazl-gmailcoms-projects.vercel.app)

## ✨ Features

### Core Functionality
- 📝 **Blog Post Management**
  - Create, read, update, and delete blog posts
  - Rich text editor for content creation
  - Draft and publish functionality
  - Post scheduling capabilities

- 👤 **User Management**
  - User authentication and authorization
  - User profiles with customizable information
  - Author pages showcasing all posts by a specific user
  - Role-based access control (Admin, User, Reader)

- 🏷️ **Content Organization**
  - Topics for post classification
  - Advanced search and filtering
  - Related posts suggestions
  - Archive pages by date, topics ...

- 💬 **Engagement Features**
  - Comments system with moderation
  - Like/reaction system
  - Bookmark/save posts for later reading

### Technical Features
- 🚀 **Performance**
  - Server-side rendering (SSR) with Next.js
  - Static site generation (SSG) for optimal speed
  - Image optimization and lazy loading
  - Code splitting and dynamic imports

- 🔍 **SEO Optimization**
  - Meta tags and Open Graph support
  - SEO-friendly URLs

- 📱 **Responsive Design**
  - Mobile-first approach
  - Adaptive layouts for all screen sizes

- 🎨 **User Experience**
  - Dark/Light mode toggle with Tailwind CSS
  - Smooth page transitions
  - Reading time estimation
  - Table of contents for long posts
  - Syntax highlighting for code blocks
  - Custom Tailwind components and utilities

- 🔐 **Security**
  - Secure authentication flow
  - Input sanitization and validation
  - Protected API routes

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org)
- **Styling:** [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- **Font:** [Geist](https://vercel.com/font) - Optimized with next/font


## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher recommended)
- npm, yarn, pnpm, or bun package manager

## 🚀 Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/abolfazlmahdikhanii/digi-blog.git
cd digi-blog
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

You can start editing pages by modifying `pages/index.js`. The page auto-updates as you edit the file.

### API Routes

API endpoints can be accessed at [http://localhost:3000/api/hello](http://localhost:3000/api/hello). 

Edit API routes in `pages/api/hello.js`. Files in the `pages/api` directory are mapped to `/api/*` and treated as API routes instead of React pages.

## 📁 Project Structure

```
digi-blog/
├── pages/              # Next.js pages and routing
│   ├── api/           # API routes
│   └── index.js       # Homepage
├── public/            # Static assets
├── styles/            # Global styles and Tailwind CSS
│   └── globals.css    # Global styles with Tailwind directives
├── components/        # React components
└── package.json       # Dependencies and scripts
```

## 🔧 Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Creates an optimized production build
- `npm run start` - Starts the production server
- `npm run lint` - Runs ESLint for code quality

## 🎨 Styling with Tailwind CSS



```


## 📚 Learn More

To learn more about Next.js and the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn-pages-router) - An interactive Next.js tutorial
- [Next.js GitHub Repository](https://github.com/vercel/next.js) - Feedback and contributions welcome

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Abolfazl Mahdikhani**

- GitHub: [@abolfazlmahdikhanii](https://github.com/abolfazlmahdikhanii)

## ⭐ Show your support

Give a ⭐️ if this project helped you!

---

Made with ❤️ using Next.js
