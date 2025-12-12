# WriteStack – Software Design Commentary

## How We Improved the Design of the Software

We focused on modularity, scalability, maintainability, and operational robustness while preserving backward compatibility with existing data and ensuring a seamless user experience across all features.

### a. Clear, Modular Folder Structure

**Backend:** The API follows a clear separation of concerns with dedicated folders for `controllers`, `routes`, `models`, `middleware`, `config`, `helpers`, and `utils`. This structure increases cohesion and reuse, making ownership and responsibilities explicit. Each domain entity (Blog, User, Category, Comment, Notification, Draft) has its own controller and route files, enabling parallel development and easier maintenance.

**Frontend:** The React application is organized into `pages`, `components`, `helpers`, `hooks`, `redux`, `Layout`, `lib`, and `assets`. Components are further categorized into reusable UI components (under `ui/`) and feature-specific components (BlogCard, Comment, NotificationDropdown, etc.). This separation increases component reusability, makes state management clear, and allows for independent feature development.

### b. Layered Backend Architecture

**Routes:** HTTP endpoint definitions only, delegating to controllers and applying middleware (authentication, file upload) at the route level. Routes are grouped by resource (`/api/blog`, `/api/user`, `/api/category`, etc.) with RESTful conventions.

**Controllers:** Request orchestration and input/output shaping. Controllers handle HTTP-specific concerns (request parsing, response formatting) and delegate business logic to model operations. They validate user permissions (admin vs. regular user) and handle file uploads via Multer middleware before processing.

**Models:** Schema definition and validation using Mongoose. Models define relationships (references to User, Category) and include timestamps for audit trails. The schema design supports flexible content types while maintaining data integrity.

**Middlewares:** Cross-cutting concerns including authentication (JWT token verification from HTTP-only cookies), authorization (admin-only routes), file upload handling (Multer with Cloudinary integration), and error handling. Middlewares are composable and reusable across routes.

**Helpers:** Centralized utility functions like `handleError` for consistent error response formatting across all controllers, reducing code duplication and ensuring uniform API error handling.

### c. Consistent API Design

RESTful endpoints with resource-based paths, correct HTTP verbs (GET, POST, PUT, PATCH, DELETE), and stable status codes. Routes are grouped under `/api` prefix with dedicated routers for blogs, users, categories, comments, likes, notifications, drafts, and admin functions. Public endpoints (like blog listing and search) are accessible without authentication, while content creation and management require authentication. The API design supports both full updates (PUT) and partial updates (PATCH) for blog editing flexibility.

### d. Robust Auth and Security

**JWT-based Authentication:** Tokens stored in HTTP-only cookies prevent XSS attacks while maintaining stateless authentication. The `authenticate` middleware verifies tokens on protected routes and attaches user context to requests.

**Google OAuth Integration:** Firebase Authentication on the frontend with backend verification ensures seamless social login while maintaining security. The OAuth flow handles redirects and token exchange securely.

**Password Reset System:** Email-based OTP (One-Time Password) system using Nodemailer with 6-digit codes that expire in 10 minutes. The `ResetToken` model tracks OTP validity and prevents replay attacks.

**Role-Based Access Control:** Admin and user roles are enforced at both middleware and controller levels. Admin-only routes use `onlyadmin` middleware, while controllers check user roles for data filtering (e.g., admins see all blogs, users see only their own).

**CORS Configuration:** Explicit allow-list for frontend origins with credentials support, preventing unauthorized cross-origin requests while enabling cookie-based authentication.

**Ban System:** Comprehensive user banning mechanism that prevents login, removes all user-generated content (blogs, comments, likes), and maintains audit trails via the `Ban` model. When a user is banned, their blogs are filtered out from public listings to prevent orphaned content.

### e. Resilient Error Handling

Centralized error handler (`handleError` helper) normalizes API responses with consistent structure (`success`, `statusCode`, `message`). The global error middleware in `index.js` catches all unhandled errors and formats them appropriately. Frontend components handle errors gracefully with loading states and user-friendly error messages. The error handling system ensures that banned users' blogs don't cause crashes—missing author data is filtered out before responses are sent.

### f. Performance and UX

**Image Optimization:** Cloudinary integration for automatic image optimization, transformation, and CDN delivery. Images are uploaded to Cloudinary with organized folder structures (`MERN-BLOG` for published content, `MERN-BLOG-DRAFTS` for draft images), reducing server load and improving page load times.

