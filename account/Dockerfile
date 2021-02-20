FROM node:15-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
CMD npm run migrate -- up && npm run dev
