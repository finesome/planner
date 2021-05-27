// modules
import React from "react";
import { sortableContainer } from "react-sortable-hoc";
// components
// redux
// assets
// styles
import "./index.css";

const SortableContainer = sortableContainer(({ children }) => {
    return <ul className="sortable-container">{children}</ul>;
});

export default SortableContainer;
