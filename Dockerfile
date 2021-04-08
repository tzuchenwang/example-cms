FROM node:latest
EXPOSE 8080
COPY . .
RUN npm install --legacy-peer-deps
CMD npm run dev