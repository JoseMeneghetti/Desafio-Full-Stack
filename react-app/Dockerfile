FROM node:16.15.0

WORKDIR /app

COPY . /app

# RUN npm install serve -g

RUN npm install

# RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "dev"]