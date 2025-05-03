# wealthcaret

```sh
# to get device id
adb devices

# port forwarding for local server
adb -s $EMULATOR_ID reverse tcp:3000 tcp:3000

# clean build
npx expo prebuild --clean

# EAS local build android (to install the dev build to emulator)
npx expo run:android
```