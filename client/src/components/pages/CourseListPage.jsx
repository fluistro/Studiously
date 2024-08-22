import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { getUserCourses, deleteCourse } from "../../connection/courses";

import CreateCourseForm from "../forms/CreateCourseForm";
import EditCourseForm from "../forms/EditCourseForm";
import Loading from "./Loading";


// For Intellisense

/**
 * @typedef {import('../../connection/courses').Course} Course
 */


/**
 * Lightbox for displaying create course form
 * 
 * @param {function():void} logout - To reset user state 
 * @param {function():void} close - To close lightbox 
 * @returns {React.JSX.Element}
 */
const CreateCourseLightbox = (logout, close) => {
    return (
        <div className="lightbox">
            <CreateCourseForm logout={logout} close={close} />
        </div>
    );
};

/**
 * Lightbox for displaying edit course form
 * 
 * @param {Course} course - Course info to edit
 * @param {function():void} logout - To reset user state 
 * @param {function():void} close - To close lightbox 
 * @returns {React.JSX.Element}
 */
const EditCourseLightbox = (course, logout, close) => {
    return (
        <div className="lightbox">
            <EditCourseForm course={course} logout={logout} close={close} />
        </div>
    );
};

/**
 * @param {string} sorter - one of "name", "grade", "assignments"
 * @param {[Course]} courses
 * 
 * @returns {[Course]}
 */
const sortCourses = (sorter, courses) => {

    let newCourses = courses.slice();

    switch(sorter) {

        case "name":
            newCourses = newCourses.sort((a, b) => {
                return a.name.localeCompare(b.name);
            });
            break;

        case "grade":
            newCourses = newCourses.sort((a, b) => {
                
                const aHasGrade = Object.hasOwn(a, "grade");
                const bHasGrade = Object.hasOwn(b, "grade");

                if (!aHasGrade && !bHasGrade) return 0;
                if (!aHasGrade) return 1;
                if (!bHasGrade) return -1;
                return b.grade - a.grade;

            });
            break;

        case "assignments":
            newCourses = newCourses.sort((a, b) => {
                return b.assignments.length - a.assignments.length;
            });
            break;

        default:
            console.log(`Invalid sort criteria: ${sorter}`);

    }

    return newCourses;
};


/**
 * Course list component. Expects a function to reset user state.
 * 
 * @returns {React.JSX.Element}
 */
export default function CourseListPage({ resetUser }) {

    const navigate = useNavigate();

    const [courses, setCourses] = useState([]); // Array of Course objects

    const [form, setForm] = useState(); // Indicates which form to show
    const [course, setCourse] = useState(); // Previous course info for the edit form

    const [sorter, setSorter] = useState("name"); // Sort for the course list
    
    const [update, setUpdate] = useState(false); // Toggle to trigger the fetch request useEffect hook
    const [loading, setLoading] = useState(true); // To track if loading screen should be shown


    // Callbacks to handle form showing

    const showCreateCourseForm = useCallback(
        () => setForm("create"), 
        []
    );

    const showEditCourseForm = useCallback(
        course => {
            setCourse(course);
            setForm("edit");
        },
        []
    );

    const closeForm = useCallback(
        () => {
            setForm(undefined);
            setUpdate(val => !val);
        }, 
        []
    );


    // Sort handler
    const onSorterChange = event => {
        setSorter(event.target.value);
    }


    // Course list as a JSX list
    const courseList = useMemo (
        () => sortCourses(sorter, courses).map((course, index) => {
            return (
                <div className="list-area" key={index} >

                    <div className="list-block" onClick={() => navigate(`/home/courses/${course._id}`)}>
                        <div><p>{course.name}</p></div>
                        <div><p>{`${course.assignments.length} upcoming assignment${course.assignments.length === 1 ? "" : "s"}`}</p></div>
                        <div><p>Grade: {course.grade || "None"}</p></div>
                    </div>

                    {/* Buttons */}
                    <button className="purple-button" onClick={() => showEditCourseForm(course)}>Edit</button>
                    <button className="red-button" onClick={
                        async () => {
                            await deleteCourse(course._id, resetUser);
                            setUpdate(val => !val); // Re-render course list
                        }
                    }>Delete</button>

                </div>
            );
        }),
        [
            sorter,

            // These do not change after first render
            courses, showEditCourseForm, resetUser, navigate]
    );


    // Update courses, reset sorter
    useEffect(() => {

        async function getInfo() {

            setLoading(true);

            try {
                
                const data = await getUserCourses(resetUser);
                setCourses(data);

                setSorter("name");

            } catch (error) {
                console.log(`Course list error: ${error.message}`);
            } finally {
                setLoading(false);
            }

        }

        getInfo();

        }, 
        [update, resetUser]
    );

    return loading ? <Loading /> : (

        <div className="content">

            <h1>Courses</h1>

            <label htmlFor="select-sort">Sort by:  </label>

            <select name="select-sort" id="select-sort" onChange={onSorterChange} value={sorter}>
                <option value="name">Name</option>
                <option value="grade">Grade</option>
                <option value="assignments">Assignments</option>
            </select>

            <br /><br />

            <button className="purple-button" onClick={() => showCreateCourseForm()}>Create</button>

            <h2>Course List</h2>

            {courseList.length > 0 ? courseList : <p>No courses have been created.</p>}

            {/* Lightboxes */}
            {form === "create" && CreateCourseLightbox(resetUser, closeForm)}
            {form === "edit" && EditCourseLightbox(course, resetUser, closeForm)}
        </div>
    );

};