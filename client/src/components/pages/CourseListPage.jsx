import React, { useState, useEffect } from "react";
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
}

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
}


/**
 * Course list component. Expects a function to reset user state.
 * 
 * @returns {React.JSX.Element}
 */
export default function CourseListPage({ resetUser }) {

    const [courses, setCourses] = useState([]); // Array of Course objects
    const [courseList, setCourseList] = useState([]); // Array of JSX elements
    const [sorter, setSorter] = useState(); // Field to sort on

    const [form, setForm] = useState(); // To indicate which (if any) form to show
    const [courseId, setCourseId] = useState(); // For the edit form

    const showCreateCourseForm = () => setForm("create");
    const showEditCourseForm = id => {
        setForm("edit");
        setCourseId(id);
    }
    const closeForm = () => setForm(undefined);


    /**
    * @param {[Course]} courses 
    * @returns {[React.JSX.Element]}
    */
    const getCourseJSX = () => {
        return courses.map((course, index) => {
            return (
                <div className="list-area">

                    <div className="list-block" key={index}>
                        <div><p>{course.name}</p></div>
                        <div><p>{course.grade}</p></div>
                    </div>

                    {/* Buttons */}
                    <button onClick={() => showEditCourseForm(course._id)}>Edit</button>
                    <button onClick={() => deleteCourse(course._id, resetUser)}>Delete</button>

                </div>
            );
        });
    }


    // Fetch assignments and courses on first render
    useEffect(() => {

        async function getInfo() {

            try {
                
                const data = await getUserCourses(resetUser);
                setCourses(data);
                setCourseList(getCourseJSX());

            } catch (error) {
                console.log(`Course list error: ${error.message}`);
            }

        }

        getInfo();

    }, [resetUser, getCourseJSX]);

    // To call when sorting field is changed
    async function onSorterChange(event) {

        setSorter(event.target.value);

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

        setCourses(newCourses);
        setCourseList(getCourseJSX(courses, showEditCourseForm));

    }

    return (
        <div className="content">
            <h1>Courses</h1>

            <select name="select-sort" id="select-sort" onChange={onSorterChange}>
                <option value="name">Name</option>
                <option value="grade">Grade</option>
                <option value="assignments">Assignments</option>
            </select>

            <button onClick={() => showCreateCourseForm}></button>

            {courseList}

            {/* Lightboxes */}
            {form === "create" && CreateCourseLightbox(resetUser, closeForm)}
            {form === "edit" && EditCourseLightbox(courseId, resetUser, closeForm)}
        </div>
    );

};