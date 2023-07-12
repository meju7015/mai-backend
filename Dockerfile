FROM node:18.16

COPY . /app
WORKDIR /app

RUN rm -R ./node_modules

RUN npm install
RUN npm run build

EXPOSE 8000

CMD ["node", "./dist/main.js"]
