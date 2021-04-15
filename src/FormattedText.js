import React from "react";
import { Typography } from "@material-ui/core";


export default function FormattedText({ text }) {
    return text.split(/\n+/).map(ParagraphWithLinks)

}

function ParagraphWithLinks(text, i) {
    let textWithLinks = text.replace(/[^ ]+\.(com|no)[^ ]+/g, textToLink)
    let innerHTML = {
        __html: textWithLinks
    }


    return <Typography key={i} paragraph={true} dangerouslySetInnerHTML={innerHTML}/>
}

function textToLink(url) {
    url = safeUrl(url);
    if (url.slice(0, 4) !== "http") {
        url = "https://" + url;
    }
    return `<a href="${url}">${url}</a>`
}
// tar bort farlige tegn, som ikke er naturlig å bruke i en URL
// tillater a-å, .:/-_~?#=
function safeUrl(url) {
    return url.replace(/[^0-9a-zæøå.:/\-_~?#=]/ig,"");
}