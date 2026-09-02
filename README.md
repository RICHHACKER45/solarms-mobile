# SolarMS Mobile ☀️🔋

SolarMS Mobile is a robust, cross-platform IoT dashboard built to interface directly with custom ESP32 solar monitoring hardware. Built with React, Ionic, and Capacitor, it provides real-time telemetry, historical data tracking, and critical alert notifications directly to your Android device.

## 🌟 Overview

The application acts as the "brain" and display unit for an off-grid solar installation. It connects to the ESP32 hardware over a local Wi-Fi network, pulling real-time metrics (Voltage, Current, Power, and Temperature) every 5 seconds. 

It features a premium "dark glassmorphism" UI, ensuring maximum readability even in bright outdoor environments, while keeping the aesthetic modern and sleek.

## 🏗️ Architecture

- **Frontend Framework:** React 18 (with TypeScript)
- **UI Toolkit:** Ionic React (for native mobile components and gestures)
- **Build Tool:** Vite (for lightning-fast HMR and building)
- **Native Bridge:** Capacitor (bridges the web app to Android APIs)
- **Storage:** Capacitor Filesystem (CSV logging) & Capacitor Preferences (Key/Value settings)
- **Hardware Communication:** HTTP Polling (Local LAN) to ESP32 Station/AP.

### The ESP32 Data Flow
1. The ESP32 reads analog sensors (Voltage dividers, ACS712 current sensors, DHT22 temps).
2. The ESP32 hosts an HTTP server on the local network (e.g., `http://192.168.4.1/data`).
3. SolarMS Mobile polls this endpoint every 5 seconds.
4. If a critical threshold is breached (e.g., Voltage > 14.5V), SolarMS triggers a **Local Push Notification** instantly to the user's phone.

## 🚀 Features

* **Real-time Dashboard:** Live tracking of Voltage (V), Current (A), Power (W), and Temp (°C).
* **Developer Simulator:** Built-in hardware simulator to test data fluctuations and push notifications without the physical ESP32.
* **Smart History Logging:** Saves polling data into a localized `solarms_history.csv` file. Features "Noise Filtering" to only display significant voltage/temp changes in the UI to prevent bloat.
* **App Security:** 6-digit PIN lock screen required on app boot to protect sensitive hardware configurations.
* **Push Notifications:** Instant Android local notifications for critical voltage drops/spikes with a built-in anti-spam cooldown system.
* **Data Wiping:** Factory reset capabilities to clear corrupted or legacy CSV logs.

---

## 💻 Installation & Setup

### Prerequisites
Before you begin, ensure you have the following installed on your machine:
* **Node.js** (v18 or higher)
* **pnpm** (Package manager: `npm install -g pnpm`)
* **Android Studio** (Required to compile the APK for your phone)

### 1. Clone & Install Dependencies
Clone the repository and install the Node packages using `pnpm`.
```bash
git clone https://github.com/your-username/solarms-mobile.git
cd solarms-mobile
pnpm install
```

### 2. Run in the Browser (Development Mode)
If you want to edit the UI and see changes instantly, you can run the app in your PC's browser:
```bash
pnpm run dev
```
*(Note: Native features like local notifications and filesystem storage will fall back to web-safe modes or mock themselves in the browser).*

### 3. Build & Sync to Android
When you are ready to test the app on a physical Android device (like the Samsung A06), you must build the production web assets and sync them to the Android folder.
```bash
pnpm run build
```
*(This command runs `tsc && vite build && cap sync android` under the hood).*

### 4. Deploy to your Phone
1. Open **Android Studio**.
2. Select **Open an existing project** and choose the `android/` folder inside the `solarms-mobile` directory.
3. Plug in your Android phone via USB (Ensure "USB Debugging" is enabled in Developer Options).
4. Click the green **▶ Run** button in Android Studio to install the APK onto your device!

---

## 🛠️ Important Commands

| Command | Description |
|---|---|
| `pnpm install` | Installs all required packages and Capacitor plugins. |
| `pnpm run dev` | Starts the Vite development server (localhost:5173). |
| `pnpm run build` | Compiles the React app and copies the files into the Android project. |
| `npx cap open android` | Opens the Android project directly in Android Studio. |
| `npx @capacitor/assets generate` | Automatically generates the app icons and splash screens for Android based on `assets/icon.svg`. |

---

## 🔒 Security & Reset
If you ever get locked out of the app due to a forgotten PIN, or if your local CSV file becomes corrupted, you can perform a **Factory Reset**:
1. Open the app and purposefully fail the PIN lock.
2. Click "Forgot PIN?".
3. This will completely wipe the Capacitor Preferences and Filesystem logs, restoring the app to its factory state. 

*(Alternatively, you can clear the app's cache and data from your Android Phone's OS settings).*
