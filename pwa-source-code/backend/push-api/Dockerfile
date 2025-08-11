FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json ./
RUN npm install --production

# Copy app source
COPY . .

# Expose port
EXPOSE 3008

# Run the application
CMD ["node", "server.js"]