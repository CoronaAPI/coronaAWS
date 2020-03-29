#!/bin/bash

zip --exclude ".git/*" -r dailyCases.zip . 

aws lambda update-function-code --function-name dailyCases --zip-file fileb://$(pwd)/dailyCases.zip

