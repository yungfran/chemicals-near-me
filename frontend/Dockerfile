FROM node:15.13-alpine
WORKDIR /frontend
COPY ["package.json", "package-lock.json", "./"]
RUN npm install --quiet
COPY . .
EXPOSE 3000
CMD ["npm", "start"]