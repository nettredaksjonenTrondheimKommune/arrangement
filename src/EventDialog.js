import React from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@material-ui/core";
import {
  Schedule,
  Category,
  Close,
  Event,
  Launch,
  MyLocation,
  OndemandVideo,
  Payment,
} from "@material-ui/icons";
import { categories } from "./Categories.js";
import If from "./If";
import { prettyDay, makeDateOfRepetition, eventDateToDateObject } from "./utils.js";
import FormattedText from "./FormattedText.js";
import Organizer from "./Organizer.js";
import "./EventDialog.css";

const styles = theme => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

class EventDialog extends React.Component {
  render() {
    const { classes } = this.props;
    const { open } = this.props;
    const { lukk } = this.props;
    const { event } = this.props;
    const start = eventDateToDateObject(event.startDate);
    let isSoldOut = event.eventSoldOut !== "";
    let isCancelled = event.eventCancelled !== "";
    
    const prettyStart = prettyDay(start);
    const end = eventDateToDateObject(event.endDate);
    let booking = "";
    let prettyEnd = "";
    let avlyst = "";
    let utsolgt = "";
    let pris = event.regularPrice || "Gratis";
    let isOnline = event.mode;
    let videolenke = event.streamingURL;

    if (pris !== "Gratis") {
      pris += " kroner";
    }

    if (event.duration !== "") {
      prettyEnd = end.toLocaleTimeString("nb-NO", {
        hour: "numeric",
        minute: "numeric",
      });

      if (event.ticketsURL !== "") {
        booking = (
          <a href={event.ticketsURL}>
            Bestill billetter <Launch />{" "}
          </a>
        );
      }

      if (isOnline === "online") {
        isOnline = "Online arrangement";
     }
     else if (isOnline !== "online") {
       isOnline = "";
    }

      if (event.eventCancelled === true) {
        avlyst = (
          <strong>NB! Arrangementet er avlyst</strong>
        );
      }

      if (videolenke !== "") {
        videolenke = event.streamingURL
      }

      if (event.eventSoldOut === true) {
        utsolgt = (
          "NB! Arrangementet er utsolgt/fullbooket"
        );
      }

      const days = [
        "søndag ",
        "mandag ",
        "tirsdag ",
        "onsdag ",
        "torsdag ",
        "fredag ",
        "lørdag ",
      ];

      if (start.getDate() !== end.getDate()) {
        prettyEnd = days[end.getDay()] + prettyEnd;
      }
      prettyEnd = " - " + prettyEnd;
    }

    let now = new Date();
    let repetitions = event.repetitions.filter(repetition => {
      let date = makeDateOfRepetition(repetition);
      return date >= now;
    });

    return (
      <Dialog open={open} onClose={lukk}>
        <DialogTitle>
          {event.title_nb}
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={lukk}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <img className="width-100-percent" src={event.images[0].urlLarge} alt={event.title_nb} /> <br />
          <Typography variant="h6">{avlyst}</Typography>
          <Typography variant="h6">{utsolgt}</Typography>
          <FormattedText text={event.desc_nb}></FormattedText>
          <Typography className="tkevent-margin-top" variant="h5" component="h3">Detaljer</Typography>
          <List dense={true}>
            <ListItem>
              <ListItemIcon>
                <MyLocation />
              </ListItemIcon>{" "}
              <ListItemText>{isOnline} {event.venue.name} {event.venueNote}</ListItemText>
            </ListItem>
            <If truthy={isOnline}>
              <ListItem>
                <ListItemIcon>
                  <OndemandVideo />
                </ListItemIcon>{" "}
                <ListItemText>
                  Streames her: <a href={videolenke} target="0" title={event.title_nb}>{videolenke}</a>
                </ListItemText>
              </ListItem>
            </If>
            <ListItem>
              <ListItemIcon>
                <Event />
              </ListItemIcon>{" "}
              <ListItemText> {prettyStart}</ListItemText>
            </ListItem>
            <ListItem alt="klokkeikon">
              <ListItemIcon>
                <Schedule />
              </ListItemIcon>{" "}
              <ListItemText>
                {" "}
                klokka {event.startTime} {prettyEnd}
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Category />
              </ListItemIcon>{" "}
              <ListItemText>
                {event.categories.map(c => categories[c]).join(", ")}
              </ListItemText>
            </ListItem>
            <If truthy={!isSoldOut && !isCancelled}>
              <ListItem>
                <ListItemIcon>
                  <Payment />
                </ListItemIcon>{" "}
                <ListItemText>
                  {pris} {booking}
                </ListItemText>
              </ListItem>
            </If>
          </List>
          <If truthy={repetitions.length >= 1}>
            <Typography>
              <strong>Arrangementet gjentas</strong>
            </Typography>

            <List dense={true}>
              {repetitions.map((repetition, i) => (
                <ListItem alt="klokkeikon" key={i}>
                  <ListItemIcon>
                    <Schedule />
                  </ListItemIcon>
                  <ListItemText>
                    {prettyDay(makeDateOfRepetition(repetition))}
                    kl {repetition.startTime} {repetition.venue.name}
                  </ListItemText>
                </ListItem>
              ))}

            </List>
          </If>

          <Typography className="tkevent-margin-top" variant="h5" component="h3">Arrangør</Typography>
          {event.organizers.map(Organizer)}

          <Typography className="tkevent-margin-top" variant="h5" component="h3">Adresse</Typography>
          <Typography>{event.venue.address}</Typography>
          <img className="width-100-percent" src={event.images[0].urlLarge} alt="kartvisning" />
          <Typography>
            <a href={"https://maps.google.com/?q=" + event.venue.address} target="0">
              {" "}
              Vis stedet i navigerbart kart <Launch />{" "}
            </a>
          </Typography>
          <Typography paragraph={true}>
            <a href={event.eventLink} target="0" title={event.title_nb}>
              Vis arrangementet i eget vindu <Launch />
            </a>
          </Typography>
        </DialogContent>
      </Dialog>
    );
  }
}

export default withStyles(styles)(EventDialog);