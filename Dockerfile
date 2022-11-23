FROM node:lts-alpine3.15 as builder
WORKDIR /fjordbot
COPY . .
RUN apk add --no-cache python2 python3 make gcc g++
RUN npm install && npm run build

FROM node:lts-alpine as server
WORKDIR /fjordbot
COPY --from=builder /fjordbot .
ENTRYPOINT ["npm", "run-script", "dockerrun"]
