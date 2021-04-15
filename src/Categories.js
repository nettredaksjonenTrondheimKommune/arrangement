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
  THEATER: "Teater",
};

export const CATEGORY_PREFIX = "tkevents-category:";
/**
 * Sjekker om hash passer med #tkevents-category:kategori,
 * hvis den gjør det, returneres kategori.
 *
 * "alle" returneres dersom hash ikke passer mønster, eller
 * kategori ikke finnes.
 *
 * Tester:
 *
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
    console.log(category)
    return category;
  } else {
    return "alle";
  }
}