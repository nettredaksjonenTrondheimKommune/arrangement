import React from "react";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import { withStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import {
  Schedule,
  Category,
  MyLocation,
  Payment,
  Repeat,
} from "@material-ui/icons";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CardActionArea,
} from "@material-ui/core";
import { categories } from "./Categories.js";
import EventDialog from "./EventDialog.js";
import { Skeleton } from "@material-ui/lab";
import If from "./If";
import { prettyDay } from "./utils.js";

class EventItem extends React.Component {
  state = {
    kartErÅpent: false,
  };

  render() {
    const event = this.props.event;
    const start = new Date(event.startDate);
    let prettyStart = prettyDay(start);
    const end = new Date(event.endDate);
    let prettyEnd = "";
    let isSoldOut = event.eventSoldOut === true;
    let isCancelled = event.eventCancelled === true;
    let isOnline = event.mode;
    

    if (event.duration !== "") {
      prettyEnd = end.toLocaleTimeString("nb-NO", {
        hour: "numeric",
        minute: "numeric",
      });

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

    const { classes } = this.props;
    let pris = event.regularPrice || "Gratis";
    if (pris !== "Gratis") {
      pris += " kroner";
    }

    if (isOnline === "online") {
       isOnline = "Online arrangement";
    }
    else if (isOnline !== "online") {
      isOnline = "";
   }
   
    const åpneKart = () => {
      this.setState({ kartErÅpent: true });
    };

    const lukkKart = () => {
      this.setState({ kartErÅpent: false });
    };

    return (
      <Card className={classes.kort}>
        <EventDialog
          open={this.state.kartErÅpent}
          lukk={lukkKart}
          event={event}
        ></EventDialog>
        <CardActionArea onClick={åpneKart}>
          <CardMedia
            className={
              classes.media || (
                <Skeleton variant="rect" width={367} height={200} />
              )
            }
            image={event.images[0].urlSmall}
            alt={event.images[0].alt}
          />

          <CardContent>
            <Typography variant="h5" component="h2">
              {event.title_nb || <Skeleton height={26} width={300} />}
            </Typography>
            <List dense={true}>
              <If truthy={isCancelled}>
                <Button className={classes.utsolgt}> NB! Avlyst </Button></If>
              <If truthy={isSoldOut}>
                <Button className={classes.utsolgt}> NB! Utsolgt/fullbooket </Button></If>

              <ListItem className={classes.nullpadding} alt="klokkeikon">
                <ListItemIcon className={classes.listItemIcon}>
                  <Schedule />
                </ListItemIcon>{" "}
                <ListItemText>
                  {" "}
                  {prettyStart} kl {event.startTime} {prettyEnd}
                </ListItemText>
              </ListItem>
              <If truthy={event.repetitions.length >= 1}>
                <ListItem className={classes.nullpadding}>
                  <ListItemIcon className={classes.listItemIcon}>
                    <Repeat />
                  </ListItemIcon>{" "}
                  <ListItemText>
                    Arrangementet gjentas (se detaljer)
                  </ListItemText>
                </ListItem>
              </If>
              <ListItem className={classes.nullpadding}>
                <ListItemIcon className={classes.listItemIcon}>
                  <MyLocation />
                </ListItemIcon>{" "}
          <ListItemText>{isOnline} {event.venue.name} {event.venueNote}</ListItemText>
              </ListItem>
              <ListItem className={classes.nullpadding}>
                <ListItemIcon className={classes.listItemIcon}>
                  <Category />
                </ListItemIcon>{" "}
                <ListItemText>
                  {event.categories.map(c => categories[c]).join(", ")}
                </ListItemText>
              </ListItem>
              <If truthy={!isSoldOut && !isCancelled}>
                <ListItem className={classes.nullpadding}>
                  <ListItemIcon className={classes.listItemIcon}>
                    <Payment />
                  </ListItemIcon>{" "}
                  <ListItemText>{pris}</ListItemText>
                </ListItem>
              </If>
            </List>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  }
}

const styles = {
  kort: {
    height: "100%",
  },
  media: {
    height: 200,
    // maxWidth: 300
  },
  nullpadding: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  listItemIcon: {
    marginRight: "0.4em",
    verticalAlign: "bottom",
    paddingTop: "0.4em",
    minWidth: "0.4em",
  },
  time: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  utsolgt: {
    color: "#ae0001"
  }
};

export default withStyles(styles)(EventItem);
