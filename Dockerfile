# Use an official Node.js runtime as the base image
FROM node:14
# Set the working directory in the container
WORKDIR /usr/src/app
# Install application dependencies
RUN npm install
# Copy the rest of the application code
EXPOSE 4000
COPY . .
# Specify the command to run your application
CMD ["npm", "start"]