import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import EventItem from "./EventItem";
import Button from "@material-ui/core/Button";
import ErrorIcon from '@material-ui/icons/Error';
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { Typography, TextField } from '@material-ui/core';
import Skeleton from "./Skeleton";
import If from "./If";
import CategorySelector from "./CategorySelector.js";
import PlaceSelector from "./PlaceSelector.js";
// import { eventIsCategory, eventIsNotCategory, afterDate } from "./utils";
import { eventIsCategory, eventIsSted, afterDate } from "./utils";
import "dayjs/locale/nb";
import DayJs from "@date-io/dayjs";
import {
  MuiPickersUtilsProvider, DatePicker
} from '@material-ui/pickers';
import { debounce } from "debounce";
import { parseCategory, parseSted, hentSteder, steder } from "./Categories";

const theme = createMuiTheme({
  typography: {
    // For å kompensere for at Bootstrap har 10px som standard fontstørrelse, mens Material UI benytter 16px.
    htmlFontSize: 10
  }
});

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  visFlere: {
    marginTop: "30px",
    marginBottom: "30px"
  },
  datoVelger: {
    float: "right",
    marginRight: "14px"
  },
  friTekst: {
    align: "left",
    marginRight: "14px",
    marginBottom: "30px"
  },
  margin: {
    margin: theme.spacing(1)
  }
});

const formattedFilter = {
  sortBy: 'date',
  // TrondheimFolkebibliotekForestillinger
  // categories: ["CONCERT", "PERFORMANCE", "THEATER"],
  // TrondheimFolkebibliotekForside
  // onlyFeatured: true,
  // Voksen
  // notCategories: ["FAMILY", "SENIOR"]
  // DenKulturelleSpaserstokken
  // categories: ["SENIOR"]
};
const page = 0;
const pageSize = 1000;
const url = `https://tkevents.no/graphQL`;
const filterStr = formattedFilter ? `filter: ${JSON.stringify(formattedFilter).replace(/"([^"]+)":/g, '$1:')}` : '';
const pageStr = `page: ${page}`;
const pageSizeStr = `pageSize: ${pageSize}`;

//Parameters to the events function
//Filter: filtering and sorting of the events
//Page: page number for the pagination options (default is 0)
//PageSize: page size for the pagination options (default is 10). Maximum is 1000.
const paramStr = (filterStr || pageStr || pageSizeStr) ? '(' + [filterStr, pageStr, pageSizeStr].join(", ") + ')' : '';

//Event fields to be fetched
const eventFields =
  `ageRestriction
  author_id
  categories
  contact_custom {
    email
    phone
  }
  contact_from
  desc_en
  desc_nb
  duration
  editableBy
  endDate
  eventCancelled
  eventSoldOut
  event_slug
  eventLink
  facebookURL
  id
  images {
    alt
    caption
    credits
    urlLarge
    urlSmall
    urlOriginal
    originalSize
    largeSize
    smallSize
  }
  isFeaturedEvent
  maximumAge
  minimumAge
  mode
  moreInfoURL
  organizers {
    id
    email
    name
    slug
    telephoneNumber
    website
  }
  priceOption
  publishingDate
  reducedPrice
  regularPrice
  repetitions {
    id
    startDate
    endDate
    startTime
    duration
    eventCancelled
    eventSoldOut
    mode
    ticketsURL
    streamingURL
    venue {
      address
      id
      location {
        latitude
        longitude
      }
      mapImageURL
      name
      slug
    }
  }
  startDate
  startTime
  streamingURL
  super_event
  ticketsURL
  title_en
  title_nb
  type
  updated_at
  venue {
    address
    id
    location {
      latitude
      longitude
    }
    mapImageURL
    name
    slug
  }
  venueNote
  videosURL`;

const query =
  `{
    events ${paramStr} {
      data {
        ${eventFields}
      }
    }
  }`;

