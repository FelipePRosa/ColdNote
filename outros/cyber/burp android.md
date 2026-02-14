# Burp Android

USB (no Wi-Fi)

Install adb

Connect cellphone and computer to same internet

On Burp, enable proxy and change proxy settings -> network conection to 127.0.0.1:8080

Go to adb folder (C:\Users\U122442\Downloads\platform-tools-latest-windows\platform-tools) and open cmd

# on your PC (with device connected)

- adb devices # confirm device connected

- adb reverse tcp:8080 tcp:8080 # forward device localhost:8080 -> host:8080

# set global proxy (Android)

- adb shell settings put global http_proxy 127.0.0.1:8080

# to clear it later

- adb shell settings put global http_proxy :0

- adb reverse --remove tcp:8080

- adb push cacert.der /sdcard/Download/

# on device: Settings → Security → Install from storage → choose cacert.der
