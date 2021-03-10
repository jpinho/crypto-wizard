FROM node:15.3.0

LABEL version="1.0"
LABEL maintainer = ["jpe.pinho@gmail.com"]

WORKDIR /app

COPY . .
RUN npm install

EXPOSE 5000

CMD ["npm", "run", "dev"]
