#!/usr/bin/env bash

echo "Injecting secrets..."

echo "Updating AppCenter Config"
echo $APPCENTER_CONFIG | base64 --decode > "$APPCENTER_SOURCE_DIRECTORY/ios/AppCenter-Config.plist"
echo "File AppCenter-Config.plist has been created sucessfuly!"
cat "$APPCENTER_SOURCE_DIRECTORY/ios/AppCenter-Config.plist"

printf '\n';

# Creates an .env from ENV variables for use with react-native-config
# see https://blog.usejournal.com/react-native-config-and-appcenter-environment-variables-a1a3492ca6a0
ENV_WHITELIST=${ENV_WHITELIST:-"^RN_"}
printf "Creating an .env file with the following whitelist:\n"
printf "%s\n" $ENV_WHITELIST
set | egrep -e $ENV_WHITELIST | sed 's/^RN_//g' > "$APPCENTER_SOURCE_DIRECTORY/.env"
printf "\n.env created with contents:\n\n"
cat "$APPCENTER_SOURCE_DIRECTORY/.env"
