# TODO: Remove Tailwind CSS and Replace with Inline CSS

## Configuration Updates
- [ ] Update package.json: Remove Tailwind dependencies (@tailwindcss/vite, @tailwindcss/postcss, tailwindcss)
- [ ] Update vite.config.js: Remove tailwindcss plugin
- [ ] Update postcss.config.cjs: Remove @tailwindcss/postcss plugin
- [ ] Update tailwind.config.js: Delete or empty the file
- [ ] Update src/index.css: Remove @import "tailwindcss";

## JSX Files Inline CSS Conversion
- [ ] src/App.jsx: Replace className with inline styles
- [ ] src/components/Header.jsx: Replace className with inline styles
- [ ] src/pages/Login.jsx: Replace className with inline styles
- [ ] src/pages/Dashboard.jsx: Replace className with inline styles
- [ ] src/pages/ChangePassword.jsx: Replace className with inline styles
- [ ] src/pages/AddStudent.jsx: Replace className with inline styles
- [ ] src/pages/StudentStats.jsx: Replace className with inline styles
- [ ] src/pages/ProxyAttendance.jsx: Replace className with inline styles

## Followup Steps
- [ ] Run npm install to update dependencies
- [ ] Test the application to ensure styles are applied correctly
- [ ] Verify no Tailwind classes remain in the codebase