**Efficient Database Queries:** Mongoose queries use `.lean()` for read operations to return plain JavaScript objects instead of Mongoose documents, reducing memory usage. Population is used strategically to fetch related data (author, category) in single queries. Indexes on frequently queried fields (slug, email, userId) improve query performance.

**Auto-save Drafts:** Debounced auto-save functionality (2-second delay) prevents data loss during blog composition. Drafts are stored separately from published blogs, allowing users to resume work seamlessly. The draft system handles partial data gracefully, only saving fields that have values.

**Code Compiler Integration:** For programming category blogs, a custom code compiler component integrates with Judge0 API, providing syntax highlighting (Prism.js) and code execution capabilities. This enhances the platform's value for technical content creators.

**Rich Text Editing:** CKEditor 5 integration provides professional-grade content creation with support for images, tables, lists, and formatting. Content is HTML-encoded server-side to prevent XSS attacks while preserving formatting.

**Responsive Design:** Tailwind CSS with Radix UI components ensures consistent, responsive design across all devices. The layout adapts seamlessly from mobile to desktop, with sidebar navigation that collapses appropriately.

## Where We Applied What Design Principles

### a. Single Responsibility Principle (SRP)

**Backend:** Controllers orchestrate requests and format responses; models define data structure; middlewares handle cross-cutting concerns (auth, uploads, errors); routes define endpoints only. Each controller file handles one resource domain (Blog, User, Category, etc.).

**Frontend:** Components each render one concern—`BlogCard` displays blog previews, `Comment` handles comment display and creation, `NotificationDropdown` manages notification UI, `Editor` wraps CKEditor functionality. Pages are responsible for data fetching and layout composition, while components focus on presentation.

### b. Separation of Concerns

Clear boundaries between transport (routes/controllers), domain logic (models with Mongoose operations), and persistence (MongoDB). Frontend separates UI (components), state management (Redux), API calls (useFetch hook, direct fetch calls), and routing (React Router). The `Layout` component handles shared UI structure (sidebar, topbar, footer), while individual pages handle page-specific logic.

### c. DRY (Don't Repeat Yourself)

**Shared Error Handling:** `handleError` helper eliminates repeated error response formatting across controllers.

**Reusable Components:** `BlogCard` is used across homepage, category pages, and search results. `Comment`, `CommentCount`, `LikeCount` are reused wherever engagement metrics are needed.

**Custom Hooks:** `useFetch` hook centralizes data fetching logic with loading and error states, used throughout the application.

**Route Helpers:** `RouteName.js` centralizes all route definitions, preventing hardcoded paths and making route changes manageable.

**Toast Notifications:** `showToast` helper provides consistent user feedback across the application.

**Authentication Middleware:** Single `authenticate` middleware reused across all protected routes.

### d. Open/Closed Principle

The middleware system allows adding new authentication strategies or validation rules without modifying existing route handlers. The component-based architecture enables extending functionality (e.g., adding new blog card variants) without changing core components. The draft system was added without modifying existing blog creation flow—drafts are a separate concern that integrates seamlessly.

### e. Dependency Inversion (Pragmatic)

Controllers depend on Mongoose models (abstractions) rather than direct database access. Frontend components consume data through hooks and services rather than directly calling fetch. The `useFetch` hook abstracts API communication, allowing components to focus on rendering logic.

### f. Principle of Least Knowledge (Law of Demeter)

Controllers delegate to Mongoose models and don't chain deep property access. Components receive props and don't need to know internal structure of API responses. The Redux store provides a single source of truth, preventing prop drilling through multiple component layers.

### g. Fail-Fast and Defensive Programming

**Input Validation:** Form validation using Zod schemas ensures data integrity before submission. Server-side validation in controllers checks for required fields and valid data types.

**Authentication Middleware:** Rejects unauthorized requests early, before any business logic executes.

**Defensive Data Handling:** Blog listings filter out blogs with missing authors (from banned users) to prevent null reference errors. The `SingleBlogDetails` component checks for missing data before rendering, preventing crashes.

**Error Boundaries:** Loading states and error handling in components prevent UI crashes when API calls fail.

## Key Refactoring Done to Improve the Design

### a. User Banning and Data Cleanup Architecture

Implemented comprehensive user banning that removes all user-generated content while maintaining data integrity. When a user is banned:

- **Blog Deletion:** All blogs authored by the user are deleted from the database.
- **Comment Cleanup:** All comments by the user are removed.
- **Like Removal:** Both legacy `Like` model entries and active `BlogLike` entries are deleted to ensure like counts are accurate.
- **Notification Cleanup:** Notifications where the user is sender or recipient are removed.
- **Blog Filtering:** Public blog listings filter out any blogs whose authors no longer exist, preventing orphaned content from appearing in search results, category pages, or homepage.

