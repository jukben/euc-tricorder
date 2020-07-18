#!/usr/bin/env bash
echo "Used AppCenter-Config.plist file"
cat "$APPCENTER_SOURCE_DIRECTORY/ios/AppCenter-Config.plist"

printf '\n';

echo "Used .env file"
cat "$APPCENTER_SOURCE_DIRECTORY/.env"
