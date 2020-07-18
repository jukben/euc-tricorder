#!/usr/bin/env bash

echo "Injecting secrets..."

echo "Updating AppCenter Config"
echo $APPCENTER_CONFIG | base64 --decode > "$APPCENTER_SOURCE_DIRECTORY/ios/AppCenter-Config.plist"

echo "Updating .env file"
echo $DOTENV | base64 --decode > "$APPCENTER_SOURCE_DIRECTORY/.env"
