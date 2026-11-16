FROM eclipse-temurin:21-jdk-noble AS backend-build

WORKDIR /app
COPY gradlew settings.gradle ./
COPY gradle ./gradle
COPY backend/build.gradle ./backend/build.gradle
COPY lib/fastcgi-lib.jar ./lib/fastcgi-lib.jar
COPY backend/src ./backend/src
RUN ./gradlew --no-daemon :backend:installDist

FROM eclipse-temurin:21-jre-noble AS backend

WORKDIR /app
COPY --from=backend-build /app/backend/build/install/backend/ ./
USER 1000:1000
EXPOSE 9000
ENTRYPOINT ["/app/bin/backend"]

FROM httpd:2.4 AS web

COPY httpd.conf /usr/local/apache2/conf/httpd.conf
COPY frontend/index.html frontend/script.js frontend/styles.css /usr/local/apache2/htdocs/
