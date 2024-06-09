FROM node:21-alpine
RUN mkdir -p /home/currency/app && chown -R  node:node  /home/currency/app
WORKDIR  /home/currency/app
COPY --chown=node:node package*.json ./
USER node
RUN npm install 
COPY --chown=node:node . .
EXPOSE 8080
RUN npm run build

CMD npm run migrate-up;npm run start
