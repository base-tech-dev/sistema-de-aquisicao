set -e

# load .env file
. ./utils/scripts/loadenv.sh < .env

# stop stack
docker stack down $DOCKER_STACK_NAME

# unload env variables
. ./utils/scripts/unloadenv.sh < .env
