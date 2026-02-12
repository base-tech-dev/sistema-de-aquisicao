#!/bin/bash
set -e

# define macro to join a string
function join() {
  local -n outvar=$1
  shift 1;

  for arg in "$@"; do
      outvar="${outvar}${arg}";
  done;
}

# for loading environment variables
function load() {
    . ./utils/scripts/loadenv.sh < "$1"
}
function unload() {
    . ./utils/scripts/unloadenv.sh < "$1"
}

# load env variables from .env file
load .env
load setup.env # overrides .env file

# check if docker stack name is setup correctly
if [[ -v DOCKER_STACK_NAME ]]; then
    if docker stack ls | grep -q "$DOCKER_STACK_NAME"; then
        echo stack with name "$DOCKER_STACK_NAME" already exists
        exit 1
    fi
else
    echo please set your stack name in the .env file
    exit 1
fi

# create necessary volumes
if docker volume ls | grep -q "${DOCKER_STACK_NAME}_db-config"; then
    echo "-> db config volume already exists"
else
    # create folder for persistent data if not exists
    mkdir -p $DATA_MNT_ROOT/db/volumes/config

    docker volume create \
        -d local \
        --opt type=none \
        --opt o=bind \
        --opt device=${DATA_MNT_ROOT}/db/volumes/config \
        ${DOCKER_STACK_NAME}_db-config

    echo "-> created db config volume"
fi

# create necessary volumes
if docker volume ls | grep -q "${DOCKER_STACK_NAME}_db_data"; then
    echo "-> db data volume already exists"
else
    # create folder for persistent data if not exists
    mkdir -p $DATA_MNT_ROOT/db/volumes/data

    docker volume create \
        -d local \
        --opt type=none \
        --opt o=bind \
        --opt device=${DATA_MNT_ROOT}/db/volumes/data \
        ${DOCKER_STACK_NAME}_db_data

    echo "-> created db data volume"
fi

# build images
echo "-> building images"
ls -d services/*/docker | while read docker_folder; do
    service_name=$(echo $docker_folder | sed -E 's/services\/([^\/]+)\/docker/\1/')

    # load env variables if exist
    if [ -n "$(find services/$service_name -name build.env 2> /dev/null)" ]; then
        . ./utils/scripts/loadenv.sh --output=ENV_VARIABLES < ./services/$service_name/build.env
    fi

    # build, context defaults to services/$service_name
    docker build \
        -f ${docker_folder}/Dockerfile \
        -t ${DOCKER_STACK_NAME}_${service_name} \
        $(echo -n "$ENV_VARIABLES" | while read -r ARG; do echo -n "--build-arg $ARG=${!ARG} "; done) \
        ./services/$service_name${DOCKER_BUILD_ROOT:+/$DOCKER_BUILD_ROOT} # \
        # &> /dev/null
    echo "built image for service $service_name"

    # cleanup
    if [ -n "$(find services/$service_name -name build.env 2> /dev/null)" ]; then
        unload services/$service_name/build.env
    fi
    unset service_name
done

# do the cleanup
echo "-> cleaning up"
unload .env
unload setup.env
rm -rf tmp

echo "-> setup complete!"
exit
