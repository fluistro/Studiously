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
    const [name, setName] = useState();
    const [dueDate, setDueDate] = useState();
    const [isCompleted, setIsCompleted] = useState(false);
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
                isCompleted: isCompleted,
                grade: grade && +grade, // convert to number
                weight: weight && +weight
            }

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
                           value={assignment.name}
                           onChange={event => setName(event.target.value)}></input>
                    <br/><br/>
                    <label htmlFor="edit-assignment-date">Due date</label><br/>
                    <input type="date" 
                           id="edit-assignment-date" 
                           name="date" 
                           value={assignment.dueDate}
                           onChange={event => setDueDate(event.target.value)}></input>
                    <br/><br/>
                    <label htmlFor="edit-assignment-completed">Is completed</label><br/>
                    <input type="checkbox" 
                           id="edit-assignment-completed" 
                           name="completed" 
                           value={assignment.isCompleted}
                           onClick={() => setIsCompleted(!isCompleted)}></input> 
                    <br/><br/>
                    <label htmlFor="edit-assignment-weight">Assignment weight (optional, 0-100)</label><br/>
                    <input type="text" 
                           id="edit-assignment-weight" 
                           name="weight" 
                           value={assignment.weight || ""}
                           onChange={event => setWeight(event.target.value)}></input>
                    <br/><br/>
                    <label htmlFor="edit-assignment-grade">Assignment grade (optional, 0-100)</label><br/>
                    <input type="text" 
                           id="edit-assignment-grade" 
                           name="grade" 
                           value={assignment.grade || ""}
                           onChange={event => setGrade(event.target.value)}></input>
                    <br/><br/>
                </form>
                <button type="reset" onClick={cancel} className="red-outline-button"><b>Cancel</b></button>
                <button type="submit" onClick={onSubmit} className="purple-button"><b>Create</b></button>
            </div>

        </div>

    );

};