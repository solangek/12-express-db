# 12-express-sqlite

A sample sqlite/mariadb project allowing saving Contact cards into a database, using Sequelize ORM with SQLite, and Express.

1. install packages:
- for sqlite: npm install --save express sequelize sqlite3
- for mariadb: npm install --save express sequelize mariadb

2. if needed edit the file models/index.js and replace your own DB configuration.
in this course we use SQLite, so the configuration will look like this:

> "development": {  
> "dialect": "sqlite",  
> "storage": "./database.sqlite3"  
> }

3. import the Model classes where needed in your code depending on the export of the model file.
In this example, the model file is called contact.js and the model class is called Contact.

const Contact = require('../models/contact');

4. in app.js we connect and sync the database with the following code :

> (async () => {  
> try {  
>   await sequelize.authenticate();  
>   console.log('Connection has been established successfully.');  
> await sequelize.sync();  
> console.log('All models were synchronized successfully.');  
> } catch (error) {  
> console.error('Unable to connect to the database:', error);  
> }  
> })();  

It will create and use a SQLite database file called database.sqlite3 in the root of the project.
You can delete this file to start over the database.

Execution will create and use a SQLite database file called database.sqlite3 in the root of the project.
You can view the SQLite contents using the DB Browser for SQLite tool (https://sqlitebrowser.org/) or any other SQLite tool.
