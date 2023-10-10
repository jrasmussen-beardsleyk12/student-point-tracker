# TODO: Pin all file downloads to the right version

# Download and force creation of directories for the SQL DB migration
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/confused-Techie/student-point-tracker/main/migrations/0001-initial-migration.sql" -OutFile ( New-Item -Path "./sql/0001-initial-migration.sql" -Force )

# Download the app.example.yaml
Invoke-WebReqest -Uri "https://raw.githubusercontent.com/confused-Techie/student-point-tracker/main/app.example.yaml" -OutFile "./app.example.yaml"

# Download docker-compose.yaml
Invoke-WebReqest -Uri "https://raw.githubusercontent.com/confused-Techie/student-point-tracker/main/docker-compose.yaml" -OutFile "./docker-compose.yaml"

# Create a copy of the app.example.yaml
Copy-Item "./app.example.yaml" -Destination "./app.yaml"
