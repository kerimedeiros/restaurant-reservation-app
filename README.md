# Restaurant Reservation System: Periodic Tables

Periodic Tables is a full-stack restaurant reservation management application designed for restaurant employees. Users can create, edit, and view reservations as well as manage table seating settings. 

## Live project

 - Frontend Deployment: [DEPLOYED HERE](https://restaurant-reservation-app-pi.vercel.app/dashboard)
 - Backend Deployment: [DEPLOYED HERE](https://restaurant-reservation-app-mu.vercel.app/) (use routes listed below) 

## Technology Used
#### Frontend:
 - JavaScript, React, React Router, HTML, CSS, Bootstrap
  
#### Backend:
 - Node.js, Express, Knex, PostgreSQL


## Frontend Overview

### View reservation dashboard:
![Dashboard view](/screenshot-images/reservation-dashboard.png "Reservation Dashboard")
### Create new reservation: 
![Dashboard view](/screenshot-images/new-reservation.png "Create New Reservation")
### Edit existing reservation:
![Dashboard view](/screenshot-images/edit-reservation.png "Edit Reservation")
### Create new table:
![Dashboard view](/screenshot-images/create-new-table.png "Create New Table")
### Seat reservation at table:
![Dashboard view](/screenshot-images/seat-reservation.png "Dashboard")
### Search for existing reservation:
![Dashboard view](/screenshot-images/search-for-reservation.png "Search For Existing Reservation")

## Backend Overview

### Routes

The API allows for the following routes:

Method | Route | Description
 -|-|-
| `GET` | `/reservations` | List all reservations for current date
| `GET` | `/reservations?date=YYYY-MM-DD` | List all reservations for specified date
| `POST` | `/reservations` | Create new reservation
| `GET` | `/reservations/:reservation_id` | List reservation by ID
| `PUT` | `/reservations/:reservation_id` | Update reservation
| `PUT` | `/reservations/:reservation_id/status` | Update reservation status
| `GET` | `/tables` | List all tables
| `POST` | `/tables` | Create new table
| `PUT` | `/tables/:table_id/seat` | Assign a table to a reservation (changes reservation's `status` to "seated")
| `DELETE` | `/tables/:table_id/seat` | Remove reservation from a table (changes reservation's `status` to "finished")



## Installation

1. Fork and clone this repository.
1. Run `cp ./back-end/.env.sample ./back-end/.env`.
1. Update the `./back-end/.env` file with the connection URLs to your ElephantSQL database instance.
1. Run `cp ./front-end/.env.sample ./front-end/.env`.
1. You should not need to make changes to the `./front-end/.env` file unless you want to connect to a backend at a location other than `http://localhost:5001`.
1. Run `npm install` to install project dependencies.
1. Run `npm run start:dev` to start your server in development mode.

## Project Reflection

This project was created for my final capstone for Thinkful's Software Engineering certification program.

Learnings included developing the frontend and backend of a full-stack application using modern web development frameworks, as well as project management, cross-device QA/testing, and bug troubleshooting. 