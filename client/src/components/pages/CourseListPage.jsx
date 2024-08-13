import React, { useState, useEffect, useCallback, useMemo } from "react";
import { getUserCourses, deleteCourse } from "../../connection/courses";
import CreateCourseForm from "../forms/CreateCourseForm";
import EditCourseForm from "../forms/EditCourseForm";


// For Intellisense

/**
 * @typedef {import('../../connection/courses').Course} Course
 */


/**
 * Lightbox for displaying create course form
 * 
 * @param {function():void} logout // To reset user state 
 * @param {function():void} close // To close lightbox 
 * @returns 
 */
const CreateCourseLightbox = (logout, close) => {
    return (
        <div className="lightbox">
            <CreateCourseForm close={close} logout={logout}/>
        </div>
    )
};

/**
 * Lightbox for displaying edit course form
 * 
 * @param {function():void} logout // To reset user state 
 * @param {function():void} close // To close lightbox 
 * @returns 
 */
const EditCourseLightbox = (id, logout, close) => {
    return (
        <div className="lightbox">
            <EditCourseForm courseId={id} close={close} logout={logout}/>
        </div>
    )
};

/**
 * @param {string} sorter - one of "name", "grade", "assignments"
 * @param {[Course]} courses
 * 
 * @returns {[Course]}
 */
const sortCourses = (sorter, courses) => {
    const newCourses = courses.slice();

    switch(sorter) {

        case "name":
            newCourses.sort((a, b) => {
                return a.name.localeCompare(b.name);
            });
            break;

        case "grade":
            newCourses.sort((a, b) => {
                return a.grade - b.grade;
            });
            break;

        case "assignments":
            newCourses.sort((a, b) => {
                return a.assignments.length - b.assignments.length;
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

    const [courses, setCourses] = useState([]); // Array of Course objects
    const [form, setForm] = useState(); // To indicate which (if any) form to show
    const [courseId, setCourseId] = useState(); // For the edit form


    // Callbacks to handle form showing

    const showCreateCourseForm = useCallback(
        () => setForm("create"), 
        []
    );

    const showEditCourseForm = useCallback(
        id => {
            setForm("edit");
            setCourseId(id);
        },
        []
    );

    const closeForm = useCallback(
        () => setForm(undefined), 
        []
    );


    // Course list as a JSX list
    const courseList = useMemo (
        () => courses.map((course, index) => {
            return (
                <div className="list-area" key={index} >

                    <div className="list-block" >
                        <div><p>{course.name}</p></div>
                        <div><p>{course.assignments.length}</p></div>
                        <div><p>{course.grade}</p></div>
                    </div>

                    {/* Buttons */}
                    <button className="purple-button" onClick={() => showEditCourseForm(course._id)}>Edit</button>
                    <button className="red-button" onClick={() => deleteCourse(course._id, resetUser)}>Delete</button>

                </div>
            );
        }),
        [courses, showEditCourseForm, resetUser]
    );


    // Fetch assignments and courses on first render
    useEffect(() => {

        console.log("effect")

        async function getInfo() {

            try {
                
                const data = await getUserCourses(resetUser);
                setCourses(data);
                setCourses(courses => sortCourses("name", courses));

            } catch (error) {
                console.log(`Course list error: ${error.message}`);
            }

        }

        getInfo();

    }, [resetUser]);

    return (
        <div className="content">
            <h1>Courses</h1>

            <select name="select-sort" id="select-sort" onChange={(event) => setCourses(sortCourses(event.target.value, courses))}>
                <option value="name">Name</option>
                <option value="grade">Grade</option>
                <option value="assignments">Assignments</option>
            </select>

            <button className="purple-button" onClick={() => showCreateCourseForm()}>Create</button>

            {courseList()}

            {/* Lightboxes */}
            {form === "create" && CreateCourseLightbox(resetUser, closeForm)}
            {form === "edit" && EditCourseLightbox(courseId, resetUser, closeForm)}
        </div>
    );

};