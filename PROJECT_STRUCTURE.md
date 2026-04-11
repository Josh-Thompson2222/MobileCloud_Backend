# Weather App - Project Structure

```
weather-app/
├── backend/                  # Node.js/Express - runs on EC2
│   ├── server.js
│   ├── package.json
│   ├── .env                  # ← PUT YOUR SECRETS HERE
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── SavedCity.js
│   └── routes/
│       ├── auth.js
│       ├── weather.js
│       └── cities.js
│
└── frontend/                 # React Native Expo app
    ├── app.json
    ├── App.js
    ├── package.json
    ├── .env                  # ← PUT YOUR SECRETS HERE
    ├── database/
    │   └── sqlite.js
    ├── screens/
    │   ├── LoginScreen.js
    │   ├── RegisterScreen.js
    │   ├── HomeScreen.js
    │   ├── ForecastScreen.js
    │   ├── FavouritesScreen.js
    │   └── AlertsScreen.js
    ├── navigation/
    │   └── AppNavigator.js
    ├── context