This ensures that banned users' content doesn't pollute the platform while maintaining referential integrity.

### b. Draft System Integration

Added auto-save draft functionality without disrupting existing blog creation flow:

- **Separate Draft Model:** Drafts are stored in a separate collection with similar schema to blogs but without required fields, allowing partial saves.
- **Debounced Auto-save:** Uses lodash debounce (2-second delay) to prevent excessive API calls while typing.
- **Graceful Field Handling:** Draft controller normalizes empty strings to undefined for optional fields (like category), preventing MongoDB cast errors.
- **Seamless Integration:** Drafts load automatically when users return to the blog creation page, prefilling the form with saved content.

The draft system operates independently from published blogs, allowing users to have multiple drafts without affecting their published content.

### c. Centralized Error Handling and Response Formatting

Refactored error handling to use a centralized `handleError` helper that ensures consistent error response structure across all controllers. The global error middleware in `index.js` catches all unhandled errors and formats them with appropriate status codes. This eliminates inconsistent error responses and makes error handling predictable for frontend consumption.

### d. Image Upload and Cloudinary Integration

Centralized image upload logic using Multer middleware with Cloudinary integration:

- **Consistent Upload Flow:** All image uploads (blog featured images, user avatars, draft images) use the same Multer configuration with file type validation and size limits (5MB).
- **Cloudinary Organization:** Images are organized in folders (`MERN-BLOG`, `MERN-BLOG-DRAFTS`) for easy management and cleanup.
- **Error Handling:** Cloudinary upload errors are caught and returned as user-friendly error messages, with specific handling for API secret mismatches.

### e. Authentication and Authorization Refinement

Refined authentication system with multiple layers:

- **JWT in HTTP-only Cookies:** Prevents XSS attacks while maintaining stateless authentication.
- **Google OAuth Flow:** Integrated Firebase Authentication with backend verification, handling redirect flows seamlessly.
- **Password Reset:** Implemented secure OTP-based password reset with time-limited tokens stored in `ResetToken` model.
- **Role-Based Access:** Admin middleware (`onlyadmin`) and role checks in controllers ensure proper access control.

### f. Frontend State Management with Redux

Implemented Redux Toolkit with Redux Persist for user state management:

- **Persistent User Session:** User data persists across page refreshes using sessionStorage.
- **Centralized State:** Single source of truth for user authentication state, preventing inconsistencies.
- **Non-serializable Middleware:** Configured to allow Firebase auth objects in state without serialization errors.

### g. API Route Organization and RESTful Design

Organized API routes into logical groups with consistent naming:

- **Resource-Based Routes:** `/api/blog`, `/api/user`, `/api/category`, `/api/comment`, `/api/blog-like`, `/api/notifications`, `/api/drafts`, `/api/admin`
- **HTTP Verb Usage:** GET for retrieval, POST for creation, PUT for full updates, PATCH for partial updates, DELETE for removal.
- **Public vs. Protected:** Public routes (blog listing, search) don't require authentication; content management routes require authentication.

### h. Rich Text Editor Integration

Integrated CKEditor 5 with proper content handling:

- **HTML Encoding:** Server-side encoding using `entities` library prevents XSS attacks while preserving formatting.
- **Content Decoding:** Frontend decodes HTML entities for display in the editor during editing.
- **Image Support:** CKEditor handles image embedding within blog content, separate from featured images.

### i. Notification System Architecture

Built comprehensive notification system:

- **Event-Driven Creation:** Notifications are created when users like blogs or add comments, with proper sender/recipient tracking.
- **Real-time Updates:** Notification dropdown fetches and displays unread notifications.
- **Bulk Operations:** Mark all as read and individual notification read/unread toggling.
- **Cleanup on User Ban:** Notifications are removed when users are banned to maintain data cleanliness.

## Project Structure Overview

### Backend

**api/index.js:** Express app setup, CORS configuration, cookie parser, static file serving for SSR pages, route mounting, MongoDB connection, global error handler, and server initialization.

**api/config:** 
- `cloudinary.js`: Cloudinary SDK configuration and connection testing.
- `multer.js`: File upload middleware with storage configuration, file type validation, and size limits.

**api/models:** Mongoose schemas for User, Blog, Category, Comment, BlogLike, Like (legacy), Notification, Draft, Ban, and ResetToken. Models define relationships, validation, and timestamps.

