# Admin, User, and Company Management Project

# Project Overview

This project is a comprehensive web application designed for managing administrators, users, and companies. It provides a secure and efficient system for performing CRUD (Create, Read, Update, Delete) operations for each role. The system allows administrators to onboard users and companies, and all three roles (Admin, User, and Company) have their own specific CRUD functionalities.

# Features
1. Admin CRUD Operations
  Create Admin: Allows the creation of new admin profiles.
  Read Admin: Retrieves information about existing admin profiles.
  Update Admin: Modifies details of an existing admin.
  Delete Admin: Removes an admin from the system.

2. User CRUD Operations
  Create User: Enables the addition of new user profiles.
  Read User: Retrieves information about existing user profiles.
  Update User: Modifies details of an existing user.
  Delete User: Removes a user from the system.

3. Company CRUD Operations
  Create Company: Facilitates the addition of new company profiles.
  Read Company: Retrieves information about existing companies.
  Update Company: Modifies details of an existing company.
  Delete Company: Removes a company from the system.

# Technologies Used
1. Backend: NestJS
2. Database: PostgreSQL, Prisma ORM
3. Authentication: Implement secure authentication mechanisms for user and admin access using JWT.

# Getting Started
1. Clone the repository.
  git clone https://github.com/yourusername/admin-user-company-management.git

2. Navigate to the project directory.
  cd admin-user-company-management

3. Change Node Version
  nvm install 18.18.0 or nvm use 18.18.0

4. Install dependencies.
npm install

5. Configure the database and authentication settings.

5. Run the application.
## Running the app
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod


## Test
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov


# Contributing
Contributions are welcome! If you'd like to contribute to this project, please follow our Contribution Guidelines.

# License
This project is licensed under the MIT License.
