# Start your image with a node base image
FROM node:18-alpine

# The /app directory should act as the main application directory
WORKDIR /app

# Copy the app package and package-lock.json file
COPY package*.json ./
COPY *.sh ./

# Copy local directories to the current local directory of our docker image (/app)
COPY ./backend ./backend
COPY ./frontend ./frontend

# Install node packages, install serve, build the app, and remove dependencies at the end
RUN sh install.sh && rm -fr node_modules

EXPOSE 3000
EXPOSE 3141

# Start the app using serve command
CMD [ "sh", "start.sh" ]