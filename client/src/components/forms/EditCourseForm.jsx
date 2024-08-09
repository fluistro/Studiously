import React, { useState } from "react";
import { editCourse } from "../../connection/courses";


/**
 * Create course form component. Contains name field.
 * 
 * Expects:
 * - Course id to edit
 * - A method to log out the user
 * - A method to close the form (on success/cancel)
 */
export default function EditCourseForm({ courseId, logout, close }) {

    // Input fields
    const [name, setName] = useState();

    // Possible error returned by request
    const [error, setError] = useState();

    // Send request when form is submitted
    async function onSubmit(event) {

        try {

            event.preventDefault();

            // If session already exists or the login request is successful, redirect to homepage.
            await editCourse(courseId, { name }, logout);
            close();

        } catch (error) {
            setError(error.message);
        }

    }

    function cancel(event) {
        event.preventDefault();
        close();
    }

    // Redirect to homepage if successful
    return (

        <div className="form">

            <div className="form-header">
                <h1>Edit Course</h1>
            </div>

            <div className="form-error-message">{error && <p className="error">Error: {error}</p>}</div>
            
            <div className="form-body">
                <form>
                    <label htmlFor="edit-course-name">Course name</label><br/>
                    <input type="text" 
                           id="edit-course-name" 
                           name="name" 
                           onChange={event => setName(event.target.value)}></input>
                    <br/><br/>
                </form>
                <button type="reset" onClick={cancel} className="cancel-button"><b>Cancel</b></button>
                <button type="submit" onClick={onSubmit} className="submit-button"><b>Edit</b></button>
            </div>

        </div>

    );

};