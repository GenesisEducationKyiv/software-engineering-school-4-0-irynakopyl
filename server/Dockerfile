FROM node:21-alpine
RUN mkdir -p /home/currency/server && chown -R  node:node  /home/currency/server
WORKDIR  /home/currency/server
COPY --chown=node:node package*.json ./
USER node
RUN npm install 
COPY --chown=node:node . .
EXPOSE 8080
RUN npm run build

CMD npm run migrate-up;npm run start
