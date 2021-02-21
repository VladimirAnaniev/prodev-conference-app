FROM node:15-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.7.3/wait /wait
RUN chmod +x /wait
CMD /wait && npm run migrate -- up && npm run dev
