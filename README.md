# 📝 Note Craft

Note Craft is a simple yet powerful note and folder management application built with **Next.js 15**, **React 19**, *
*TailwindCSS**, and **Prisma**. The interface adapts perfectly to both mobile and desktop devices, offering a
step-by-step navigation flow on mobile and a side-by-side view on desktop.

---

## 🚀 Technologies

- **Next.js 15** (App Router with Turbopack)
- **React 19**
- **TailwindCSS 4**
- **NextAuth.js** for authentication
- **Prisma ORM** for database interactions
- **Rich Note Component** for the editor
- **Lit + @lit-labs/react** for Web Components support

---

## 📦 Quick Setup

Clone the repository and install dependencies:

```bash
git clone <repo-url>
cd note-craft
npm install
```

### 🔧 Configuration

Create a `.env` file in the project root with the following environment variables (adjust as needed):

```env
DATABASE_URL="postgresql://user:password@localhost:5432/note-craft"
NEXTAUTH_SECRET="your-super-secret"
```

---

## 🧪 Useful Commands

| Command              | Action                                             |
|----------------------|----------------------------------------------------|
| `npm run dev`        | Starts the project in development mode (Turbopack) |
| `npm run build`      | Builds the project for production                  |
| `npm start`          | Starts the Next.js server in production            |
| `npm run lint`       | Runs code linting                                  |
| `npm run generate`   | Regenerates Prisma client                          |
| `npm run migrations` | Executes a Prisma migration (dev)                  |

---

## 📁 Project Structure

```
note-craft/
├─ app/
│  └─ page.tsx        # The single app page (3-column layout)
├─ _lib/components/        # Sidebar, FileList, RichNote, etc.
├─ _lib/               # Shared functions, hooks, API utilities
├─ prisma/            # Prisma schema and migrations
├─ public/            # SVG icons, images, etc.
├─ styles/            # Tailwind configuration and global styles
```

---

## 📱 Mobile Mode

- **Step 1:** Select a folder (Sidebar)
- **Step 2:** View the folder's notes (FileList)
- **Step 3:** Edit a note (RichNote)

Navigation is handled via a breadcrumb at the top, showing the active folder and note names.

---

## 🖥 Desktop Mode

- **Side-by-side view:** Sidebar, Note List, and Note Editor are all visible simultaneously.
- No routing is needed—everything is managed through internal state.

---

## 🔒 Authentication

The app requires login via [NextAuth.js](https://next-auth.js.org/).  
While multiple strategies (OAuth, Email, Credentials) can be supported, this demo uses basic authentication.

---

## 📝 License

This project is licensed under the [MIT License](./LICENSE).
