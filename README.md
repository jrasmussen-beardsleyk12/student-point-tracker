# Student-Point-Tracker

The server side application 'Student-Point-Tracker' is an application that hopes to help encourage students to behave and preform in their time at school.
Although, obviously, this application cannot do this by itself. Instead this application should be used as the solution for how administration and teachers can maintain this effort.

As gamification becomes ever more present in life, it seems this has extended to keeping track of performance and behavior at schools, where in the instance that inspired this project, one such school found success in attributing points to students. Such as they arrive for the day, they get a point, they get detention they lose a point, etc. But as the method for tracking and managing all of this was given to office staff, the solution of course was a huge spreadsheet. Which very well could work depending on your school size, and other factors, but in our case the website would crash client side, and required far more man time than should be required to manage such a thing. At this point, that's where 'Student-Point-Tracker' comes in.

This application does everything possible to be partial to the dynamic setups of schools, and the various requirements they may have, while still delivering on this core experience.

That is exactly why so much of the application is fully customizable, especially once we dive into `Tasks` (Or in other words a supported framework of injected completely custom, automated logic to occur at regular intervals, server side, and with full internal API access). Otherwise between the config file having as many options as possible, and additional files that can add to the sites configuration such as `point_presets.yaml`, there should be the solutions needed for your site here, and if not feel free to always open an issue.

## Features

* Custom Point Quick Picks: When on any point addition or removal screen, a list of 'Point Quick Picks' can be present that allows the user to easily select an arbitrary point amount to add. The different values present here are set via the configs `POINT_CHIPS`.

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
* `DB_DB`: This is the name of the database to use in your PostgreSQL instance.
* `DB_PORT`: This is the port of your PostgreSQL database.
* `GOOGLE_CLIENT_ID`: This is the client ID of your Google OAuth 2.0 Single Sign on Application.
* `GOOGLE_CLIENT_SECRET`: This is the client secret of your Google OAuth 2.0 Single Sign on Application.
* `RATE_LIMIT_GENERIC`: This is the rate limiting that will apply to all pages. This rate limit is a count of how many requests per IP per 15 minute window.
* `PAGINATION_LIMIT`: This is the limit used for pagination when searching for students via the search. Recommended is 30.
* `SITE_NAME`: This is a human friendly site name to be used within the website itself.
* `CSV_DELIMITER`: This is whatever delimiter character will be used within CSV files for student imports.
* `DOMIAN`: This is the email domain that should be present on every email used to sign into the application with Google.
* `MAX_AGE_DUCKS`: This is the amount of seconds that generated images of ducks should be considered 'fresh', otherwise how long clients should cache them.
* `CACHE_TIME`: This is the amount of seconds that generated duck images should be cached server side.
* `POINT_CHIPS`: This is an array of raw values that are used in point quick picks.
* `ADMINS`: This is an array of full email address' of admin staff.
* `TASKS`: This is a complex object that details server side tasks. More details within further documentation.
* `SESSION_FILE_STORE_TTL`: User Session Time To Live in seconds.
* `REQUIRE_LOGIN`: Determines if all users are redirected to the login page, if they are not authenticated.
* `REPORT_A_PROBLEM_URL`: A URL that is used as the link in footer text of "Report a Problem". Could be a `mailto` link, or link to a ticket system.
* `LOCALE`: This is the BCP 47 language tag, or an array of several, that determines the locale used when formatting certain text.
* `REDIRECT_STUDENTS`: Determines if students who are logged in should automatically be redirected to their specific student page.
* `FOOTER_ITEM_NAME`: A custom footer item that can be added, by name.
* `FOOTER_ITEM_LINK`: The link used for the custom footer item that's added.
* `STARTUP_DB_CONNECT_RETRY_COUNT`: This is how many times the backend server will attempt to connect to the database during startup. As the database instance can take some time to start up, it's recommended to never take this value to 0.
* `STARTUP_DB_CONNECT_RETRY_TIME_MS`: This is how long between each retry that will be used to attempt to connect to the database during startup.

It's recommended to never set these values, but in case testing is needed:
* `DEV_LOGIN`: The full email address of a registered developer login. Only useful if one of the two options is set.
* `DEV_IS_ADMIN`: Sets the `DEV_LOGIN` to be recognized as an admin when authenticated.
* `DEV_IS_STUDENT`: Sets the `DEV_LOGIN` to be recognized as a student when authenticated.

# Deployment Documentation

```
git tag v1.0.0
git push origin v1.0.0
docker build -t spt:v1.0.0 .
docker tag spt:v1.0.0 ghcr.io/confused-techie/student-point-tracker:v1.0.0
docker push ghcr.io/confused-techie/student-point-tracker:v1.0.0
```
