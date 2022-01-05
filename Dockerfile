FROM node:14-slim

RUN mkdir -p /home/app
COPY . /home/app 
WORKDIR /home/app
RUN npm install 
CMD ["node","/home/app/src/index.js"]