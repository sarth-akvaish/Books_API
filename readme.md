# Social Networking API

This repository contains the source code for a Books API built using Node.js, Express, and MySQL. The API provides endpoints for user authentication, seller authentication, and Books management.

Explained in Video : https://drive.google.com/file/d/1pRudLmNTBLwwvu36p-F6XoIBfAXfI2Cq/view?usp=sharing
## Installation

1. Clone this repository to your local machine:

```
git clone https://github.com/sarth-akvaish/Books_API.git
```

2. Install dependencies:

```
cd <repository-directory>
npm install
```

3. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Define the following environment variables in the `.env` file:

```
SQL_HOST=
SQL_user=
SQL_password=
SQL_database=
PORT=
```

## Available Routes

### Authentication Routes

#### POST /api/auth/users/login
- Endpoint for user login.
- Request Body:
  - `email`: User's email address.
  - `password`: User's password.
- Returns:
  - `token`: JSON Web Token for authentication.

#### POST /api/auth/users/register
- Endpoint for user registration.
- Request Body:
  - `username`: User's username.
  - `email`: User's email address.
  - `password`: User's password.
  - `name` : User's name


### Seller Routes

#### POST /api/auth/sellers/login
- Endpoint for user login.
- Request Body:
  - `email`: Seller's email address.
  - `password`: Seller's password.
- Returns:
  - `token`: JSON Web Token for authentication.

#### POST /api/auth/sellers/register
- Endpoint for user registration.
- Request Body:
  - `username`: Seller's username.
  - `email`: Seller's email address.
  - `password`: Seller's password.
  - `name` : Seller's name

#### GET /api/sellers/books
- Endpoint for fetching all books in the databse.
- Does not Requires authentication token.

#### POST /api/auth/sellers/addBook
- Endpoint for adding a Book.
- Do Requires authentication token.
- Request Body:
  - `title`: Book Title.
  - `author`: Book Author.
  - `publishedDate`: Book Published Date.
  - `price`: Book Author.

#### POST /api/auth/sellers/addBooks
- Endpoint for adding Multiple Books through .csv file.
- Do Requires authentication token.
- Request Body:
  - `file`: CSV file.

#### GET /api/auth/sellers/myBooks
- Endpoint for fetching all Books of a Seller.
- Requires authentication token.

#### POST /api/auth/sellers/deleteBook
- Endpoint for deleting the Books of a Seller.
- Requires authentication token.
- Requires id of the book as query paramter.

## Usage

1. Run the server:

```
npm run dev
```

2. Access the API using an API client such as Postman or curl.



# API Documentation

This document provides an overview of the routes available in the API.
