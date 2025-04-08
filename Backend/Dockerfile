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

# Copy the built JAR from the build stage
COPY --from=build /backend/target/examManagementBackend-0.0.1-SNAPSHOT.jar /app/app.jar

# Set default env values (can be overridden)
ENV FILE_UPLOAD_PROFILE_DIR=/app/uploads/profile_images \
    FILE_UPLOAD_ARCHIVED_DIR=/app/uploads/archived-papers \
    FILE_UPLOAD_ENCRYPTED_DIR=/app/uploads/encrypted-papers

# Create upload directories to avoid issues
RUN mkdir -p $FILE_UPLOAD_PROFILE_DIR $FILE_UPLOAD_ARCHIVED_DIR $FILE_UPLOAD_ENCRYPTED_DIR

# Expose port
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "app.jar"]
