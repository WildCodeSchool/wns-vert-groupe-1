#!/bin/bash

CONTAINER_NAME="2023-09-wns-vert-groupe1-db-1"
DB_USERNAME="postgres"
DUMPS_FOLDER="./dumps"
RCLONE_REMOTE_NAME="cityguide_dump"
RCLONE_REMOTE_FOLDER="dumps"

docker exec $CONTAINER_NAME pg_dumpall -c -U $DB_USERNAME > $DUMPS_FOLDER/pg_`date +%Y-%m-%d"_"%H-%M-%S`.sql
rclone sync $DUMPS_FOLDER  $RCLONE_REMOTE_NAME:$RCLONE_REMOTE_FOLDER