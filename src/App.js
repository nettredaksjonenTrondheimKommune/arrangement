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
import { eventIsCategory, afterDate } from "./utils";
import "dayjs/locale/nb";
import DayJs from "@date-io/dayjs";
import {
  MuiPickersUtilsProvider, DatePicker
} from '@material-ui/pickers';
import { debounce } from "debounce";
import { normalizeEvents } from "./Normalize";
import { parseCategory } from "./Categories";

// Voksen
// import { eventIsNotCategory } from "./utils";

const theme = createMuiTheme({
  typography: {
    // For å kompensere for at Bootstrap har 10px som standard fontstørrelse, mens Material UI benytter 16px.
    htmlFontSize: 10,
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

// Utvalgt: Endre max til 3, Skal normalt være 20

class App extends React.Component {
  state = {
    events: [],
    loading: true,
    max: 20,
    category: parseCategory(window.location.hash),
    fraDato: null,
    filtrer: "",
  };

  constructor(props) {
    super(props);

    // Linja under henter ut eventer fra TRDevents
    // fetch('https://us-central1-trdevents-224613.cloudfunctions.net/getNextEvents?&numEvents=20')

    // Linja under legger inn flere kategorier
    // fetch('https://us-central1-tk-events.cloudfunctions.net/getNextEvents?category=CONCERT,THEATER,PERFORMANCE')

    // Utvalgt - Linja under henter ut prioriterte arrangement fra TKevents
    // fetch('https://us-central1-tk-events.cloudfunctions.net/getNextEvents?featured=1')

    fetch('https://us-central1-tk-events.cloudfunctions.net/getNextEvents?')
      
      .then(r => r.json())
      .then(normalizeEvents)
      // .then(isTrondheimFolkebibliotek)
      // .then(isVoksen)
      .then(isSpaserstokken)
      .then(r => this.setState({ events: r, loading: false }));
  }

  // Utvalgt - kommenter vekk under

  handleDateChange = (value) => {
    this.setState({ fraDato: value })
  };

  handleFiltrerChange = (event) => {
    let value = event.target.value.toLowerCase();
    this.setFiltrer(value)
  }

  setFiltrer = debounce((value) => {
    this.setState({ filtrer: value })
  }, 200)

  componentDidMount() {
    window.addEventListener("hashchange", this.updateCategory);
  }

  componentWillUnmount() {
    window.removeEventListener("hashchange", this.updateCategory);
  }

  updateCategory = () => {
    this.setState({ category: parseCategory(window.location.hash), max: 20 });
  }

  // Utvalgt kommenter vekk over

  render() {
    const { classes } = this.props;
    const { category } = this.state;
    let events = this.state.events.filter(eventIsCategory(category))
      .filter(afterDate(this.state.fraDato))
      .filter(event => {
        if (event.title_nb.toLowerCase().includes(this.state.filtrer)) {
          return true;
        }
        else if
          (event.desc_nb.toLowerCase().includes(this.state.filtrer)) {
          return true;
        }
        else if
          (event.venueObj.name.toLowerCase().includes(this.state.filtrer)) {
          return true;
        }
        return false;
      });

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

            <CategorySelector />

            <MuiPickersUtilsProvider utils={DayJs} locale="nb" >
              <DatePicker
                className={classes.datoVelger}
                label="Velg fra-dato"
                value={this.state.fraDato}
                onChange={this.handleDateChange}
                format="Do MMMM YYYY"
                cancelLabel="Avbryt"
                inputProps={{'aria-label': 'Velg fra-dato'}}
              >
              </DatePicker >
            </MuiPickersUtilsProvider>

            <TextField
              label="Søk etter arrangement"
              className={classes.friTekst}
              onChange={this.handleFiltrerChange}
              value={this.filtrer}
              inputProps={{'aria-label': 'Søk etter arrangement'}}
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
  classes: PropTypes.object.isRequired,
};

function isTrondheimFolkebibliotek(arrangement) {
  return arrangement.filter(a => {
    return a.venueObj.name.toLowerCase().includes("bibliotek") || a.organizers.some(organizer => organizer.organizerObj.name.toLowerCase().includes("bibliotek"));
  });
}

// Voksen
// function isVoksen(arrangement) {
//   return arrangement.filter(a => eventIsNotCategory("FAMILY")(a) && eventIsNotCategory("SENIOR")(a))
// }

function isSpaserstokken(arrangement) {
  return arrangement.filter(a => {
    return a.organizers.some(organizer => organizer.organizerObj.id.includes("qBceEoeXwJO5WS8SE2rt")) || a.organizers.some(organizer => organizer.organizerObj.id.includes("yF77cUlumkbUAnfiJcku"));
  });
}

export default withStyles(styles)(App);
