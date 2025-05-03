# VinaBooking - Docker Setup

This guide explains how to set up and run the **VinaBooking** app using Docker. The app consists of three main services: **Frontend**, **Backend**, and **Database**.

## Prerequisites

Before running the app, ensure you have the following installed:

- **Docker**: [Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose**: [Install Docker Compose](https://docs.docker.com/compose/install/)

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

3. **Access the App**:

    - **Frontend**: Open your browser and navigate to [http://localhost:5173](http://localhost:5173)
    - **Backend**: The backend API is available at [http://localhost:3000/api](http://localhost:3000/api)
    - **Database**: The MySQL database is exposed on port `3306`.

4. **Stop the Services**:
   To stop the services, press `Ctrl+C` in the terminal and run:
    ```bash
    docker-compose down
    ```

---

## Docker Compose Services

### 1. **Database (MySQL)**:

- **Image**: `mysql:latest`
- **Ports**: `3306:3306`
- **Environment Variables**: Configured in .env
- **Volumes**: Data is persisted in the `db_data` volume.

### 2. **Backend (API)**:

- **Build Context**: API
- **Ports**: `3000:3000`
- **Environment Variables**: Configured in /API/.env
- **Depends On**: The database service must be healthy before the backend starts.

### 3. **Frontend (UI)**:

- **Build Context**: UI
- **Ports**: `5173:5173`
- **Depends On**: The backend service must be running.

---

## Environment Variables

The app uses environment variables for configuration. These are defined in the following files:

- **Backend**: /API/.env
- **Database**: .env

---

## Troubleshooting

### 1. **Database Connection Issues**:

- Ensure the database service is running and healthy.
- Check the `MYSQL_*` environment variables in .env.

### 2. **CORS Errors**:

- Ensure the backend allows requests from the frontend's origin (`http://localhost:5173`).

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

You will be prompted for the password, check MYSQL_PASSWORD in API/.env

---

## Folder Structure

```
VinaBooking/
├── API/                # Backend service
│   ├── src/            # Source code for the backend
│   ├── .env            # Environment variables for the backend
│   ├── Dockerfile      # Dockerfile for the backend
├── UI/                 # Frontend service
│   ├── src/            # Source code for the frontend
│   ├── Dockerfile      # Dockerfile for the frontend
├── docker-compose.yml  # Docker Compose configuration
```

---

## License

This project is licensed under the MIT License.
