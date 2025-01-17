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
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication:** Secure login and registration system.
- **Claims Submission:** Users can submit various types of claims with detailed information and attachments.
- **Real-time Status Tracking:** Monitor the progress of claims through different stages.
- **Detailed History:** View comprehensive history of all remarks, statuses, and actions taken on each claim.
- **Responsive Design:** Optimized for all devices ensuring a seamless user experience.
- **State Management:** Efficient state handling using Redux Toolkit.
- **Testing:** Comprehensive testing setup with Jest and React Testing Library.


## Design Choices

### 1. **Component-Based Architecture**

Adopting a modular component-based structure promotes reusability and maintainability. By segregating components into domain-specific directories (e.g., `claims`, `policies`), the codebase remains organized and scalable.

### 2. **State Management with Redux Toolkit**

Utilizing Redux Toolkit simplifies state management with less boilerplate. The `slices` approach allows for logical grouping of state and reducers, making the state predictable and easier to debug.

### 3. **TypeScript for Type Safety**

Integrating TypeScript enhances code reliability by catching type-related errors during development. The `types/` directory centralizes all type definitions, ensuring consistency across the application.

### 4. **Tailwind CSS for Styling**

Tailwind CSS offers a utility-first approach, enabling rapid and consistent styling directly within component classes. This reduces the need for writing extensive custom CSS and promotes a cohesive design language.

### 5. **Responsive Design Principles**

Ensuring the application is fully responsive guarantees a seamless user experience across various devices and screen sizes. This is achieved through Tailwind's responsive utilities and thoughtful component design.

### 6. **Routing with React Router**

Managing navigation with React Router provides a declarative and dynamic approach to handling multiple views within the application. The `routes/` directory encapsulates all routing logic, keeping it centralized and easy to manage.

### 7. **Testing with Jest and React Testing Library**

Incorporating Jest alongside React Testing Library facilitates robust testing practices. This ensures components behave as expected and helps prevent regressions during development.

### 8. **Mock API with JSON Server**

Using `db.json` with JSON Server allows for rapid prototyping and testing without a fully developed backend. This enables frontend development to proceed in parallel with backend API development.

### 9. **Utility Functions**

The `utils/helpers.ts` file houses common utility functions, promoting DRY (Don't Repeat Yourself) principles and simplifying complex logic within components.

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** (v6 or higher) or **yarn**

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/claims-management-system.git
   cd claims-management-system
   ```

2. **Install Dependencies**

   Using npm:

   ```bash
   npm install
   ```

   Or using yarn:

   ```bash
   yarn install
   ```

### Running the Application

1. **Start the Mock API Server**

   The project uses JSON Server to simulate backend APIs.

   Using npm:

   ```bash
   npm run server
   ```

   Or using yarn:

   ```bash
   yarn server
   ```

   This will start the JSON Server at `http://localhost:3001`.

2. **Start the React Application**

   In a separate terminal window/tab:

   Using npm:

   ```bash
   npm start
   ```

   Or using yarn:

   ```bash
   yarn start
   ```

   This will launch the application in your default browser at `http://localhost:3000`.

3. **Running Tests**

   To execute the test suite:

   Using npm:

   ```bash
   npm test
   ```

   Or using yarn:

   ```bash
   yarn test
   ```

## Technologies Used

- **React**: Frontend library for building user interfaces.
- **TypeScript**: Superset of JavaScript for static typing.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
- **Redux Toolkit**: Simplifies Redux state management.
- **React Router**: Declarative routing for React applications.
- **JSON Server**: Mock REST API for development and testing.
- **Jest**: JavaScript testing framework.
- **React Testing Library**: Testing utilities for React components.
- **Heroicons & Lucide-React**: Icon libraries for enhancing UI.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. **Fork the Repository**

2. **Create a Feature Branch**

   ```bash
   git checkout -b feature/YourFeatureName
   ```

3. **Commit Your Changes**
****
   ```bash
   git commit -m "Add your message here"
   ```

4. **Push to the Branch**

   ```bash
   git push origin feature/YourFeatureName
   ```

5. **Open a Pull Request**

## License

This project is licensed under the [MIT License](LICENSE).

---

*Feel free to customize this README further to better fit the specifics and nuances of your project.*