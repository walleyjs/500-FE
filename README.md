# 500-FE

A starter project using Vue 2, Webpack, and Babel.

## Project Setup
1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run serve
   ```
   The app will be available at [http://localhost:8080](http://localhost:8080).

3. **Build for production:**
   ```bash
   npm run build
   ```
   The production-ready files will be in the `dist/` directory.

## API Integration

This app is fully integrated with a backend API for managing tasks. You must have the backend server running at `http://localhost:4000` for the app to function.

- **Endpoints used:**
  - `GET    /v1/tasks` — fetch all tasks
  - `POST   /v1/tasks` — create a new task (expects `{ title: string }`)
  - `PATCH  /v1/tasks/:taskId` — update a task (e.g., `{ title: string }`)
  - `DELETE /v1/tasks/:taskId` — delete a task

All API logic is handled in [`src/api.js`](src/api.js) and used throughout the app for CRUD operations.

## Project Structure

- `src/` - Source files
  - `main.js` - Entry point
  - `App.vue` - Root Vue component
  - `api.js` - API utility for backend integration
- `public/` - Static assets and HTML template
- `webpack.config.js` - Webpack configuration
- `.babelrc` - Babel configuration

## Notes
- This project uses **Vue 2** (EOL) for legacy support.
- For routing, state management, or additional features, install and configure packages like `vue-router` or `vuex` as needed.
