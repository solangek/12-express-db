# 🚀 START THE DATABASE CONTAINER
Execute the following command in your terminal from the directory containing docker-compose.yml:
`docker compose up -d`

- `docker compose up` : Reads the configuration and starts the service.
- `-d`: Runs the containers in detached mode (in the background).

You can verify the container is running and healthy with:
`docker compose ps`

Note the names of the containers (last column).

# ACCESS YOUR DATABASE

## DIRECTLY FROM A TERMINAL
You can access the mysql command-line tool inside the running container:
1.	Find your container's name (e.g., mariadb-server) using docker compose ps.
2.	Execute the connection command:
      docker exec -it <container_name> mysql -u <user> -p
      Then enter the password for <user>. Example:
      docker exec -it mariadb-server mariadb -u user1 -p
      You will enter the mySQL shell, where you can run SQL commands (e.g., show tables to list tables).

## WITH PHPMYADMIN

Access phpMyAdmin in your web browser at http://localhost:8080.

Use these credentials (according to the docker file):
- Host / Server: mariadb
- Username: user1 (or root)
- Password: password1 (if logging in as user1) or password (if logging in as root)
- Port: 3306 (default)

# STOP AND CLEAN UP

## STOPPING THE CONTAINER (DATA PERSISTS)
To stop the container while keeping the persistent data volume for a quick restart later:
`docker compose stop`

## STOPPING AND REMOVING CONTAINERS (DATA PERSISTS)
To stop and remove the container and network (but still keep the persistent data volume):
`docker compose down`

## REMOVING EVERYTHING (DATA IS LOST)
To stop, remove the container, and delete the persistent volume (meaning your database data will be lost):
`docker compose down -v`
