import React from "react";
import { Typography } from '@material-ui/core';
import If from "./If";
import "./Organizer.css";

export default function Organizer(organizerObj) {
    return <div className="tkevent-organizer" key={organizerObj.id}>
        <Typography variant="h6" component="h4">
            {organizerObj.name}
        </Typography>

        <If truthy={organizerObj.telephoneNumber}>
            <Typography>
                Telefon:{" "}
                <a href={"tel:" + organizerObj.telephoneNumber}>
                    {organizerObj.telephoneNumber}
                </a>
            </Typography>
        </If>

        <If truthy={organizerObj.email}>
            <Typography>
                E-post:{" "}
                <a href={"mailto:" + organizerObj.email}>
                    {organizerObj.email}
                </a>
            </Typography>
        </If>
    </div>
}