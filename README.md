# Twitter Clone – MERN Stack Project 🐦

A fully functional Twitter clone built with the MERN stack (MongoDB, Express, React, Node.js). This project demonstrates key features such as real-time chat with Socket.io, state management using React Query, and a sleek, responsive UI styled with Tailwind CSS and DaisyUI.

[![Stars](https://img.shields.io/github/stars/Its-me-ak/twtter-mern-project?style=social)](https://github.com/Its-me-ak/twtter-mern-project)
[![Forks](https://img.shields.io/github/forks/Its-me-ak/twtter-mern-project?style=social)](https://github.com/Its-me-ak/twtter-mern-project)
[![Open Issues](https://img.shields.io/github/issues/Its-me-ak/twtter-mern-project)](https://github.com/Its-me-ak/twtter-mern-project/issues)
[![Last Updated](https://img.shields.io/github/last-commit/Its-me-ak/twtter-mern-project)](https://github.com/Its-me-ak/twtter-mern-project/commits/main)

**Owner:** [Its-me-ak](https://github.com/Its-me-ak)

**Primary Language:** JavaScript

**Topics/Tags:** `expressjs`, `mongo`, `nodejs`, `react-query`, `reactjs`, `rest-api`, `tailwindcss`

**Visibility:** Public

**Homepage:** [https://twtter-mern-project.onrender.com](https://twtter-mern-project.onrender.com)

## 🚀 Installation

Follow these steps to get the project up and running on your local machine.

### Prerequisites

Make sure you have the following installed:

-   Node.js (v16 or higher)
-   npm (Node Package Manager) or yarn
-   MongoDB

### Steps

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Its-me-ak/twtter-mern-project.git
    cd twtter-mern-project
    ```

2.  **Install dependencies for both the backend and frontend:**

    ```bash
    # Backend
    cd backend
    npm install  # or yarn install
    cd ..

    # Frontend
    cd frontend
    npm install  # or yarn install
    cd ..
    ```

3.  **Configure environment variables:**

    -   Create a `.env` file in the `backend` directory.  Add your MongoDB connection string, JWT secret, Cloudinary keys, and any other necessary environment variables.  Example:

        ```
        MONGODB_URI=your_mongodb_connection_string
        JWT_SECRET=your_jwt_secret
        CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
        CLOUDINARY_API_KEY=your_cloudinary_api_key
        CLOUDINARY_API_SECRET=your_cloudinary_api_secret
        ```

    -   Create a `.env` file in the `frontend` directory. Add your API URL. Example:

        ```
        VITE_API_URL=http://localhost:5000/api
        ```

4.  **Run the application:**

    ```bash
    # Start the backend server
    cd backend
    npm run dev # or npm start for production

    # Start the frontend development server in a separate terminal
    cd frontend
    npm run dev
    ```

    The frontend should be running on a development server (usually `http://localhost:5173`), and the backend API should be running on `http://localhost:5000`.

## ✨ Key Features

*   **Real-time Chat:** Implemented using Socket.io for instant messaging.
*   **State Management:** Utilizes React Query for efficient data fetching, caching, and state management on the frontend.
*   **Responsive UI:** Styled with Tailwind CSS and DaisyUI for a modern and responsive user experience.
*   **Authentication & Authorization:** Secure user authentication using JWT (JSON Web Tokens).
*   **CRUD Operations:** Full Create, Read, Update, and Delete functionality for tweets and user profiles.
*   **Media Uploads:** Integrated with Cloudinary for image and video uploads.

## 🛠️ API Documentation

The backend provides a RESTful API. Here are some key endpoints:

*   `POST /api/auth/register`: Register a new user.
*   `POST /api/auth/login`: Login an existing user.
*   `GET /api/users/:id`: Get user profile by ID.
*   `GET /api/tweets`: Get all tweets.
*   `POST /api/tweets`: Create a new tweet.
*   `DELETE /api/tweets/:id`: Delete a tweet.

(More detailed API documentation can be found in the `docs/` directory - *currently empty, but planned for future updates*).

## 🤝 Contributing

Contributions are welcome! Here's how you can contribute:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with clear, concise messages.
4.  Push your changes to your fork.
5.  Submit a pull request to the main branch of the original repository.

Please follow the existing code style and conventions.  Include relevant tests with your contributions.

## 📝 License

This project is open source and available under the [ISC License](LICENSE). *(LICENSE file not found in the repository)*
```
