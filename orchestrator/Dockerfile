FROM node:21-alpine
RUN mkdir -p /home/currency/orchestrator && chown -R  node:node  /home/currency/orchestrator
WORKDIR  /home/currency/orchestrator
COPY --chown=node:node package*.json ./
USER node
RUN npm install 
COPY --chown=node:node . .
EXPOSE 8080
RUN npm run build

CMD npm run start