**api/controllers:** Request handlers for each resource:
- `Auth.controller.js`: Registration, login, Google OAuth, logout, password reset flow.
- `Blog.controller.js`: CRUD operations, search, category filtering, related blogs, with author filtering for banned users.
- `User.controller.js`: User profile management, user listing, user deletion with comprehensive cleanup.
- `Category.controller.js`: Category CRUD operations.
- `Comment.controller.js`: Comment creation, retrieval, counting, deletion.
- `BlogLike.controller.js`: Like/unlike functionality, like counting, notification creation on like.
- `Notification.controller.js`: Notification retrieval, read/unread toggling, bulk operations.
- `Draft.controller.js`: Draft save, retrieval, deletion with graceful field handling.
- `Admin.controller.js`: Dashboard analytics, report generation (PDF, Excel, Word).

**api/routes:** Express routers for each resource, applying authentication middleware and file upload middleware where needed. Routes define HTTP methods and delegate to controllers.

**api/middleware:**
- `authenticate.js`: JWT token verification from cookies.
- `onlyadmin.js`: Admin role verification.
- `auth.middleware.js`: Additional auth utilities.
- `upload.middleware.js`: File upload handling (if separate from Multer config).

**api/helpers:**
- `handleError.js`: Centralized error response formatting.

**api/utils:**
- `email.js`: Nodemailer configuration and email templates for password reset and account deletion.

**api/public:** Static HTML pages (about.html, contact.html) served via Express static middleware for SSR support.

### Frontend

**client/src/App.jsx:** React Router setup, route definitions, Google OAuth redirect handler, route protection with `AuthRouteProtechtion` and `OnlyAdminAllowed` components.

**client/src/pages:** Main application views:
- `Index.jsx`: Homepage with blog listing and static page support (about/contact).
- `SingleBlogDetails.jsx`: Individual blog post view with author info, content, comments, related blogs.
- `Blog/AddBlog.jsx`: Blog creation with auto-save drafts, rich text editor, image upload.
- `Blog/EditBlog.jsx`: Blog editing with PUT and PATCH support.
- `Blog/BlogDetails.jsx`: User's blog management table (admin sees all, users see own).
- `Blog/BlogByCategory.jsx`: Category-filtered blog listing.
- `Category/`: Category management pages (add, edit, list).
- `Admin/Dashboard.jsx`: Analytics dashboard with charts and report downloads.
- `SignIn.jsx`, `SignUp.jsx`: Authentication pages.
- `ForgotPassword.jsx`, `ResetPassword.jsx`: Password reset flow.
- `Profile.jsx`: User profile management.
- `Comments.jsx`: Comment management interface.
- `User.jsx`, `Users/Users.jsx`: User management (admin only).
- `SearchResult.jsx`: Search results display.

**client/src/components:** Reusable UI components:
- `BlogCard.jsx`: Blog preview card with author info, used across listings.
- `Comment.jsx`, `CommentList.jsx`, `CommentCount.jsx`: Comment functionality.
- `LikeCount.jsx`: Like button and count display.
- `NotificationDropdown.jsx`: Notification UI with read/unread states.
- `Editor.jsx`: CKEditor wrapper component.
- `CodeCompiler.jsx`: Code execution component for programming blogs.
- `RelatedBlog.jsx`: Related blog suggestions.
- `SearchBox.jsx`: Search input component.
- `AppSidebar.jsx`: Navigation sidebar with categories.
- `Topbar.jsx`: Top navigation bar with user menu.
- `AuthRouteProtechtion.jsx`: Route guard for authenticated routes.
- `OnlyAdminAllowed.jsx`: Route guard for admin-only routes.
- `ui/`: Radix UI component library (Button, Card, Form, Input, Select, Table, etc.).

**client/src/helpers:**
- `getEnv.js`: Environment variable access helper.
- `RouteName.js`: Centralized route path definitions.
- `showToast.js`: Toast notification helper.
- `handleDelete.js`: Confirmation dialog helper for deletions.
- `firebase.js`: Firebase configuration and auth setup.

**client/src/hooks:**
- `useFetch.js`: Custom hook for data fetching with loading and error states.
- `use-mobile.jsx`: Responsive design hook.

**client/src/redux:**
- `user/user.slice.js`: Redux slice for user state management.
- `store.js`: Redux store configuration with Redux Persist.

**client/src/Layout:**
- `Layout.jsx`: Main layout component with sidebar, topbar, and outlet for page content.

