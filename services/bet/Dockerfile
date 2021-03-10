FROM node:15.3.0

LABEL version="1.0"
LABEL maintainer = ["jpe.pinho@gmail.com"]

WORKDIR /app

COPY . .
RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
