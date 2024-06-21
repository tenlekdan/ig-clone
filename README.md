# Instagram Clone

An Instagram clone built with React for the frontend and Node.js for the backend. This project uses Prisma for database management, AWS for storage, Multer for handling file uploads, and Sharp for image processing.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup and Installation](#setup-and-installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Usage](#usage)
- [License](#license)

## Features

- User authentication (signup, login, logout)
- Create, read, update, delete (CRUD) posts
- Image upload and processing
- Follow/unfollow users
- Like and comment on posts
- Real-time notifications
- Responsive design

## Tech Stack

### Frontend

- React
- Redux
- Axios
- React Router

### Backend

- Node.js
- Express
- Prisma
- Multer
- Sharp
- AWS SDK

### Database

- PostgreSQL

### Storage

- AWS S3

## Setup and Installation

### Prerequisites

- Node.js (v14 or above)
- PostgreSQL
- AWS account (for S3)
- Git

### Clone the Repository

```sh
git clone https://github.com/your-username/instagram-clone.git
cd instagram-clone
```

## Backend
```sh
cd express
npm install
```

## Frontend
```sh
cd react
npm install
```

## Environment Variables
Create a .env file in both the backend and frontend directories with the following environment variables:

### Backend (.env)

```sh
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="your_jwt_secret"
AWS_ACCESS_KEY_ID="your_aws_access_key_id"
AWS_SECRET_ACCESS_KEY="your_aws_secret_access_key"
S3_BUCKET_NAME="your_s3_bucket_name"
S3_REGION="your_s3_region"
```

### Frontend (.env)

```sh
REACT_APP_API_URL="http://localhost:5000/api"
```

## Running the Application

### Start the Backend
```sh
cd express
npx prisma migrate dev --name init
npx prisma generate
npm run dev
```

### Start the Frontend
```sh
cd react
npm run dev
```

## Usage
- Open your browser and navigate to http://localhost:3000.
- Sign up for a new account or log in with existing credentials.
- Create a new post by uploading an image.
- Follow other users, like and comment on posts, and enjoy using the Instagram clone!

## License
This project is licensed under the MIT License. See the LICENSE file for details.


### Additional Notes

- Ensure that your PostgreSQL database is running and accessible.
- Replace placeholder values in the `.env` files with your actual credentials and configuration.
- If you encounter any issues, check the logs for detailed error messages.

