FROM node:24-alpine
WORKDIR /app
COPY --chown=node:node package.json ./
COPY --chown=node:node src ./src
COPY --chown=node:node public ./public
COPY --chown=node:node config ./config
COPY --chown=node:node db ./db
COPY --chown=node:node docs ./docs
COPY --chown=node:node packages ./packages
RUN mkdir data && chown node:node data
USER node
CMD ["node", "src/server.mjs"]
