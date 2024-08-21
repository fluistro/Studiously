import React, { useState } from "react";
import { editCourse } from "../../connection/courses";


/**
 * Edit course form component. Contains name field.
 * 
 * Expects:
 * - Old information about the course (Course object)
 * - A callback to log out the user
 * - A callback to close the form (on success/cancel)
 */
export default function EditCourseForm({ course, logout, close }) {

    // Input fields
    const [name, setName] = useState(course.name);

    // Possible error returned by request
    const [error, setError] = useState();

    // Send request when form is submitted
    async function onSubmit(event) {

        try {

            event.preventDefault();

            if (!name) {
                setError("Missing course name");
                return;
            }

            // If session already exists or the login request is successful, redirect to homepage.
            await editCourse(course._id, { name }, logout);
            close();

        } catch (error) {
            setError(error.message);
        }

    }

    function cancel(event) {
        event.preventDefault();
        close();
    }

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
                           value={name}
                           onChange={event => setName(event.target.value)}></input>
                    <br/><br/>
                </form>
                <button type="reset" onClick={cancel} className="red-outline-button"><b>Cancel</b></button>
                <button type="submit" onClick={onSubmit} className="purple-button"><b>Save</b></button>
            </div>

        </div>

    );

};