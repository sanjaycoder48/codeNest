# React + Vite + Tailwind CSS

This project is set up with React, Vite, and Tailwind CSS for modern web development.

## 🚀 Tech Stack

- **React 19.2.0** - A JavaScript library for building user interfaces
- **Vite 7.3.1** - Next generation frontend tooling
- **Tailwind CSS 4.1.18** - A utility-first CSS framework
- **ESLint** - Code linting and quality

## 📦 Getting Started

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:5173/`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🎨 Tailwind CSS

Tailwind CSS is configured and ready to use. The configuration files are:
- `tailwind.config.js` - Tailwind configuration
- `postcss.config.js` - PostCSS configuration
- `src/index.css` - Tailwind directives

You can use Tailwind utility classes directly in your JSX components.

## 📝 Available Scripts

- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 🔧 Vite Plugins

Currently using [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) which uses Babel for Fast Refresh.
