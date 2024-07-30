import React, { useState, useEffect } from "react";
import ListBlock from "./ListBlock";
import { getCourses } from "../../connection/courses";
import ModifyCourse from "./ModifyCourses";


// Given a list of course information, return JSX representing that information
function listToJSX(courses) {

    if (!courses) return <p>No courses have been created</p>;

    return courses.map((course, index) => {
        return (
            <ListBlock 
                key={index} 
                left={course.name} 
                right={typeof course.grade !== "undefined" && `${course.grade}%`} // Blank if grade is undefined
                link={`/home/courses/${course._id}`} />
        );
    });

}


export default function CourseList({ setUser }) {

    /*
    One of:
    - name (lexicographical order)
    - grade
    - assignments (# of)
    */
    const [ sortCriteria, setSortCriteria ] = useState("name");
    const [ courseList, setCourseList ] = useState();

    // Lightbox for creating courses
    const [ showLightbox, setShowLightbox ] = useState(false);

    // Initialize courseList with fetch request on first render
    useEffect(() => {
        async function initializeCourses() {

            const data = await getCourses();

            if (data.error) {

                console.log(data.error);

                // Session expired before logging out
                if (data.error === "Not currently logged in") setUser(undefined);

            } else {
                setCourseList(data);
            }

        }

        initializeCourses();
    }, [setUser]);

    // Function for sorting courseList based on criteria
    async function sortCourses() {

        // Create a shallow copy of courseList and sort it
        console.log(`Course list: ${courseList}`)
        const newCourseList = [ ...courseList ];

        switch(sortCriteria) {

            case "name":
                newCourseList.sort((a, b) => {
                    return a.name.localeCompare(b.name);
                });
                break;

            case "grade":
                newCourseList.sort((a, b) => {
                    return a.grade - b.grade;
                });
                break;

            case "assignments":
                newCourseList.sort((a, b) => {
                    return a.assignments.length - b.assignments.length;
                });
                break;

            default:
                console.log(`Invalid sort criteria: ${sortCriteria}`);

        }

        setSortCriteria(newCourseList);

    }

    function updateSort(event) {
        setSortCriteria(event.target.value);
        sortCourses();
    }


    return (

        <div className="content">

            <h1>Courses</h1>

            <select name="select-sort" id="select-sort" onChange={updateSort}>
                <option value="name">Name</option>
                <option value="grade">Grade</option>
                <option value="assignments">Assignments</option>
            </select>

            {listToJSX(courseList)}

            <button onClick={() => setShowLightbox(true)}>Create Course</button>
            {showLightbox && <ModifyCourse close={() => setShowLightbox(false)} method="create" setUser={setUser} />}

        </div>
    );
};