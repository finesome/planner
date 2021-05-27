// modules
import React from "react";
import { sortableElement, sortableHandle } from "react-sortable-hoc";
// components
import DragHandleIcon from "@material-ui/icons/DragHandle";
// redux
// assets
// styles
import "./index.css";

// drag handle
const DragHandle = sortableHandle(() => <DragHandleIcon className="sortable-item-drag-handle" />);

const SortableItem = sortableElement(({ stage }) => {
    return (
        <li className="sortable-stage-item">
            <DragHandle />
            {stage.name} ({stage.duration} минут)
        </li>
    );
});

export default SortableItem;
