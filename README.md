# README
This repo is simple rest api with express, mongoose, kue, jwt. Secured by cors & helmet. Bonus integrate Kue-UI to app.

## Requirement
1. MongoDB
2. Redis

## How to use
1. `yarn install`
2. copy .env.example to .env
3. `yarn dev` -> to run web server
4. `yarn dev:worker:transfer` -> to run transfer worker function

* Bonus, to see queue dashboard, go to: http://localhost:1234/kue-ui

## Example Data
Data has been generated using [mongodump](https://docs.mongodb.com/database-tools/mongodump/) in folder `/dump` if you want to import the data, use [mongorestore](https://docs.mongodb.com/database-tools/mongorestore/)