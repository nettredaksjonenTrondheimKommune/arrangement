export function eventIsCategory(category) {
  return function (event) {
    if (category === "" || category === "alle") {
      return true;
    }
    return event.categories.includes(category)
  }
}

// Voksen
// export function eventIsNotCategory(category) {
//   return function (event) {
//     if (category === "" || category === "alle") {
//       throw new Error("No events are not 'alle'")
//     }
//     return event.categories.every(c => c !== category)
//   }
// }

/**
 * prettyDay(new Date()) -> "torsdag 3. oktober "
 *
 * @param {Date} date
 */
export function prettyDay(date) {
  return (
    date.toLocaleDateString("nb-NO", {
      weekday: "long",
      // year: 'numeric',
      month: "long",
      day: "numeric",
    }) + " "
  );
}

/**
 * Transformer objektet
 * {
 *     startDate: {_seconds: 1568152800, _nanoseconds: 0},
 *     startDateRep: "2019-09-10T22:00:00.000+00:00",
 *     startTime: "12:13"
 * }
 *
 * til dato-objekt:
 * → new Date(2019, 09, 11, 12, 13)
 *
 * Merk at dato er i GMT-tidssone (+00:00) og derfor to timer foran oss på sommertid.
 *
 * @param {object} repetition
 */
export function makeDateOfRepetition(repetition) {
  const day = new Date(repetition.startDateRep);
  const [hour, minutes] = repetition.startTime.split(":");
  return new Date(
    day.getFullYear(),
    day.getMonth(),
    day.getDate(),
    hour,
    minutes,
  );
}
export function afterDate(date) {
  return function (event) {
    let eventDate = new Date(event.startDate);

    return eventDate > date;
  }
}
