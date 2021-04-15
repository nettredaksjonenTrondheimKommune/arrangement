import React from "react";

const If = ({ truthy, children }) => <span>{truthy && children}</span>;

export default If;
