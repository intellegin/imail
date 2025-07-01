#!/bin/bash

set -e

DOCKER_USERNAME="dndventuress"
IMAGE_NAME="imail-server"
TAG="latest"

echo "Pushing iMail server to Docker Hub..."

echo "Logging into Docker Hub..."
docker login

echo "Pushing ${DOCKER_USERNAME}/${IMAGE_NAME}:${TAG}..."
docker push ${DOCKER_USERNAME}/${IMAGE_NAME}:${TAG}

echo "Successfully pushed to Docker Hub!"
echo ""
echo "Image available at: https://hub.docker.com/r/${DOCKER_USERNAME}/${IMAGE_NAME}"
echo ""
echo "Pull with: docker pull ${DOCKER_USERNAME}/${IMAGE_NAME}:${TAG}"
echo "Run with: docker run -d --name imail-server -p 3000:3000 --env-file .env ${DOCKER_USERNAME}/${IMAGE_NAME}:${TAG}" 