FROM node:22
WORKDIR /usr/src/app

COPY package.json ./
RUN yarn

COPY . .

RUN yarn build

RUN rm -r src

EXPOSE 3003
CMD [ "node", "dist/main" ]
