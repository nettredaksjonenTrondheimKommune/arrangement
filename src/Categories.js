export const categories = {
  CHURCH: "Kirke",
  CONCERT: "Konsert",
  CONFERENCE: "Konferanse",
  COURSE: "Kurs",
  CRAFTS: "Håndarbeid",
  CULTURE: "Kultur",
  DANCE: "Dans",
  DEBATE: "Debatt",
  DISCUSSION: "Samtale",
  EXHIBITION: "Utstilling",
  E_SPORT: "E-sport",
  FAMILY: "Barn",
  FESTIVAL: "Festival",
  FOOD: "Mat",
  GARDEN: "Hage",
  GUIDED_TOUR: "Omvisning",
  HISTORY: "Historie",
  LECTURE: "Foredrag",
  LITERATURE: "Litteratur",
  MARKET: "Marked",
  MOVIES: "Film",
  MUSEUM: "Museum",
  MUSIC: "Musikk",
  OTHER: "Øvrige",
  OUTDOORS: "Friluftsliv",
  PERFORMANCE: "Forestilling",
  QUIZ: "Quiz",
  SENIOR: "Senior",
  SOCIAL: "Samfunn",
  SPORT: "Sport",
  TECHNOLOGY: "Teknologi",
  THEATER: "Teater"
};
export let steder = [];
export let stederTemp = [];

export const STED_PREFIX = "tkevents-sted:";
export const CATEGORY_PREFIX = "tkevents-category:";
/**
 * Sjekker om hash passer med #tkevents-category:kategori,
 * hvis den gjør det, returneres kategori.
 *
 * "alle" returneres dersom hash ikke passer mønster, eller
 * kategori ikke finnes.
 *
 * Tester:
 *    assert.equal(parseCategory("asdfølkm"), "alle")
 *    assert.equal(parseCategory("tkevents-category:kategori"), "alle")
 *    assert.equal(parseCategory(), "alle")
 *    assert.equal(parseCategory("tkevents-category:THEATER"), "alle")
 *    assert.equal(parseCategory("#tkevents-category:THEATER"), "THEATER")
 *
 */
export function parseCategory(locationHash) {
  if (typeof locationHash !== 'string') {
    return "alle";
  }

  let hash = locationHash.slice(1);

  if (hash.indexOf(CATEGORY_PREFIX) !== 0) {
    return "alle";
  }

  let category = hash.substr(CATEGORY_PREFIX.length);

  if (category in categories) {
    return category;
  } else {
    return "alle";
  }
}

export function hentSteder(events) {
  var stederListe = [];

  for (var i = 0; i < events.length; i++) {
    let sted = '';
    if (events.venue?.name === '' && typeof events[i].venueNote !== 'undefined') {
      sted = events[i].venueNote;
      stederListe.push([sted.replace(/\s+/g, ''), sted]);
    } else if (events[i].venueNote === '' && typeof events[i].venue?.name !== 'undefined') {
      sted = events[i].venue?.name;
      stederListe.push([sted.replace(/\s+/g, ''), sted]);
    } else {
      let sted = events[i].venue?.name + ' ' + events[i].venueNote;
      stederListe.push([sted.replace(/\s+/g, ''), sted]);
    }
  }

  let stringArray = stederListe.map(JSON.stringify);
  let uniqueStringArray = new Set(stringArray);
  let uniqueArray = Array.from(uniqueStringArray, JSON.parse);

  steder = uniqueArray.sort(sorterEtterNavn);

  for (let i = 0; i < steder.length; i++) {
    stederTemp.push(steder[i][0]);
  }
}

export function parseSted(locationHash) {
  let newLocationHash = locationHash
    .replace(/%C3%A6/g, 'æ')
    .replace(/%C3%B8/g, 'ø')
    .replace(/%C3%A5/g, 'å')
    .replace(/%C3%86/g, 'Æ')
    .replace(/%C3%98/g, 'Ø')
    .replace(/%C3%85/g, 'Å');

  if (typeof newLocationHash !== 'string') {
    return "alle";
  }

  let hash = newLocationHash.slice(1);

  if (hash.indexOf(STED_PREFIX) !== 0) {
    return "alle";
  }

  let sted = hash.substr(STED_PREFIX.length);

  if (stederTemp.includes(sted)) {
    return sted;
  } else {
    return "alle";
  }
}

function sorterEtterNavn(a, b) {
  const navnA = a[1];
  const navnB = b[1];

  if (navnA < navnB) {
    return -1;
  }
  else if (navnA > navnB) {
    return 1;
  }

  return 0;
}