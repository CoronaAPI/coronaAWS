#!/usr/bin/env bash

##################
# VARIABLES
##################

TIME=$(date "+%Y-%m-%d %H:%M")
DATE=$(date +%Y-%m-%d)
DIR="/opt/corona-api/data"
SLACK_URL=$1

cleanAndCopy () {
  FILE=$1
  if [ -e "$DIR/$DATE/$FILE" ]
  then
    rm $DIR/$DATE/$FILE
  fi

  cp $DIR/$DATE/coronadatascraper/dist/$FILE $DIR/$DATE
}

##################
# SETUP
##################

echo "[*] Starting Daily Data Dump " $TIME

mkdir -p $DIR/$DATE

cd $DIR/$DATE

if [ ! -d "$DIR/$DATE/coronadatascraper" ]
then
  git clone --recursive https://github.com/lazd/coronadatascraper
  echo "[*] Repo successfully cloned"
else 
  cd $DIR/$DATE/coronadatascraper
  git pull 
  echo "[*] Repo successfully updated"
fi

##################
# WORK
##################

cd $DIR/$DATE/coronadatascraper

echo "[*] Installing coronadatascraper..."
/usr/local/bin/yarn install

echo "[*] Starting coronadatascraper..."

/usr/local/bin/yarn start

cleanAndCopy "data.json"
cleanAndCopy "ratings.json"
cleanAndCopy "report.json"

echo "[*] Data successfully dumped " + $TIME

##################
# CLEAN-UP
##################

echo ""
echo "[*] Cleaning up data scrape"

rm -rf $DIR/$DATE/coronadatascraper

if [[ -e "$DIR/$DATE/data.json" && -e "$DIR/$DATE/report.json" ]]
then
  SOURCES=$(cat $DIR/$DATE/report.json | jq '.sources.numSources')
  ERRORS=$(cat $DIR/$DATE/report.json | jq '.sources.errors')
  TIME2=$(date "+%Y-%m-%d %H:%M")
  ERRORS_TEXT=""
  if [ $ERRORS = "[]" ]
  then
    echo "[*] coronadatascraper successfully run without any errors"
  else
    ERRORS_TEXT="with the following errors: $ERRORS"
    PAYLOAD="{
      \"blocks\": [
        {
          \"type\":\"section\",
          \"text\": {
            \"type\":\"mrkdwn\",
            \"text\":\"🚀 coronadatascraper executed successfully at *$TIME UTC* and ran until *$TIME2 UTC*\"
          }
        },
        {
          \"type\":\"section\",
          \"text\": {
            \"type\":\"mrkdwn\",
            \"text\":\"Scraped $SOURCES sources, $ERRORS_TEXT\"
          }
        }
      ]
    }"
    curl -X POST --data-urlencode "payload=$PAYLOAD" $SLACK_URL >> /dev/null 2>&1
  fi
else
  PAYLOAD="{
    \"blocks\": [
      {
	\"type\":\"section\",
	\"text\": {
	  \"type\":\"mrkdwn\",
	  \"text\":\"coronadatascraper *failed* to execute successfully at *$TIME UTC*\"
	}
      }
    ]
  }"
  curl -X POST --data-urlencode "payload=$PAYLOAD" $SLACK_URL >> /dev/null 2>&1
fi

echo ""
echo "[*] Daily Script Complete!"

