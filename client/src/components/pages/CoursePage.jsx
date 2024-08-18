import React, { useState, useEffect, useCallback, useMemo } from "react";

import { getCourse } from "../../connection/courses";
import { getCourseAssignments, deleteAssignment } from "../../connection/assignments";
import CreateAssignmentForm from "../forms/CreateAssignmentForm";
import EditAssignmentForm from "../forms/EditAssignmentForm";
import { useParams } from "react-router-dom";
import Loading from "./Loading";


// For Intellisense

/**
 * @typedef {import('../../connection/courses').Course} Course
 */

/**
 * @typedef {import('../../connection/assignments').Assignment} Assignment
 */


/**
 * Lightbox for displaying create assignment form.
 * 
 * @param {string} courseId 
 * @param {function():void} logout 
 * @param {function():void} close 
 * @returns {React.JSX.Element}
 */
const createAssignmentLightbox = (courseId, logout, close) => {
    return (
        <div className="lightbox">
            <CreateAssignmentForm courseId={courseId} logout={logout} close={close} />
        </div>
    );
};

/**
 * Lightbox for displaying edit assignment form.
 * 
 * @param {string} courseId 
 * @param {string} assignmentId 
 * @param {function():void} logout 
 * @param {function():void} close 
 * @returns {React.JSX.Element}
 */
const editAssignmentLightbox = (courseId, assignment, logout, close) => {
    return (
        <div className="lightbox">
            <EditAssignmentForm courseId={courseId} assignment={assignment} logout={logout} close={close} />
        </div>
    );
};


/**
 * Sort and filter assignments based on criteria.
 * 
 * @param {string} sorter - one of "name", "dueDate", "grade", "weight"
 * @param {boolean} showCompleted 
 * @param {[Assignment]} assignments 
 * @returns {[Assignment]}
 */
const sortFilterAssignments = (sorter, showCompleted, assignments) => {

    const newAssignments = assignments.slice();

    // Filter
    if (showCompleted) {
        newAssignments.filter(assignment => assignment.isCompleted);
    }

    // Sort
    switch(sorter) {

        case "name":
            newAssignments.sort((a, b) => {
                return a.name.localeCompare(b.name);
            });
            break;

        case "grade":
            newAssignments.sort((a, b) => {
                if (a.grade === null && b.grade === null) return 0;
                if (a.grade === null) return 1;
                if (b.grade === null) return -1;
                return b.grade - a.grade;
            });
            break;

        case "dueDate":
            newAssignments.sort((a, b) => {
                return a.dueDate - b.dueDate;
            });
            break;

        case "weight":
            newAssignments.sort((a, b) => {
                if (a.weight === null && b.weight === null) return 0;
                if (a.weight === null) return 1;
                if (b.weight === null) return -1;
                return b.weight - a.weight;
            });
            break;

        default:
            console.log(`Invalid sort criteria: ${sorter}`);

    }

    return newAssignments;

}


/**
 * Course page component. Expects a function to reset user state, and the current course id.
 * 
 * @returns {React.JSX.Element}
 */
export default function CoursePage({ resetUser }) {

    const {courseId} = useParams();

    const [course, setCourse] = useState(); // Course object representing current course
    const [assignments, setAssignments] = useState([]); // Array of Assignment objects
    const [form, setForm] = useState(); // Indicates which form to show
    const [assignment, setAssignment] = useState(); // For the edit form

    // For the assignment list
    const [sorter, setSorter] = useState("name");
    const [showCompleted, setShowCompleted] = useState(false);

    const [update, setUpdate] = useState(false); // To trigger the fetch request effect hook

    // To track if loading screen should be shown
    const [loading, setLoading] = useState(true);


    // Callbacks to handle form showing

    const showCreateAssignmentForm = useCallback(
        () => setForm("create"), 
        []
    );

    const showEditAssignmentForm = useCallback(
        assignment => {
            setForm("edit");
            setAssignment(assignment);
        },
        []
    );

    const closeForm = useCallback(
        () => {
            setForm(undefined);
            setUpdate(val => !val); // Update course and assignment info
        }, 
        []
    );


    // Event handlers for sort/filter selection

    const onSorterChange = event => {
        setSorter(event.target.value);
        setAssignments(assignments => sortFilterAssignments(sorter, showCompleted, assignments));
    }

    const onFilterChange = () => {
        setShowCompleted(val => !val);
        setAssignments(assignments => sortFilterAssignments(sorter, showCompleted, assignments));
    }


    // Assignment list as JSX
    const assignmentList = useMemo(
        () => assignments.map((assignment, index) => {
            return (
                <div className="list-area" key={index}>

                    <div className="list-block">
                        <div><p>{assignment.name}</p></div>
                        <div><p>{`Due: ${assignment.dueDate.slice(0, 10)}`}</p></div>
                    </div>

                    {/* Buttons */}
                    <button className="purple-button" onClick={() => showEditAssignmentForm(assignment)}>Edit</button>
                    <button className="red-button" onClick={
                        async () => {
                            await deleteAssignment(courseId, assignment._id, resetUser);
                            setUpdate(val => !val);
                        }
                    }>Delete</button>

                </div>
            );
        }),
        [assignments, courseId, showEditAssignmentForm, resetUser]
    );


    // Fetch course info and assignments on first render
    useEffect(() => {

        async function getInfo() {

            setLoading(true);

            try {

                const courseData = await getCourse(courseId, resetUser);
                setCourse(courseData);

                const assignmentsData = await getCourseAssignments(resetUser, courseId);
                setAssignments(assignmentsData);
                setAssignments(val => sortFilterAssignments("name", false, val));
                setSorter("name");
                setShowCompleted(false);

            } catch (error) {
                console.log(`Course page error: ${error.message}`);
            } finally {
                setLoading(false);
            }

        }

        getInfo();

    }, [resetUser, update, courseId]);

    
    return loading ? <Loading /> : (
        <div className="content">
            <h1>{course && course.name}</h1>

            <label htmlFor="select-sort">Sort assignments by:  </label>

            <select name="select-sort" id="select-sort" onChange={onSorterChange} value={sorter}>
                <option value="name">Name</option>
                <option value="dueDate">Due Date</option>
                <option value="grade">Grade</option>
                <option value="weight">Weight</option>
            </select>

            <br />

            <label htmlFor="show-completed">Show completed assignments </label>

            <input type="checkbox" 
                id="show-completed" 
                name="completed" 
                checked={showCompleted}
                onChange={onFilterChange}></input> 

            <br /><br />

            <button className="purple-button" onClick={() => showCreateAssignmentForm()}>Create</button>

            <h2>Assignment List</h2>

            {assignmentList}

            {/* Lightboxes */}
            {form === "create" && createAssignmentLightbox(courseId, resetUser, closeForm)}
            {form === "edit" && editAssignmentLightbox(courseId, assignment, resetUser, closeForm)}
        </div>
    );
}