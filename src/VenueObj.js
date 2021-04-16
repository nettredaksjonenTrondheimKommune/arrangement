import React from "react";
import { ListItemText } from '@material-ui/core';
import If from "./If";

export default function Venue(repetition) {
    let venue = repetition.venue;

    return <div>
        <If truthy={venue.name}>
             {venue.name}
        </If>
    </div>
}