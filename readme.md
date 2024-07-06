# Vidotube

Vidotube is a video streaming application that allows users to upload, share, and watch videos. It features user authentication, video upload to Cloudinary, and uses MongoDB for data storage.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## Features

- User Registration and Authentication
- Video Upload and Streaming
- User Profiles
- Watch History
- Video Thumbnails
- Pagination for Videos

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Token)
- **File Storage**: Cloudinary
- **Middleware**: Multer for file uploads
- **Environment Management**: dotenv

## Installation

1. **Clone the repository**
    ```sh
    git clone https://github.com/yourusername/vidotube.git
    cd vidotube
    ```

2. **Install dependencies**
    ```sh
    npm install
    ```

3. **Set up environment variables**
    Create a `.env` file in the root directory and add the following:
    ```env
    PORT=8000
    MONGODB_URI="your_mongodb_connection_string"
    CORS_ORIGIN=*
    ACCESS_TOKEN_SECRET=your_access_token_secret
    ACCESS_TOKEN_EXPIRY=1d
    REFRESH_TOKEN_SECRET=your_refresh_token_secret
    REFRESH_TOKEN_EXPIRY=10d
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    ```

4. **Start the server**
    ```sh
    npm start
    ```

## Usage

- **Register a new user**: Use the `/api/v1/user/register` endpoint to create a new user.
- **Login**: Use the `/api/v1/user/login` endpoint to authenticate a user.
- **Upload Video**: Authenticated users can upload videos to Cloudinary.
- **Stream Video**: Users can stream videos that are stored in Cloudinary.

## API Endpoints

### User Routes

- **POST** `/api/v1/user/register`
    - Registers a new user.
- **POST** `/api/v1/user/login`
    - Authenticates a user and returns a JWT token.

### Video Routes

- **POST** `/api/v1/video/upload`
    - Uploads a new video to Cloudinary.
- **GET** `/api/v1/video/:id`
    - Retrieves and streams a video by ID.
- **GET** `/api/v1/video`
    - Retrieves a paginated list of videos.

## Environment Variables

Ensure you have the following environment variables set up in your `.env` file:

```env
PORT=8000
MONGODB_URI="your_mongodb_connection_string"
CORS_ORIGIN=*
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
