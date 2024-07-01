import React from "react";
import { Typography } from "@mui/material";
import "./styles.scss";
import { UIContainerTop } from "../../containers/UIContainer";

export const Boosts: React.FC = () => {
    return (
        <div className="boosts-container">
            <UIContainerTop />
            <Typography variant="h3">Boosts</Typography>
        </div>
    );
};

