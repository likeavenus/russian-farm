import React from "react";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import "./styles.scss";

export const UIContainerTop: React.FC = () => {
    const navigate = useNavigate();

    const goBack = () => {
        navigate("/");
    };
    return (
        <div className="container-top">
            <Button onClick={goBack} startIcon={<KeyboardBackspaceIcon />}>
                Back
            </Button>
        </div>
    );
};

