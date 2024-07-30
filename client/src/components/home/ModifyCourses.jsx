// Component for accepting input to create/edit a course

import React, { useEffect, useState } from "react";
import { createCourse, editCourse } from "../../connection/courses";

// method: "create" or "edit"
// courseInfo should be present if method is "edit"
export default function ModifyCourse({ close, method, setUser }) {

    const defaultInput = {
        name: "",
        manuallyEnterGrade: true,
        grade: ""
    }

    // Input fields
    const [ input, setInput ] = useState(defaultInput);

    const [ error, setError ] = useState(""); // For display

    // Modify input on form change
    function onInputChange(event) {
        setInput({...input, [event.target.name]: event.target.value});
    }

    // Send request when form is submitted
    async function onSubmit(event) {

        event.preventDefault();

        const request = (method === "edit") ? editCourse : createCourse;
        const data = await request(input);

        if (data && data.error) {
            setError(data.error);
            if (data.error === "Not currently logged in") {
                setUser(undefined);
            }
        }

        // Success
        else close();

    }

    return (

        <div className="lightbox-background">
            <div className="modify-course">

                <h1>{method}</h1>
                <div className="form-error">{error && <p className="error">Error: {error}</p>}</div>
                
                <div className="form-body">

                    <form>
                        <label htmlFor="name">Course name</label><br/>
                        <input type="text" id="name" name="name" onChange={onInputChange}></input><br/><br/>
                        <label htmlFor="manuallyEnterGrade">Manually enter grade</label><br/>
                        <input type="checkbox" id="manuallyEnterGrade" name="manuallyEnterGrade" onChange={onInputChange}></input><br/><br/>
                        <label htmlFor="grade">Grade (0-100)</label><br/>
                        {input.manuallyEnterGrade && <input type="text" id="grade" name="grade" onChange={onInputChange}></input>}
                    </form>

                    <button onClick={() => close()} id="cancel-button">Cancel</button>
                    <button onClick={onSubmit} id="submit-button"><b>Create course</b></button>
                    
                </div>

            </div>
        </div>
    )
}