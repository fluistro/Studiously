import React, { useState, useEffect, useCallback, useMemo } from "react";
import { getUserCourses, deleteCourse } from "../../connection/courses";
import CreateCourseForm from "../forms/CreateCourseForm";
import EditCourseForm from "../forms/EditCourseForm";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";


// For Intellisense

/**
 * @typedef {import('../../connection/courses').Course} Course
 */


/**
 * Lightbox for displaying create course form
 * 
 * @param {function():void} update - To update the course list
 * @param {function():void} logout - To reset user state 
 * @param {function():void} close - To close lightbox 
 * @returns {React.JSX.Element}
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
 * @param {function():void} update - To update the course list
 * @param {Course} course - Course info to edit
 * @param {function():void} logout - To reset user state 
 * @param {function():void} close - To close lightbox 
 * @returns {React.JSX.Element}
 */
const EditCourseLightbox = ( course, logout, close) => {
    return (
        <div className="lightbox">
            <EditCourseForm course={course} close={close} logout={logout}/>
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
                if (a.grade === null && b.grade === null) return 0;
                if (a.grade === null) return 1;
                if (b.grade === null) return -1;
                return b.grade - a.grade;
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

    const navigate = useNavigate();

    const [courses, setCourses] = useState([]); // Array of Course objects
    const [form, setForm] = useState(); // To indicate which (if any) form to show
    const [course, setCourse] = useState(); // For the edit form

    const [updateCourses, setUpdateCourses] = useState(false); // To trigger the fetch request effect hook

    // For the course list
    const [sorter, setSorter] = useState("name");

    // To track if loading screen should be shown
    const [loading, setLoading] = useState(true);


    // Callbacks to handle form showing

    const showCreateCourseForm = useCallback(
        () => setForm("create"), 
        []
    );

    const showEditCourseForm = useCallback(
        course => {
            setForm("edit");
            setCourse(course);
        },
        []
    );

    const closeForm = useCallback(
        () => {
            setForm(undefined);
            setUpdateCourses(val => !val);
        }, 
        []
    );


    // Sort handler
    const onSorterChange = event => {
        setSorter(event.target.value);
        setCourses(courses => sortCourses(sorter, courses));
    }


    // Course list as a JSX list
    const courseList = useMemo (
        () => courses.map((course, index) => {
            return (
                <div className="list-area" key={index} >

                    <div className="list-block" onClick={() => navigate(`/home/courses/${course._id}`)}>
                        <div><p>{course.name}</p></div>
                        <div><p>{`${course.assignments.length} upcoming assignments`}</p></div>
                        <div><p>{course.grade !== null ? course.grade : "No grade"}</p></div>
                    </div>

                    {/* Buttons */}
                    <button className="purple-button" onClick={() => showEditCourseForm(course)}>Edit</button>
                    <button className="red-button" onClick={
                        async () => {
                            await deleteCourse(course._id, resetUser);
                            setUpdateCourses(val => !val); // Re-render course list
                        }
                    }>Delete</button>

                </div>
            );
        }),
        [courses, showEditCourseForm, resetUser, navigate]
    );


    // Fetch courses on first render
    useEffect(() => {

        async function getInfo() {

            setLoading(true);

            try {
                
                const data = await getUserCourses(resetUser);
                setCourses(data);
                setCourses(courses => sortCourses("name", courses));
                setSorter("name");

            } catch (error) {
                console.log(`Course list error: ${error.message}`);
            } finally {
                setLoading(false);
            }

        }

        getInfo();

    }, [resetUser, updateCourses]);

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

            {courseList}

            {/* Lightboxes */}
            {form === "create" && CreateCourseLightbox(resetUser, closeForm)}
            {form === "edit" && EditCourseLightbox(course, resetUser, closeForm)}
        </div>
    );

};