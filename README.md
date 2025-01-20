# Insurance Dashboard

A Claims Management System built with React and Tailwind CSS. This dashboard-based application allows users to submit claims, track their status, and view detailed history, ensuring transparency and efficiency in the claims process.

## Table of Contents

- [Features](#features)
- [Design Choices](#design-choices)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Technologies Used](#technologies-used)
- [Deployment](#deployment)

## Features

- **User Authentication**
- **Claims Submission**
- **Real-time Claim Status Tracking**
- **Detailed Claim History**
- **Responsive Design**
- **State Management**
- **Testing**

## Design Choices

### 1. **Component-Based Architecture**

The app is organized into smaller, reusable parts called components. For example, components related to `claims` and `policies` are kept in separate folders. This makes the code easier to maintain and reuse in the future.

### 2. **State Management with Redux Toolkit**

Redux Toolkit helps manage data (state) in the app without writing too much extra code. Using `slices` keeps related data and functions together, making it easier to track and debug how the data changes.

### 3. **TypeScript for Type Safety**

TypeScript ensures that variables, functions, and components are used correctly by checking for errors during development. All the app’s types are stored in one folder `(types/)` to keep things consistent and organized.

### 4. **Tailwind CSS for Styling**

Tailwind CSS lets you add styles quickly using predefined classes directly in your components. It reduces the need to write custom CSS and keeps the design consistent throughout the app.

### 5. **Responsive Design Principles**

The app is designed to work well on different screen sizes. Tailwind's responsive features and component design make this possible.

### 6. **Routing with React Router**

React Router handles navigation in the app, making it easy to move between pages or views. All the routing logic is stored in one folder (routes/) to keep it organized.

### 7. **Testing with Jest and React Testing Library**

Jest and React Testing Library are used to test the app.

### 8. **Mock API with JSON Server**

The project uses a simple file `(db.json)` to act like a backend.

### 9. **Utility Functions**

Common functions used in multiple places are kept in one file `(utils/helpers.ts)`. This avoids repeating the same code and makes the app easier to manage.

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

- **Node.js** (v16+)
- **npm** (v10+)

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/daquiver1/insurance_dashboard.git
   cd insurance-dashboard
   ```

2. **Install Dependencies**

   Using npm:

   ```bash
   npm install
   ```

### Running the Application

1. **Start the Mock API Server**

   ```bash
   npm run server
   ```

   This will start the JSON Server at `http://localhost:3001`.

2. **Start the React Application**

   In a separate terminal window/tab:

   ```bash
   npm start
   ```

   This will launch the application in your default browser at `http://localhost:3000`.

3. **Login**

   Use the following credentials to log in:

   - **Username**: `user`
   - **Password**: `user123`

4. **Running Tests**

   To execute the test suite:

   Using npm:

   ```bash
   npm test
   ```

## Technologies Used

- **React**
- **TypeScript**
- **Tailwind CSS**
- **Redux Toolkit**
- **React Router**
- **JSON Server**
- **Jest**
- **React Testing Library**
- **Lucide-React**

## Deployment

The app is deployed on vercel and can be accessed [here](https://insurance-dashboard-peach.vercel.app/)
