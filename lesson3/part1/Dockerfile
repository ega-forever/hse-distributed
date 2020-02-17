FROM node:12.0 as builder

WORKDIR /usr/app
COPY . .
RUN npm install

FROM node:12.0-slim

WORKDIR /usr/app

COPY --from=builder /usr/app/node_modules node_modules
COPY --from=builder /usr/app/index.js .
RUN ls

CMD ["node", "."]