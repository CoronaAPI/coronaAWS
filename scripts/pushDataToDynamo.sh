#!/usr/bin/env bash

# VARIABLES
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
SLACK_URL=$1
PAYLOAD="{
  \"blocks\": [
    {
      \"type\":\"section\",
      \"text\": {
	\"type\":\"mrkdwn\",
	\"text\":\"🚀 coronadatascraper executed successfully at *`date +\%Y-\%m-\%d`*\"
      }
    }
  ]
}"

# MAIN
$DIR/addDateForDynamo.js >> $HOME/api_logs/addData.log

if [ $? -eq 0 ]
then
  curl -X POST --data-urlencode "payload=$PAYLOAD" $SLACK_URL
  curl https://data.corona-api.org/v1/flushredis
fi

