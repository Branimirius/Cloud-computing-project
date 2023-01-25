# Use the official Node.js image as the base image
FROM node:14

# Create a new directory for the application
RUN mkdir -p /usr/src/app

# Set the working directory
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the application code
COPY . .

# Expose the port that the application will run on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]