# Hva er dette?
Script til visning av events fra tkevents.no (hentes fra Firebase). Scriptet legges inn (via referanser i malverk) på nettsider som skal vise arrangementskalender innenfor en spesifikk kategori der kommunen er arrangør.

## Bruk av scriptet
Arrangementskalender for Trondheim folkebibliotek Trondheim kommune, kulturenheten: Alle events arrangert av Den kulturelle spaserstokken + Seniorkultur.

### Hvilke filer styrer hva?

App.js styrer fetch, listepresentasjon og grid. 
EvenItem.js styrer visning av enkeltevent (card) i lista.
EventDialog.js styrer visning av dialogboks ved klikk på card.

## Trondheim folkebibliotek 

Trondheim folkebiblioteks nettsted har fire varianter. 1) Forside/featured. 2) Alle events ved TFB. 3) Prefiltrert for konserter, forestillinger. 4) Prefiltrert for voksne (unntatt barnearrangement).

### TFB Alle arrangement

1) Aktiver funksjon isTrondheimFolkebibliotek (App.js). Gjelder alle TFB-varianter.

### TFB Konserter og forestillinger

1) Bytt fetch fra generell til spørring på category=CONCERT,THEATER,PERFORMANCE (App.js).

### TFB Utvalgte arrangement til forside

1) Bytt fetch fra generell til spørring på featured=1 (App.js).
2) Kommenter vekk tre kodeområder merket "Utvalgt kommenter vekk under/over" (App.js).
3) Bytt fra 20 til 3 i state, slik at bare 3 events vises (App.js).

### TFB Voksen

1) Aktiver import av eventIsNotCategory (App.js).
2) Aktiver funksjon isVoksen (App.js).
3) Aktiver export av eventIsNotCategory (utils.js).

## Den kulturelle spaserstokken

Trondheim kommune, kulturenheten har en variant av scriptet som filtrerer på arrangørene Den kulturelle spaserstokken + Seniorkultur.

### Events fra Den kulturelle spaserstokken

1) Deaktiver funksjon isTrondheimFolkebibliotek (App.js).
2) Aktiver funksjon isSpaserstokken (App.js)


## Available scripts

### 'npm start'

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.
#   a r r a n g e m e n t  
 