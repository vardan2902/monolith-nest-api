# Base image
FROM node:20.11.0 as base

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ARG NODE_ENV

# Development stage
FROM base as development
ENV NODE_ENV=development
CMD ["npm", "run", "start:dev"]

# Production stage
FROM base as production
ENV NODE_ENV=production
RUN npm run build
CMD ["npm", "run", "start:prod"]
