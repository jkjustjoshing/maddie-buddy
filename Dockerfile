FROM node:20
RUN apt-get update

WORKDIR /app

COPY ./ /app

RUN npm install
RUN npm run build

CMD ["npm", "run", "start"]

