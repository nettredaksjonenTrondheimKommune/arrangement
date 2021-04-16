export function normalizeEvents(events) {
    console.log(events);
    events = normalizeArray(events)
    return events.map(normalizeEvent)
}

function normalizeEvent(event, index) {
    let context = `${index}: ${event.title_nb}: `
    event = normalizeObject(event, context)
    event.categories = normalizeArray(event.categories, context + "categories")
    event.title_nb = normalizeString(event.title_nb, context + "title_nb")
    event.desc_nb = normalizeString(event.desc_nb, context + "desc_nb")
    event.venue = normalizeObject(event.venue, context + "venue")
    event.venue.name = normalizeString(event.venue.name, context + "venue.name")
    event.organizers = normalizeArray(event.organizers, context + "organizers").map(normalizeOrganizer)
    event.repetitions = normalizeArray(event.repetitions).map(normalizeRepetition)
    
    return event
}

function normalizeRepetition(repetition, index) {
    repetition = normalizeObject(repetition, index)
    repetition.startTime = normalizeString(repetition.startTime, index)
    repetition.venue = normalizeObject(repetition.venue, index)
    repetition.venue.name = normalizeString(repetition.venue.name, index)

    return repetition
}

function normalizeOrganizer(organizer, index) {
    organizer = normalizeObject(organizer, index)
    organizer.organizers = normalizeObject(organizer.organizers, index + ": organizer")
    organizer.organizers.name = normalizeString(organizer.organizers.name, index + ": organizer.name")

    return organizer
}

function normalizeArray(value, context) {
    if (Array.isArray(value)) {
        return value
    } else {
        console.error(`Not array: ${value}, context: ${context}`)
        return []
    }
}

function normalizeObject(value, context) {
    if (typeof value === 'object' && value !== null && value !== undefined) {
        return value
    } else {
        console.error(`Not object: ${value}, context: ${context}`)
        return {}
    }
}

function normalizeString(value, context) {
    if (typeof value === 'string') {
        return value
    } else {
        console.error(`Not string: ${value}, context: ${context}`)
        return ""
    }
}