const opts = {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query })
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      events: [],
      loading: true,
      // Utvalgt: Endre max til 3, skal normalt være 20
      max: 20,
      kategori: parseCategory(window.location.hash),
      sted: parseSted(window.location.hash),
      fraDato: null,
      filtrer: ""
    };

    this.getData();
  }

  async getData() {
    await fetch(url, opts)
      .then(res => res.json())
      .then(extractEvents)
      // TrondheimFolkebibliotek
      .then(isTrondheimFolkebibliotek)
      .then(res => this.setState({ events: res, loading: false }))
      // DenKulturelleSpaserstokken
      // .then(res => this.setState({ events: res.data.events.data, loading: false }))
      .catch(err => console.error(err));
  }

  // Utvalgt - kommenter vekk under

  handleDateChange = (value) => {
    this.setState({ fraDato: value })
  };

  handleFiltrerChange = (event) => {
    let value = event.target.value.toLowerCase();
    this.setFiltrer(value);
  }

  setFiltrer = debounce((value) => {
    this.setState({ filtrer: value })
  }, 200)

  componentDidMount() {
    // window.addEventListener("hashchange", this.updateCategory);
    // window.addEventListener("hashchange", this.updateSted);
  }

  componentWillUnmount() {
    // window.removeEventListener("hashchange", this.updateCategory);
    // window.removeEventListener("hashchange", this.updateSted);
  }

  updateCategory = () => {
    this.setState({ kategori: parseCategory(window.location.hash), max: 20 });
  }

  updateSted = () => {
    this.setState({
      kategori: parseCategory(window.location.hash),
      sted: parseSted(window.location.hash),
      max: 20
    });
  }

  handleCallbackSted = (childDataSted) => {
    this.setState({
      sted: childDataSted,
      max: 20
    });
  }

  handleCallbackCategory = (childDataCategory) => {
    this.setState({
      kategori: childDataCategory,
      max: 20
    });
  }

  // Utvalgt kommenter vekk over

  render() {
    const { classes } = this.props;
    const { kategori, sted } = this.state;
    let events = this.state.events
      .filter(eventIsSted(sted))
      .filter(eventIsCategory(kategori))
      .filter(afterDate(this.state.fraDato))
      .filter(event => {
        if (event.title_nb.toLowerCase().includes(this.state.filtrer)) {
          return true;
        }
        else if (event.desc_nb.toLowerCase().includes(this.state.filtrer)) {
          return true;
        }
        else if (event.venue?.name.toLowerCase().includes(this.state.filtrer)) {
          return true;
        }
        return false;
      });

    if (steder.length === 0) {
      hentSteder(this.state.events);
    }

    var numberOfResults = events.length;
    events = events.slice(0, this.state.max);

    return (
      <ThemeProvider theme={theme}>
        <If truthy={this.state.loading}>
          <Skeleton />
        </If>

        <If truthy={!this.state.loading}>
          <div className="tk-arrangement-root">

            {/* Utvalgt kommenter vekk under */}

            <CategorySelector parentCallbackCategory={this.handleCallbackCategory} />

            <MuiPickersUtilsProvider utils={DayJs} locale="nb">
              <DatePicker
                className={classes.datoVelger}
                label="Velg fra-dato"
                value={this.state.fraDato}
                onChange={this.handleDateChange}
                format="Do MMMM YYYY"
                cancelLabel="Avbryt"
                inputProps={{ 'aria-label': 'Velg fra-dato' }}
              >
              </DatePicker >
            </MuiPickersUtilsProvider>

            <PlaceSelector parentCallbackPlace={this.handleCallbackSted} />

            <TextField
              label="Søk etter arrangement"
              className={classes.friTekst}
              onChange={this.handleFiltrerChange}
              value={this.filtrer}
              inputProps={{ 'aria-label': 'Søk etter arrangement' }}
            >
            </TextField>

            {numberOfResults < 1 && (
              <Typography color="error" variant="h5"><ErrorIcon /> Fant dessverre ingen arrangement med dette søkeuttrykket.</Typography>
            )}

            {numberOfResults > 0 && numberOfResults <= this.state.max && (
              <Typography>Viser {numberOfResults} treff.</Typography>
            )}
            {numberOfResults > this.state.max && (
              <Typography>
                Viser {this.state.max} av {numberOfResults} treff.
              </Typography>
            )}

            {/* Utvalgt kommenter vekk over */}

            <Grid container className={classes.root} spacing={3}>
              {events.map((event, i) => (
                <Grid item key={event.id} lg={4} md={4} sm={6} xs={12}>
                  <EventItem event={event} />
                </Grid>
              ))}
            </Grid>

            {/* Utvalgt kommenter vekk under */}
            {numberOfResults > this.state.max && (
              <div className={classes.visFlere}>
                <Button
                  variant="contained"
                  color="default"
                  onClick={() => this.setState({ max: this.state.max + 20 })}
                >
                  Vis flere
                </Button>
              </div>
            )}
            {/* Utvalgt kommenter vekk over */}
          </div>
        </If>
      </ThemeProvider>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

function extractEvents(arrangement) {
  return arrangement.data.events.data.filter(a => {
    return a.id && a.title_nb;
  });
}

function isTrondheimFolkebibliotek(events) {
  return events.filter(a => {
    return a.venue?.name.toLowerCase().includes("bibliotek") || a.organizers.some(organizer => organizer.name.toLowerCase().includes("bibliotek"));
  });
}

export default withStyles(styles)(App);