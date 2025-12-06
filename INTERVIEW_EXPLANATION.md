# WriteStack - Interview Explanation

## Why I Chose This Project

When I started building WriteStack, I had a very personal motivation. I wanted to read interview experiences from companies I was applying to, and I kept hitting paywalls on platforms like Medium. That frustration made me realize there's a real need for a blogging platform that's completely free and open—where anyone can read and write without barriers.

Existing platforms all have their issues. Medium forces users to pay or subscribe to read premium content, which I experienced firsthand. WordPress is powerful but way too complex—it tries to do everything from hosting to website building, which makes it confusing when you just want to write a simple blog. And platforms like GeeksForGeeks are great, but they're limited to technical content.

I wanted something different—a centralized, clean platform purely focused on writing and reading blogs freely. That's how WriteStack was born.

## What Makes WriteStack Different

First, WriteStack supports any type of content. It's not just for technical blogs like some platforms. Whether you want to write about travel, food, personal experiences, or tech tutorials, everything is welcome.

The biggest technical difference is the rich text editor. I integrated CKEditor 5, which gives writers professional-level formatting options. Users can embed images, add tables, format text with headings, create lists, and even paste content from Office documents. It's the same level of editing power you'd find in premium platforms.

The UI is intentionally simple. I designed it so anyone can post or read blogs without confusion. There's no complicated setup, no confusing menus—just a clean interface that gets out of the way and lets you focus on content.

## Tech Stack and Architecture

On the frontend, I built everything with React using Vite for fast development. I used React Router for navigation and Redux Toolkit for state management. For styling, I chose Tailwind CSS with Radix UI components for a modern, responsive design.

The backend is built with Node.js and Express. I chose MongoDB with Mongoose as the database because it's perfect for this kind of content-heavy application. All the blog data, user information, comments, and categories are stored there.

For authentication, I implemented JWT tokens stored in HTTP-only cookies for security. I also added Google OAuth using Firebase, so users can sign in with one click. Password reset works through email using Nodemailer with a 6-digit OTP system that expires in 10 minutes.

Image handling was a key challenge. I integrated Cloudinary so all images are automatically optimized and stored in the cloud. This keeps the application fast and scalable.

The routing is clean—I have separate route files for blogs, users, categories, comments, notifications, drafts, and admin functions. Each route has its own controller that handles the business logic.

## Flow of the Project

Here's how a typical user journey works:

A visitor lands on the homepage and can browse all published blogs. They can search for specific topics or filter by categories. If they want to engage—whether it's Adding a full blog, liking it, or commenting—they need to sign up.

Registration is simple. They enter their name, email, and password. The password is hashed with bcrypt before storing. Or they can use Google OAuth for instant access.

Once logged in, users can create a blog. I built an auto-save draft feature that saves their work every second—so they never lose content even if they close the browser. When they're ready, they select a category, write their title, add a featured image, and compose their content in the rich text editor. The slug is auto-generated from the title for SEO-friendly URLs.

After publishing, their blog appears on the homepage. Other users can read it, like it, or leave comments. Each interaction triggers a real-time notification to the blog author.

Users can edit or delete their own blogs. When editing, the form pre-fills with existing data, and they can update any field including the featured image.

For admins, there's a full dashboard with analytics—total blogs, users, categories, likes. They can view user registration trends over the past 6 months, see blogs grouped by category, and download reports in PDF, Excel, or Word formats. Admins can also ban users if needed.

## My Personal Contributions
l

## Challenges & Learnings

The biggest challenge was integrating CKEditor 5. The documentation is extensive, and getting all the plugins to work together took time. Then I had to figure out how to safely store HTML content—I used the entities library to encode content before saving and decode when displaying. This taught me a lot about handling rich content in web applications.

Image upload was another learning curve. Initially, I was storing images locally, but that doesn't scale. Moving to Cloudinary required understanding their API, handling upload errors, and managing the response. I also had to handle cases where users update a blog but don't change the image—the system now preserves the existing image URL.

The auto-save draft feature taught me about performance. At first, I was saving on every keystroke, which was too frequent. I learned about debouncing and implemented it properly using Lodash. Now it waits one second after the user stops typing before saving.

Building the notification system required understanding relationships between models. When a user likes a blog, I had to fetch the blog author, check if it's the same user (no self-notifications), and create the notification record. This improved my understanding of Mongoose population and data relationships.

The admin dashboard's report generation was challenging. I had to work with three different libraries—PDFKit for PDFs, XLSX for Excel, and Docx for Word documents. Each has a different API, and I had to format data consistently across all three formats.

## Impact & Conclusion

This project taught me what full-stack development really means. I didn't just build a frontend or a backend—I built an entire system where both sides work seamlessly together. I learned how authentication flows from frontend to backend, how state management keeps the UI in sync, and how database queries affect performance.

The most valuable learning was understanding user experience. Features like auto-save drafts or real-time notifications might seem small, but they make a huge difference. I learned to think from the user's perspective—what happens if they lose internet connection? What if they accidentally close the tab? These questions drove real improvements.

On the technical side, I gained deep experience with the MERN stack. I understand how React components communicate, how Express routes handle requests, how MongoDB queries can be optimized, and how middleware protects routes.

The project is polished enough that real users could actually use it. All the core features work—authentication, content creation, social interactions, admin management. It's not just a demo—it's a functioning platform.

This project taught me that good software isn't just about writing code. It's about solving problems, thinking about users, and building something that people would actually want to use. WriteStack isn't just a portfolio project—it's a platform I'm proud of, and one that demonstrates I can take a concept from idea to fully functional application.

