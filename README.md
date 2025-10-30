# Courtroom Management Backend

This project is a backend application for managing courtroom operations, including judges, lawyers, courtrooms, and cases. It is built using Node.js, Express, and MongoDB.

## Features

- CRUD operations for:
  - Judges
  - Lawyers
  - Courtrooms
  - Cases

## Technologies Used

- Node.js
- Express
- MongoDB
- Mongoose

## Project Structure

```
courtroom-management-backend
├── src
│   ├── app.js                # Entry point of the application
│   ├── config
│   │   └── database.js       # Database connection configuration
│   ├── controllers
│   │   ├── casesController.js # Controller for case operations
│   │   ├── courtroomsController.js # Controller for courtroom operations
│   │   ├── judgesController.js # Controller for judge operations
│   │   └── lawyersController.js # Controller for lawyer operations
│   ├── models
│   │   ├── caseModel.js      # Mongoose schema for cases
│   │   ├── courtroomModel.js  # Mongoose schema for courtrooms
│   │   ├── judgeModel.js      # Mongoose schema for judges
│   │   └── lawyerModel.js     # Mongoose schema for lawyers
│   ├── routes
│   │   ├── casesRoutes.js     # Routes for case operations
│   │   ├── courtroomsRoutes.js # Routes for courtroom operations
│   │   ├── judgesRoutes.js     # Routes for judge operations
│   │   └── lawyersRoutes.js    # Routes for lawyer operations
│   └── utils
│       └── helpers.js         # Utility functions
├── package.json               # NPM configuration file
├── .env                       # Environment variables
├── .gitignore                 # Git ignore file
└── README.md                  # Project documentation
```

## Getting Started

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd courtroom-management-backend
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Set up your environment variables in the `.env` file. You will need to provide your MongoDB connection string.

5. Start the application:
   ```
   npm start
   ```

## API Endpoints

- **Judges**
  - `POST /judges` - Create a new judge
  - `GET /judges` - Retrieve all judges
  - `GET /judges/:id` - Retrieve a judge by ID
  - `PUT /judges/:id` - Update a judge by ID
  - `DELETE /judges/:id` - Delete a judge by ID

- **Lawyers**
  - `POST /lawyers` - Create a new lawyer
  - `GET /lawyers` - Retrieve all lawyers
  - `GET /lawyers/:id` - Retrieve a lawyer by ID
  - `PUT /lawyers/:id` - Update a lawyer by ID
  - `DELETE /lawyers/:id` - Delete a lawyer by ID

- **Courtrooms**
  - `POST /courtrooms` - Create a new courtroom
  - `GET /courtrooms` - Retrieve all courtrooms
  - `GET /courtrooms/:id` - Retrieve a courtroom by ID
  - `PUT /courtrooms/:id` - Update a courtroom by ID
  - `DELETE /courtrooms/:id` - Delete a courtroom by ID

- **Cases**
  - `POST /cases` - Create a new case
  - `GET /cases` - Retrieve all cases
  - `GET /cases/:id` - Retrieve a case by ID
  - `PUT /cases/:id` - Update a case by ID
  - `DELETE /cases/:id` - Delete a case by ID

## License

This project is licensed under the MIT License.