**client/src/lib:**
- `utils.js`: Utility functions (likely className merging for Tailwind).

## Architecture and Patterns

### Controller Pattern

Controllers handle HTTP-specific concerns (request parsing, response formatting) and delegate data operations to Mongoose models. They apply business rules (like filtering banned users' blogs) and handle file uploads before processing. Controllers use the `next` callback for error propagation to the global error handler.

### Middleware Pipeline

Express middleware chain handles cross-cutting concerns:
1. Cookie parser for JWT token extraction.
2. JSON body parser for request data.
3. CORS for cross-origin request handling.
4. Static file serving for SSR pages.
5. Route-specific middleware (authentication, file upload) applied at route level.
6. Global error handler catches all unhandled errors.

### Repository Pattern (Implicit)

While not explicitly separated, Mongoose models act as repositories, encapsulating data access logic. Controllers interact with models directly, but the pattern allows for future extraction of repository layer if needed.

### Service Layer (Implicit)

Business logic is embedded in controllers and models. Complex workflows (like user banning with cleanup) are handled in controllers, while simple CRUD operations are inlined. This keeps the codebase simple but could be refactored to explicit service layer for complex domains.

### Component Composition Pattern

React components are composed hierarchically:
- `Layout` composes `AppSidebar`, `Topbar`, and page content.
- Pages compose multiple components (`BlogCard`, `Comment`, `LikeCount`).
- UI components from Radix UI are composed to build complex interfaces.

### Custom Hooks Pattern

`useFetch` hook encapsulates data fetching logic, reducing repetition across components. The hook manages loading states, error states, and data, making components focus on rendering.

### Route Protection Pattern

Nested route protection using React Router's route composition:
- `AuthRouteProtechtion` wraps authenticated routes.
- `OnlyAdminAllowed` wraps admin-only routes.
- Public routes are accessible without protection.

### State Management Pattern

Redux Toolkit with Redux Persist for global state (user authentication). Local component state (via useState) for component-specific concerns. The pattern balances global state needs with component isolation.

### Error Handling Pattern

Centralized error handling on backend (`handleError` helper, global middleware). Frontend components handle errors with try-catch and display user-friendly messages. Loading states prevent UI crashes during async operations.

## Operational Considerations

### Environment-Driven Configuration

All sensitive configuration (database URLs, JWT secrets, Cloudinary credentials, email credentials, Firebase config) managed via environment variables. Frontend environment variables prefixed with `VITE_` for Vite build-time injection.

### Database Indexing

MongoDB indexes on frequently queried fields:
- User email (unique index for login).
- Blog slug (unique index for URL routing).
- Category slug (for category lookups).
- Author references (for user blog listings).
- Draft author index (for draft retrieval).

### Image Storage and CDN

Cloudinary provides automatic image optimization, transformation, and CDN delivery. Images are organized in folders for easy management. Upload errors are handled gracefully with user feedback.

### Logging and Monitoring

Morgan middleware for HTTP request logging. Console logging for important operations (user bans, data cleanup). Error logging in catch blocks for debugging.

### Security Hardening

- HTTP-only cookies prevent XSS token theft.
- CORS with explicit allow-list prevents unauthorized origins.
- Input validation on both client (Zod) and server (controller checks).
- HTML encoding prevents XSS in blog content.
- Password hashing with bcrypt.
- OTP expiration for password reset security.

### Scalability Considerations

- Lean queries reduce memory usage for large result sets.
- Pagination-ready architecture (can be added to blog listings).
- Cloudinary CDN handles image delivery at scale.
- MongoDB horizontal scaling support.
- Stateless authentication allows horizontal server scaling.

### Data Integrity

- Referential integrity maintained through Mongoose references.
- Cascade-like deletion for banned users (blogs, comments, likes, notifications).
- Filtering of orphaned content (blogs with missing authors) prevents data inconsistencies.
- Draft system prevents data loss during composition.

## Summary

The current design emphasizes separation of concerns, principled layering, and pragmatic reuse. By combining clear folder structures, consistent API design, centralized error handling, and component-based frontend architecture, the codebase is easier to extend and maintain. The user banning system, draft functionality, and notification system integrate cleanly without disrupting existing data structures. The authentication system supports multiple strategies (JWT, Google OAuth) while maintaining security. These choices position WriteStack for reliable growth, smoother operations, and enhanced user experience. The platform successfully balances feature richness with code maintainability, making it suitable for both development and production deployment.

