# Student-Point-Tracker

## Installation & Setup

The recommended method of installing and setting up the Student Point Tracker is via Docker & Docker Compose.

### Docker

To get started with a Docker installation, this repo comes with some tools to help with the setup.

1. Install and Run the Setup Script

There are two different setup scripts available for download, depending if you are on Windows or Linux, which can be downloaded, respectively:

```powershell
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/confused-Techie/student-point-tracker/main/scripts/setup.ps1" -OutFile "./setup.ps1"
```

```bash
curl -O -L "https://raw.githubusercontent.com/confused-Techie/student-point-tracker/main/scripts/setup.sh"
```

Then you'll just need to run these files to create your initial setup:

```powershell
.\setup.sh
```

```bash
cmod u+x setup.sh
./setup.sh
```

Once the setup script has been run, it'll do the following for you automatically:

* Creates the `sql` directory. This will contain your SQL DB migrations, and should not be modified manually.
* Adds the migrations of this repo into the `sql` directory.
* Creates the file `app.example.yaml` which can be used as a known good copy of the generic configuration of this project.
* Creates the file `docker-compose.yaml` which can be used to setup your Docker instance with minimal modification.
* Copies the `app.example.yaml` to `app.yaml` so that you have a config file to modify.

2. Configure your Instance

Now you can configure your instance, ensuring to configure all of the following:

* `app.yaml`
* `docker-compose.yaml`
* `point-presets.yaml`

More information on configuration can be found within the [docs](#configuration).

3. Startup

Once everything is configured you can startup the Docker instances with:

```bash
docker-compose up
```

## Configuration

The configuration of this repo lives across a few separate files and controls a whole host of features.

### `app.yaml`

This is the main bulk of configuration. This file is only read during startup time, so any changes made here will require a restart of the server.

* `PORT`: This is the numeric port that the server will be available on. Keep in mind whatever port chosen here must be the port used on the docker containers side within your `docker-compose.yaml` file. This will not change the port on the host system.
* `SERVER_URL`: This is the URL that your instance of the server is available at. Such as `https://example.com` this is used for redirection, and pagination.
* `DB_HOST`: This is the hostname or IP address of your PostgreSQL database. If both the server and the SQL database are within individual Docker Containers, you'll need to set this to `172.17.0.1` like seen in the example `docker-compose.yaml`.
* `DB_USER`: This is the username to your PostgreSQL database.
* `DB_PASS`: This is the password to your PostgreSQL database.
* 
