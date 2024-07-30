import React from "react";
import { useNavigate } from "react-router-dom";

export default function ListBlock(props) {

    const navigate = useNavigate();
    const changeRoute = () => {
        navigate(props.link ? props.link : "");
    }

    return (
        <div className="list-block" onClick={props.link && changeRoute}>
            <div><p>{props.left}</p></div>
            {props.middle && <div><p>{props.middle}</p></div>}
            <div><p>{props.right}</p></div>
        </div>
    )

}