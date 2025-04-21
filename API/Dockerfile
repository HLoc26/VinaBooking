FROM node:22-alpine

WORKDIR /app

# Install dependencies required for bcrypt compilation
# Alpine uses apk instead of apt-get
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    build-base

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

RUN npm install -g nodemon

CMD ["nodemon", "--legacy-watch", "./src/server.js"]