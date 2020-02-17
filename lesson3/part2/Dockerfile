FROM node:12.0 as builder

WORKDIR /usr/app
COPY . .
RUN npm install && npm run build \
    && rm -rf node_modules \
    && npm install --prod

FROM node:12.0-slim

WORKDIR /usr/app

COPY --from=builder /usr/app/node_modules node_modules
COPY --from=builder /usr/app/build .
COPY --from=builder /usr/app/tools tools
RUN ls

CMD ["node", "."]