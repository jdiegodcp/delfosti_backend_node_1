FROM node:21.7.3-bullseye

RUN mkdir /code

WORKDIR /code

COPY package.json tsconfig.json ormconfig.json package-lock.json ./

COPY src/ ./src

RUN npm install

RUN npm run tsc

EXPOSE 3000

CMD ["npm","start"]

