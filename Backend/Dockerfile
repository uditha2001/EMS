# Stage 1: Build the application
FROM maven:3.9.9-amazoncorretto-21 AS build
WORKDIR /backend
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Run the application
FROM openjdk:21-jdk
WORKDIR /app
COPY --from=build /backend/target/examManagementBackend-0.0.1-SNAPSHOT.jar /app/app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
