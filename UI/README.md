# Hotel Booking App - UI

This is the frontend of the Hotel Booking App, built with React and Vite. It provides a fast and modern user interface for users to browse hotels, book accommodations, and manage their bookings.

## Features

-   **Responsive Design:** Optimized for mobile, tablet, and desktop devices.
-   **Authentication:** Login and register functionality with JWT-based authentication.
-   **Search and Filter:** Search for hotels and filter by amenities, price, and location.
-   **State Management:** Powered by Redux Toolkit for managing authentication and app state.
-   **API Integration:** Communicates with the backend API for data fetching and user authentication.

## Tech Stack

-   **React**: Frontend library for building user interfaces.
-   **Vite**: Fast development server and build tool.
-   **Material-UI**: Component library for consistent and modern UI design.
-   **Redux Toolkit**: State management for authentication and global state.
-   **Axios**: HTTP client for API requests.

## Getting Started

### Prerequisites

-   Node.js (v16 or higher)
-   npm or yarn

### Installation

Clone the whole repository (including the API):

```sh
git clone https://github.com/your-username/hotel-booking-ui.git
cd hotel-booking-ui
```

Install dependencies:

```sh
npm install
```

Start the development server:

```sh
npm run dev
```

Open the app in your browser:

```
http://localhost:5173
```

## Build for Production

To build the app for production:

```sh
npm run build
```

The production-ready files will be in the `dist` folder.

## Linting

To run ESLint and check for code issues:

```sh
npm run lint
```

## Folder Structure

```
src/
├── components/        # Reusable UI components (e.g., Navbar, Footer, HotelCard)
├── features/          # Redux slices and API integrations
├── pages/             # Page components (e.g., Landing, Login, Register)
├── app/               # Redux store and Axios instance
├── assets/            # Static assets (e.g., images, icons)
├── utils/             # Utility functions (e.g., price conversion)
```

## API Integration

The app communicates with the backend API hosted at `http://localhost:3000/api`. Ensure the backend server is running before testing the app.

## License

This project is licensed under the MIT License.

