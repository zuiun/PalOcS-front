# PalOcS

Point of sale system (`P`al`O`c`S`) for drink shops, intended primarily as a proof of concept.
PalOcS is specifically designed to make up for the shortcomings in the point of sale system of my former workplace.
This is the front-end interface.

Nem beszélek magyarul.

## Installation

PalOcS uses [Node.js](https://nodejs.org/en) and requires multiple packages.
```
npm install
```

## Usage

Run `npm run start`.
Add applicable sales tax rate as `EXPO_PUBLIC_TAX_RATE` to a .env file.
Tax rate is given in hundredths of a percent (27,00% = 2700).
Host the [back-end API](https://github.com/zuiun/PalOcS-back) and add `EXPO_PUBLIC_API_URL` to a .env file.

I do not know if PalOcS runs on any platform other than web.
