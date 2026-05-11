FROM node:22
# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json ./
RUN yarn

# Bundle app source
COPY . .

RUN yarn build

RUN rm -r src

EXPOSE 3000
CMD [ "node", "dist/main" ]
