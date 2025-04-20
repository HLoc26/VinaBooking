FROM node:22

WORKDIR /app

# Install dependencies required for bcrypt compilation
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    make \
    g++

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

RUN npm install -g nodemon

CMD ["nodemon", "--legacy-watch", "./src/server.js"]