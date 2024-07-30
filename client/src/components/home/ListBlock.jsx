import React from "react";
import { useNavigate } from "react-router-dom";

export default function ListBlock({ left, middle, right, link }) {

    const navigate = useNavigate();
    const changeRoute = () => {
        if (link) navigate(link);
    }

    return (
        <div className="list-block" onClick={changeRoute}>
            <div><p>{left}</p></div>
            <div><p>{middle}</p></div>
            <div><p>{right}</p></div>
        </div>
    )

}