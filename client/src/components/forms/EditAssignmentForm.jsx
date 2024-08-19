import React, { useState } from "react";
import { editAssignment } from "../../connection/assignments";


/**
 * Edit assignment form component. Contains name, date, and isCompleted fields, and optional grade/weight.
 * 
 * Expects:
 * - Course id associated with the assignment to edit
 * - Old information about the assignment (assignment object)
 * - A method to log out the user
 * - A method to close the form (on success/cancel)
 */
export default function EditAssignmentForm({ courseId, assignment, logout, close }) {

    // Input fields, all strings
    const [name, setName] = useState(assignment.name);
    const [dueDate, setDueDate] = useState(assignment.dueDate.slice(0,10));
    const [isCompleted, setIsCompleted] = useState(assignment.isCompleted);
    const [grade, setGrade] = useState(assignment.grade);
    const [weight, setWeight] = useState(assignment.weight);

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
                dueDate,
                isCompleted,
                grade: grade && +grade, // convert to number
                weight: weight && +weight
            }

            console.log(assignmentInfo)

            await editAssignment(courseId, assignment._id, assignmentInfo, logout);
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
                <h1>Edit Assignment</h1>
            </div>

            <div className="form-error-message">{error && <p className="error">Error: {error}</p>}</div>
            
            <div className="form-body">
                <form>
                    <label htmlFor="edit-assignment-name">Assignment name</label><br/>
                    <input type="text" 
                           id="edit-assignment-name" 
                           name="name" 
                           value={name}
                           onChange={event => setName(event.target.value)}></input>
                    <br/><br/>
                    <label htmlFor="edit-assignment-date">Due date</label><br/>
                    <input type="date" 
                           id="edit-assignment-date" 
                           name="date" 
                           value={dueDate}
                           onChange={event => setDueDate(event.target.value)}></input>
                    <br/><br/>
                    <label htmlFor="edit-assignment-completed">Is completed</label><br/>
                    <input type="checkbox" 
                           id="edit-assignment-completed" 
                           name="completed" 
                           checked={isCompleted}
                           onChange={() => setIsCompleted(val => !val)}></input> 
                    <br/><br/>
                    <label htmlFor="edit-assignment-weight">Assignment weight (optional, 0-100)</label><br/>
                    <input type="text" 
                           id="edit-assignment-weight" 
                           name="weight" 
                           value={weight || ""}
                           onChange={event => setWeight(event.target.value)}></input>
                    <br/><br/>
                    <label htmlFor="edit-assignment-grade">Assignment grade (optional, 0-100)</label><br/>
                    <input type="text" 
                           id="edit-assignment-grade" 
                           name="grade" 
                           value={grade || ""}
                           onChange={event => setGrade(event.target.value)}></input>
                    <br/><br/>
                </form>
                <button type="reset" onClick={cancel} className="red-outline-button"><b>Cancel</b></button>
                <button type="submit" onClick={onSubmit} className="purple-button"><b>Save</b></button>
            </div>

        </div>

    );

};