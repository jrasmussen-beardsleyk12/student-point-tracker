# Deployment Documentation

```
git tag v1.0.0
git push origin v1.0.0
docker build -t spt:v1.0.0 .
docker tag spt:v1.0.0 ghcr.io/confused-techie/student-point-tracker:v1.0.0
docker push ghcr.io/confused-techie/student-point-tracker:v1.0.0
```
