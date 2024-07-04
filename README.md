

# LEARNIVERSE-Personalized learning through AI generated tests

## Overview

This project is a Learning Management System (LMS) built using the following technologies:
- **Next.js 14**: A React framework for building server-side rendered (SSR) and static web applications.
- **Gemini API**: Used for generating educational content such as multiple-choice questions (MCQs).
- **Prisma ORM**: An Object-Relational Mapper for managing the database schema and queries.
- **MongoDB**: A NoSQL database used to store application data.
- **Tailwind CSS**: A utility-first CSS framework for styling.
- **ShadCN UI**: A React component library.

## Features

- User authentication and authorization.
- Course management (create, read, update, delete).
- Attachment management for course materials.
- Automatic generation of MCQs using Gemini API.
- Display and interaction with generated MCQs.
- Results display for completed MCQs.

## Installation

### Prerequisites

- Node.js and npm installed on your machine.
- A MongoDB instance (local or hosted).
- Gemini API key.

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/lms.git
   cd lms
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**

   Create a `.env.local` file in the root directory and add the following variables:
   ```env
   DATABASE_URL=mongodb://localhost:27017/lms
   GEMINI_API_KEY=your-gemini-api-key
   NEXTAUTH_SECRET=your-secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Set up the database schema:**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Usage

### Authentication

- Users can sign up and log in to the system.
- Authentication is handled using Clerk.

### Course Management

- Admin users can create, edit, and delete courses.
- Each course can have attachments (e.g., PDFs, videos) associated with it.

### Attachment Management

- Attachments can be uploaded and associated with specific courses.
- Attachments are stored and retrieved from a specified storage solution.

### MCQ Generation

- Use the `GenerateMCQButton` component to generate MCQs for a course.
- MCQs are generated using the Gemini API based on the content of the attachments.
- The MCQs are displayed to the user.

### UI Components

- Tailwind CSS is used for styling the application.
- ShadCN UI components are used for consistent and reusable UI elements.

## Project Structure

```bash
lms/
├── components/         # React components
├── app/              # Next.js app routing
│   ├── api/            # API routes
│   ├── auth/           # Authentication pages
│   ├── courses/        # Course management pages
│   └── ...             # Other pages
├── prisma/             # Prisma schema and migrations
├── public/             # Public assets
├── styles/             # Global styles
├── utils/              # Utility functions
├── .env.local          # Environment variables
└── ...                 # Other configuration files
```

## Contributing

We welcome contributions to this project! If you have suggestions or find bugs, please open an issue or submit a pull request.

### Steps to Contribute

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature/your-feature`).
6. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Thanks to the contributors of [Next.js](https://nextjs.org/), [Prisma](https://www.prisma.io/), [MongoDB](https://www.mongodb.com/), [Tailwind CSS](https://tailwindcss.com/), and [ShadCN UI](https://shadcn.dev/).
- Special thanks to the team behind the Gemini API.

