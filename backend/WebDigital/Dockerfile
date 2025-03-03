#
# BUILD STAGE
#
# FROM maven:3.13.0-jdk-11-slim AS build
FROM maven:3.9.8-eclipse-temurin-21 AS build
COPY src /usr/src/app/src  
COPY pom.xml /usr/src/app  
RUN mvn -f /usr/src/app/pom.xml clean package
#Scan Code using SonarQube
WORKDIR /usr/src/app
# RUN mvn clean verify sonar:sonar \
# -Dsonar.projectKey=job3m2 \
# -Dsonar.projectName='job3m2' \
# -Dsonar.host.url=http://192.168.2.177:9000 \
# -Dsonar.token=sqp_abd763098834abc21c134096f8aa66c7992d6f9c

#
# PACKAGE STAGE
#
FROM openjdk:11-jre-slim
FROM openjdk:21 
COPY --from=build /usr/src/app/target/WebDigital-0.0.1-SNAPSHOT.jar /usr/app/WebDigital-0.0.1-SNAPSHOT.jar  
EXPOSE 8080  
CMD ["java","-jar","/usr/app/WebDigital-0.0.1-SNAPSHOT.jar"]  