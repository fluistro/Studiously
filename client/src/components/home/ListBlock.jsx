import React from "react";

export default function ListBlock(props) {

    return (
        <div className="list-block">
            <div><p>{props.left}</p></div>
            {props.middle && <div><p>{props.middle}</p></div>}
            <div><p>{props.right}</p></div>
        </div>
    )

}