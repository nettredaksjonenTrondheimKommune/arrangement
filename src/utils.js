import moment from 'moment';

export function eventIsCategory(category) {
  return function (event) {
    if (category === "" || category === "alle") {
      return true;
    }
    return event.categories.includes(category);
  }
}

// Voksen
export function eventIsNotCategory(category) {
  return function (event) {
    if (category === "" || category === "alle") {
      throw new Error("No events are not 'alle'");
    }
    return event.categories.every(c => c !== category);
  }
}

export function eventIsSted(sted) {
  return function (event) {
    if (sted === "" || sted === "alle") {
      return true;
    }
    let bar = (event.venue?.name + " " + event.venueNote).replace(/\s+/g, '');

    if (bar === sted) {
      return true;
    }
  }
}

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
  const day = eventDateToDateObject(repetition.startDate);
  const [hour, minutes] = repetition.startTime.split(":");
  return new Date(
    day.getFullYear(),
    day.getMonth(),
    day.getDate(),
    hour,
    minutes,
  );
}

//This function filters events with endDate after "fromDate"
export function afterDate(fromDate) {
  return function (event) {
    //If there is not "fromDate", we can assume that it is "now"
    const filterDate = fromDate || new Date();

    //event.endDate format: 2021-05-15 08:30:00+00
    const eventDate = eventDateToDateObject(event.endDate);

    return eventDate > filterDate;
  }
}

export function eventDateToDateObject(dateStr) {
  const parsedDate = moment(dateStr, "YYYY-MM-DD HH:mm:ssZ");
  if (parsedDate.isValid()) {
    return parsedDate.toDate();
  } else {
    throw new Error("dateStr is not a valid formatted date");
  }
}