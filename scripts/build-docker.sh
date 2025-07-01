#!/bin/bash

set -e

DOCKER_USERNAME="dndventuress"
IMAGE_NAME="imail-server"
TAG="latest"

echo "Building iMail server Docker image..."

cd "$(dirname "$0")/.."

echo "Building production image..."
docker build -f apps/server/Dockerfile -t ${DOCKER_USERNAME}/${IMAGE_NAME}:${TAG} .

echo "Tagging as latest..."
docker tag ${DOCKER_USERNAME}/${IMAGE_NAME}:${TAG} ${DOCKER_USERNAME}/${IMAGE_NAME}:latest

echo "Image built successfully!"
echo ""
echo "To push to Docker Hub:"
echo "1. Login: docker login"
echo "2. Push: docker push ${DOCKER_USERNAME}/${IMAGE_NAME}:${TAG}"
echo ""
echo "To run locally:"
echo "docker run -d --name imail-server -p 3000:3000 --env-file .env ${DOCKER_USERNAME}/${IMAGE_NAME}:${TAG}"

read -p "Do you want to push to Docker Hub now? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Pushing to Docker Hub..."
    docker push ${DOCKER_USERNAME}/${IMAGE_NAME}:${TAG}
    echo "Successfully pushed ${DOCKER_USERNAME}/${IMAGE_NAME}:${TAG}"
else
    echo "Skipped push. Run manually with: docker push ${DOCKER_USERNAME}/${IMAGE_NAME}:${TAG}"
fi 