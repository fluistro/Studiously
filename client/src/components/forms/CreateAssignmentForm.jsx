import React, { useState } from "react";
import { createAssignment } from "../../connection/assignments";


/**
 * Create assignment form component. Contains name and date fields, and optional grade/weight.
 * 
 * Expects:
 * - Course id associated with the new assignment
 * - A method to log out the user
 * - A method to close the form (on success/cancel)
 */
export default function CreateAssignmentForm({ courseId, logout, close }) {

    // Input fields, all strings
    const [name, setName] = useState();
    const [dueDate, setDueDate] = useState();
    const [grade, setGrade] = useState();
    const [weight, setWeight] = useState();

    // Possible error returned by request
    const [error, setError] = useState();

    // Send request when form is submitted
    async function onSubmit(event) {

        try {

            event.preventDefault();

            if (!name || !dueDate) {
                setError("Missing name or date");
                return;
            }

            const assignmentInfo = {
                name,
                dueDate: new Date(dueDate),
                grade: grade && +grade, // convert to number
                weight: weight && +weight
            }

            // If session already exists or the login request is successful, redirect to homepage.
            await createAssignment(courseId, assignmentInfo, logout);
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
                <h1>Create Assignment</h1>
            </div>

            <div className="form-error-message">{error && <p className="error">Error: {error}</p>}</div>
            
            <div className="form-body">
                <form>
                    <label htmlFor="create-assignment-name">Assignment name</label><br/>
                    <input type="text" 
                           id="create-assignment-name" 
                           name="name" 
                           onChange={event => setName(event.target.value)}></input>
                    <br/><br/>
                    <label htmlFor="create-assignment-date">Due date</label><br/>
                    <input type="date" 
                           id="create-assignment-date" 
                           name="date" 
                           onChange={event => setDueDate(event.target.value)}></input>
                    <br/><br/>
                    <label htmlFor="create-assignment-weight">Assignment weight (optional, 0-100)</label><br/>
                    <input type="text" 
                           id="create-assignment-weight" 
                           name="weight" 
                           onChange={event => setWeight(event.target.value)}></input>
                    <br/><br/>
                    <label htmlFor="create-assignment-grade">Assignment grade (optional, 0-100)</label><br/>
                    <input type="text" 
                           id="create-assignment-grade" 
                           name="weight" 
                           onChange={event => setGrade(event.target.value)}></input>
                    <br/><br/>
                </form>
                <button type="reset" onClick={cancel} className="red-outline-button"><b>Cancel</b></button>
                <button type="submit" onClick={onSubmit} className="purple-button"><b>Create</b></button>
            </div>

        </div>

    );

};