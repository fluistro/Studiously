import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";

import { getCourse } from "../../connection/courses";
import { getCourseAssignments, deleteAssignment } from "../../connection/assignments";

import CreateAssignmentForm from "../forms/CreateAssignmentForm";
import EditAssignmentForm from "../forms/EditAssignmentForm";
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
 * @param {Assignment} assignment
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

    let newAssignments = assignments.slice();

    // Filter
    if (showCompleted) {
        newAssignments = newAssignments.filter(assignment => assignment.isCompleted);
    } else {
        newAssignments = newAssignments.filter(assignment => !assignment.isCompleted);
    }

    // Sort
    switch(sorter) {

        case "name":
            newAssignments = newAssignments.sort((a, b) => {
                return a.name.localeCompare(b.name);
            });
            break;

        case "dueDate":
            newAssignments = newAssignments.sort((a, b) => {
                return new Date(a.dueDate) - new Date(b.dueDate);
            });
            break;

        case "grade":
            newAssignments = newAssignments.sort((a, b) => {

                const aHasGrade = Object.hasOwn(a, "grade");
                const bHasGrade = Object.hasOwn(b, "grade");

                if (!aHasGrade && !bHasGrade) return 0;
                if (!aHasGrade) return 1;
                if (!bHasGrade) return -1;
                return b.grade - a.grade;

            });
            break;

        case "weight":
            newAssignments = newAssignments.sort((a, b) => {

                const aHasWeight = Object.hasOwn(a, "weight");
                const bHasWeight = Object.hasOwn(b, "weight");

                if (!aHasWeight && !bHasWeight) return 0;
                if (!aHasWeight) return 1;
                if (!bHasWeight) return -1;
                return b.weight - a.weight;

            });
            break;

        default:
            console.log(`Invalid sort/filter criteria: ${sorter}/${showCompleted}`);

    }
    
    return newAssignments;

}


/**
 * Course page component. Expects a function to reset user state.
 * 
 * @returns {React.JSX.Element}
 */
export default function CoursePage({ resetUser }) {

    const {courseId} = useParams();

    const [course, setCourse] = useState(); // Course object representing current course
    const [assignments, setAssignments] = useState([]); // Array of Assignment objects

    const [form, setForm] = useState(); // Indicates which form to show
    const [assignment, setAssignment] = useState(); // Previous assignment info for the edit form

    // Sort/filter for the assignment list
    const [sorter, setSorter] = useState("name");
    const [showCompleted, setShowCompleted] = useState(false);

    const [update, setUpdate] = useState(false); // Toggle to trigger the fetch request useEffect hook
    const [loading, setLoading] = useState(true); // To track if loading screen should be shown


    // Callbacks to handle form showing

    const showCreateAssignmentForm = useCallback(
        () => setForm("create"), 
        []
    );

    const showEditAssignmentForm = useCallback(
        assignment => {
            setAssignment(assignment);
            setForm("edit");
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
    }

    const onFilterChange = () => {
        setShowCompleted(prev => !prev);
    }


    // Assignment list as JSX. Updates whenever sort/filter is changed
    const assignmentList = useMemo(
        () => sortFilterAssignments(sorter, showCompleted, assignments).map((assignment, index) => {
            return (
                <div className="list-area" key={index}>

                    <div className="list-block">
                        <div><p>{assignment.name}</p></div>
                        <div><p>{Object.hasOwn(assignment, "weight") && `Weight: ${assignment.weight}`}</p></div>
                        <div><p>{Object.hasOwn(assignment, "grade") && `grade: ${assignment.grade}`}</p></div>
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
        [
            sorter, showCompleted, 

            // These do not change after first render
            assignments, courseId, showEditAssignmentForm, resetUser 
        ]
    );


    // Update courses and assignments, reset sort/filter
    useEffect(
        () => {

            async function getInfo() {

                setLoading(true);

                try {

                    const courseData = await getCourse(courseId, resetUser);
                    setCourse(courseData);

                    const assignmentsData = await getCourseAssignments(resetUser, courseId);
                    setAssignments(assignmentsData);
                    setSorter("name");
                    setShowCompleted(false);

                } catch (error) {
                    console.log(`Course page error: ${error.message}`);
                } finally {
                    setLoading(false);
                }

            }

            getInfo();

        }, 
        [
            update, 

            // These do not change after first render
            resetUser, courseId
        ]
    );

    
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

            {assignmentList.length > 0 ? assignmentList : <p>{`There are no ${showCompleted ? "completed" : "uncompleted"} assignments for this course.`}</p>}

            {/* Lightboxes */}
            {form === "create" && createAssignmentLightbox(courseId, resetUser, closeForm)}
            {form === "edit" && editAssignmentLightbox(courseId, assignment, resetUser, closeForm)}

        </div>
    );
}