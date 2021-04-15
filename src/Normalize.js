export function normalizeEvents(events) {
    events = normalizeArray(events)
    return events.map(normalizeEvent)
}

function normalizeEvent(event, index) {
    let context = `${index}: ${event.title_nb}: `
    event = normalizeObject(event, context)
    event.categories = normalizeArray(event.categories, context + "categories")
    event.title_nb = normalizeString(event.title_nb, context + "title_nb")
    event.desc_nb = normalizeString(event.desc_nb, context + "desc_nb")
    event.venueObj = normalizeObject(event.venueObj, context + "venueObj")
    event.venueObj.name = normalizeString(event.venueObj.name, context + "venueObj.name")
    event.organizers = normalizeArray(event.organizers, context + "organizers").map(normalizeOrganizer)
    event.repetitions = normalizeArray(event.repetitions).map(normalizeRepetition)

    return event
}

function normalizeRepetition(repetition, index) {
    repetition = normalizeObject(repetition, index)
    repetition.startTime = normalizeString(repetition.startTime, index)
    repetition.venueObj = normalizeObject(repetition.venueObj, index)
    repetition.venueObj.name = normalizeString(repetition.venueObj.name, index)

    return repetition
}

function normalizeOrganizer(organizer, index) {
    organizer = normalizeObject(organizer, index)
    organizer.organizerObj = normalizeObject(organizer.organizerObj, index + ": organizerObj")
    organizer.organizerObj.name = normalizeString(organizer.organizerObj.name, index + ": organizerObj.name")

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