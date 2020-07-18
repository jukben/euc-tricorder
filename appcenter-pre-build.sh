#!/usr/bin/env bash

echo "Injecting secrets..."

echo "Updating AppCenter Config"
echo $APPCENTER_CONFIG | base64 --decode > "$APPCENTER_SOURCE_DIRECTORY/ios/AppCenter-Config.plist"
echo "File AppCenter-Config.plist has been created sucessfuly!"
cat "$APPCENTER_SOURCE_DIRECTORY/.env"

echo '/n/n';

echo "Updating .env file..."
echo $DOTENV | base64 --decode > "$APPCENTER_SOURCE_DIRECTORY/.env"
echo "File .env has been created sucessfuly!"
cat "$APPCENTER_SOURCE_DIRECTORY/.env"
