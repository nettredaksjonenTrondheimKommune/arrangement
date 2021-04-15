import React from "react";
import { ListItemText } from '@material-ui/core';
import If from "./If";

export default function VenueObj(repetition) {
    let venueObj = repetition.venueObj;

    return <div>

        <If truthy={venueObj.name}>
             {venueObj.name}
        </If>


    </div>
}