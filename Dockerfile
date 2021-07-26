FROM node:lts-alpine
WORKDIR /server
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run transpile
RUN rm -r source node_modules
RUN npm ci
CMD ["npm", "start"]