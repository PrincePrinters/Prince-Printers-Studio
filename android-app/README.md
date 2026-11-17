# Android App (APK)

Yeh app aapki **live website** ko Android app mein kholta hai, isliye website ka har feature
(gallery, selfie search, download, inquiry form, admin) app mein bhi same chalta hai.
Website update karte hi app bhi apne-aap update ho jaata hai — naya APK banane ki zaroorat nahi.

App mein extra:
- Photo/video **Download** seedha phone ke *Downloads* folder mein save hota hai.
- Selfie ke liye camera permission.
- Internet na ho to "Internet nahi mila" screen.

## APK kaise banaye

1. Website live kariye aur uska poora link (https://…) lijiye.
2. `capacitor.config.json` mein `server.url` ki jagah apna live link daaliye.
   App ka naam badalna ho to `appName` badaliye.
3. Terminal mein (Java 21 chahiye — `brew install openjdk@21`):

   ```bash
   cd android-app
   npm install
   export JAVA_HOME=/opt/homebrew/opt/openjdk@21
   export ANDROID_HOME=$HOME/Library/Android/sdk
   npm run apk
   ```

4. APK yahan banega: `android-app/android/app/build/outputs/apk/debug/app-debug.apk`
   Ise WhatsApp / Drive se phone par bhejiye aur install kariye
   ("Unknown apps install" allow karna padega).

Play Store par daalne ke liye signed release build (`./gradlew bundleRelease`) aur
apni signing key chahiye.
