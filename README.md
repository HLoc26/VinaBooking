# VinaBooking - Docker Setup

This guide explains how to set up and run the **VinaBooking** app using Docker. The app consists of four main services: **Frontend**, **Backend**, **Database**, and **Redis**.

## Prerequisites

Before running the app, ensure you have the following installed:

-   **Docker**: [Install Docker](https://docs.docker.com/get-docker/)
-   **Docker Compose**: [Install Docker Compose](https://docs.docker.com/compose/install/)

---

## Setting Up Environment Variables

1. **Create Environment Files**:

   - Copy the example environment files and configure them:
   
   ```bash
   cp .env.example .env
   cp API/.env.example API/.env
   ```
   
   - Edit the `.env` and `API/.env` files with your preferred settings.

2. **Required Environment Variables**:

   - In the root `.env` file:
     - `MYSQL_ROOT_PASSWORD`: Root password for MySQL
     - `MYSQL_DATABASE`: Database name
     - `MYSQL_USER`: Database username
     - `MYSQL_PASSWORD`: Database password
   
   - In the `API/.env` file (additional variables):
     - `JWT_SECRET`: Secret key for JWT authentication
     - `MAIL_USER`: Email for sending notifications
     - `MAIL_PASS`: Email app password

---

## Running the App

1. **Clone the Repository**:

    ```bash
    git clone https://github.com/HLoc26/VinaBooking.git
    cd VinaBooking
    ```

2. **Start the Services**:
   Use Docker Compose to build and start all services:

    ```bash
    docker-compose up --build
    ```

3. **Initialize the Database** (first time setup):
   After services are running, initialize the database schema:

    ```bash
    # Option 1: Create tables only
    docker compose exec backend node src/scripts/sync-db.js
    
    # Option 2: Create tables with modifications (updates existing schema)
    docker compose exec backend node src/scripts/sync-db.js --alter
    
    # Option 3: Reset everything (WARNING: Deletes all data)
    docker compose exec backend node src/scripts/sync-db.js --force
    ```

4. **Access the App**:

    - **Frontend**: Open your browser and navigate to [http://localhost:5173](http://localhost:5173)
    - **Backend**: The backend API is available at [http://localhost:3000/api](http://localhost:3000/api)
    - **Database**: The MySQL database is exposed on port `3306`
    - **Redis**: Redis is available on port `6379`

5. **Stop the Services**:
   To stop the services, press `Ctrl+C` in the terminal and run:
    ```bash
    docker-compose down
    ```

---

## Docker Compose Services

### 1. **Database (MySQL)**:

-   **Image**: `mysql:latest`
-   **Ports**: `3306:3306`
-   **Environment Variables**: Configured in .env
-   **Volumes**: Data is persisted in the `db_data` volume.

### 2. **Backend (API)**:

-   **Build Context**: API
-   **Ports**: `3000:3000`
-   **Environment Variables**: Configured in /API/.env
-   **Depends On**: The database and Redis services must be healthy before the backend starts.

### 3. **Frontend (UI)**:

-   **Build Context**: UI
-   **Ports**: `5173:5173`
-   **Depends On**: The backend service must be running.

### 4. **Redis**:

-   **Image**: `redis:8.0-rc1-alpine`
-   **Ports**: `6379:6379`
-   **Volumes**: Data is persisted in the `redis_data` volume
-   **Usage**: Used for OTP storage, session management, and caching

---

## Environment Variables

The app uses environment variables for configuration. These are defined in the following files:

-   **Root**: `.env` (for database configuration)
-   **Backend**: `/API/.env` (for API and other service configurations)

---

## API Features

- **Authentication**: JWT-based authentication system
- **OTP Verification**: Email-based OTP for account verification
- **Accommodation Management**: Create and manage accommodation listings
- **Booking System**: Reserve and manage bookings

---

## Troubleshooting

### 1. **Database Connection Issues**:

-   Ensure the database service is running and healthy.
-   Check the `MYSQL_*` environment variables in .env.

### 2. **CORS Errors**:

-   Ensure the backend allows requests from the frontend's origin (`http://localhost:5173`).

### 3. **Rebuilding Services**:

If you make changes to the code, rebuild the Docker images:

```bash
docker-compose up --build
```

### 4. **Changing .env Information**:

After changing the environment variables, run:

```bash
docker compose down -v
docker compose build
docker compose up -d
```

### 5. **Redis Connection Issues**:

-   Verify Redis is running: `docker compose ps`
-   Check Redis logs: `docker compose logs redis`

---

## Additional Commands

### Check Running Containers

```bash
docker ps
```

### Remove All Containers and Volumes

```bash
docker-compose down -v
```

### Access the Database

You can connect to the MySQL database using a MySQL client (replace MYSQL_USER with the username in .env):

```bash
mysql -h 127.0.0.1 -P 3306 -u MYSQL_USER -p
```

You will be prompted for the password, check MYSQL_PASSWORD in .env

### Access Redis CLI

```bash
docker compose exec redis redis-cli
```

---

## Folder Structure

```
VinaBooking/
├── API/                # Backend service
│   ├── src/            # Source code for the backend
│   │   ├── classes/    # Domain models & enums
│   │   ├── config/     # Database & Redis configuration
│   │   ├── controllers/# Request handlers
│   │   ├── database/   # Database models
│   │   ├── routes/     # API routes
│   │   ├── scripts/    # Utility scripts
│   │   ├── services/   # Business logic
│   │   └── server.js   # Main entry point
│   ├── .env            # Environment variables for the backend
│   └── Dockerfile      # Dockerfile for the backend
├── UI/                 # Frontend service
│   ├── src/            # Source code for the frontend
│   │   ├── app/        # App configuration
│   │   ├── components/ # Reusable UI components
│   │   ├── features/   # Redux features
│   │   ├── pages/      # Page components
│   │   ├── utils/      # Utility functions
│   │   └── main.jsx    # Entry point
│   ├── Dockerfile      # Dockerfile for the frontend
│   └── vite.config.js  # Vite configuration
├── docker-compose.yml  # Docker Compose configuration
└── .env                # Environment variables for database
```

---

## License

This project is licensed under the MIT License.
