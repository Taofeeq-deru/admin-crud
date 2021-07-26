# An admin crud with restricted access based on persmissions

Project was built using django and react JS
Backend is a django-restframework API

## Start backend

If you don't have virtualenv installed, run this first:

### `pip install virtualenv`

This installs virtualenv module on your machine.
Then, cd to backend folder and create virtual environment:

### `python3 -m venv env`

Activate virtual env, for Windows, run:

### `env\Scripts\activate`

for MacOS, run:

### `source env/bin/activate`

cd to src folder inside the backend folder
Install all necessary modules:

### `pip install -r requirements.txt`

Start the django server

### `py manage.py runserver`

Navigate to [http://127.0.0.1:8000/products/](http://127.0.0.1:8000/products/) to find the api

Admin login details:

### `username: admin`

### `password: admin1234`

## Start frontend

From the root folder cd to frontend/gui
Delete the package-lock.json file.

Install npm packages:

### `npm install`

Start react app:

### `npm start`

Navigate to [http://localhost:3000](http://localhost:3000) to view react app

Login as admin using details listed above to gain access to all api features or sign up as user.
