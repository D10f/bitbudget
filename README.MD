# Gadget Budget

A web application to handle your expenses securely and comfortably through out all of your devices.

## Features

+ Support for multiple wallets to manage short trips, events, separate currencies, etc.
+ Support for budget alerts will help to keep unnecessary expenses under control
+ Overview important details at a glance in the dashboard
+ Dark theme, light theme, orange theme, unicorn theme...
+ Client-side encryption means your expenses are safe.

## REST API endpoints

### Users

| METHOD  | ENDPOINT  | DESCRIPTION |
|---------------------------------------|----------| ------------------------ |
| ![open padlock](assets/lock-gray.png) POST | /signup  | Used to signup new users |
| ![open padlock](assets/lock-gray.png) POST | /login   | Used to login existing user |
| ![padlock](assets/lock-green.png) PUT | /profile | Used to update an existing profile |

### Wallets

| METHOD  | ENDPOINT  | DESCRIPTION |
|----------------------------------------|--------------| --- |
| ![padlock](assets/lock-green.png) GET  | /wallet/{id} | Retrieves the specified wallet
| ![padlock](assets/lock-green.png) POST  | /wallet/search/{id} | Retrives expenses based on payload query |
| ![padlock](assets/lock-green.png) POST | /wallet/{id} | Creates the specified wallet |
| ![padlock](assets/lock-green.png) PUT  | /wallet/{id} | Updates the specified wallet |
