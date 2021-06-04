import React from "react";
import { Typography } from "@material-ui/core";

export default function FormattedText({ text }) {
    return text.split(/\n+/).map(ParagraphWithLinks)
}

function ParagraphWithLinks(text, i) {
    let innerHTML = {
        __html: text
    };

    return <Typography key={i} paragraph={true} dangerouslySetInnerHTML={innerHTML}/>
}
