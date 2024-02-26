# Installation

## Docker (Recommended)

To get started with setting up SPT on Docker, ensure to first create the expected file structure.

After choosing your root folder of where to setup your installation, create the following files and folders:

```
├── docker-compose.yml
├── storage/
│   ├── sessions/
│   ├── sql/
│   │   └── 0001-initial-migration.sql
│   └── app.yaml
```

* `docker-compose.yml` This Docker Compose file will create the actual Docker instances we will use.
* `storage/`: Will then be the top level directory of all data stored by this application.
* `sessions/`: Will be the location all active session data is saved by the server.
* `sql/`: Will be where SQL specific data is saved, such as the initial migration which creates the database.
* `app.yaml`: Will be the major configuration file of the entire program.

## Docker-Compose

The Docker-Compose file is what does all setup for this application, which includes setting up the application itself, as well as the PostgreSQL database it relies on.

While working with this file, the official [Docker Docs](https://docs.docker.com/compose/) should be referenced if needed.

The end result Docker-Compose file should look something like the below:

```yaml
version: "3.4"

services:
  db:
    image: postgres
    container_name: spt_db
    restart: always
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_USER: postgres
      POSTGRES_DB: mainDB
    volumes:
      # Ensure we make our initialization scripts accessible
      - ./storage/sql:/docker-entrypoint-initdb.d
    ports:
      - "5432:5432"

  backend:
    image: ghcr.io/confused-techie/student-point-tracker:latest
    container_name: spt_be
    depends_on:
      - db
    restart: always
    environment:
      DB_USER: postgres
      DB_PASS: password
      DB_DB: mainDB
      DB_HOST: 172.18.0.1
      DB_PORT: 5432
      PORT: 8080
      RESOURCE_PATH: "/usr/src/app/storage"
    ports:
      - "8153:8080"
    volumes:
      - ./storage:/usr/src/app/storage
```

> Although if any errors or issues arise, please refer to the project's [`docker-compose.yml`](../docker-compose.yml) to view the most up to date version of this file.

When setting up the above file you'll want to pay special attention to the following entries:
  * `services.db.volumes`: Here is where you need to map the Database volume to your Docker Host's volume. Without this entry the Database will never find the `0001-initial-migration.sql` migrations file, and will fail to create any valid schema for the application.
  * `services.backend.ports`: This will be the port that the application is available on, on your Docker Host.
  * `services.backend.environment.PORT`: This port must match exactly with the port specified in the Docker Container's port (`services.backend.ports`). A quick example of a proper port configuration would be: `services.backend.environment.PORT: 8080` and `services.backed.ports: - 80:8080` this would mean that the application is available on the Docker **Container** via PORT `8080`, meanwhile the Docker Container's PORT `8080` is being mapped to the Docker **Hosts** port `80`.  

## App.yaml

The `app.yaml` is a very simple YAML configuration file for the application, that allows setting any value the system accepts.

You may have noticed that any values here match some values set within the Docker-Composes `services.backend.environment`, this is by design, and either should work, but there are some [recommendations](./configuration.md).

## Migration

The Migration file (`0001-initial-migration.sql`) should be copied **exactly** from [`./migrations/0001-initial-migrations.sql`](../migrations/0001-initial-migrations.sql).
