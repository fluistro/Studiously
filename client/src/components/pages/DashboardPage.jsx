import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Loading from "./Loading";
import { getAssignments } from "../../connection/assignments";
import { getUserCourses } from "../../connection/courses";


// For Intellisense
/**
 * @typedef {import('../../connection/assignments').Assignment} Assignment
 */

/**
 * @typedef {import('../../connection/courses').Course} Course
 */


/**
 * @param {[Assignment]} assignmentList
 * @returns {[React.JSX.Element]}
 */
const getAssignmentJSX = assignmentList => {

    // Create a shallow copy
    let arr = assignmentList.slice();

    // Filter out completed assignments
    arr = arr.filter(assignment => !assignment.isCompleted);

    // Sort assignment list by due date
    arr = arr.sort((a,b) => new Date(a.dueDate) - new Date(b.dueDate));

    // Convert to JSX
    const result = arr.map((assignment, index) => {
        return (
            <div className="list-block" key={index}>
                <div className="list-text"><p>{assignment.name}</p></div>
                <div className="list-text"><p>Due: {assignment.dueDate.slice(0, 10)}</p></div>
            </div>
        );
    });

    // Return at most 5 elements
    return result.length > 5 ? result.slice(0,5) : result;

};

/**
 * @param {[Course]} courseList 
 * @returns {[React.JSX.Element]}
 */
const getCourseJSX = courseList => {

    // Create a shallow copy
    let arr = courseList.slice();
    
    // Sort by grade
    arr.sort((a,b) => {
        if (a.grade === null && b.grade === null) return 0;
        if (a.grade === null) return 1;
        if (b.grade === null) return -1;
        return b.grade - a.grade;
    });

    // Convert to JSX
    const result = arr.map((course, index) => {
        return (
            <div className="list-block" key={index}>
                <div className="list-text"><NavLink to={`/home/courses/${course._id}`} >{course.name}</NavLink></div>
                <div className="list-text"><p>{course.grade ? `Grade: ${course.grade}%` : "No grade"}</p></div>
            </div>
        );
    });

    // Return at most 5 elements
    return result.length > 5 ? result.slice(0,5) : result;

}


/**
 * Dashboard component. Expects a function to reset user state.
 * 
 * @returns {React.JSX.Element}
 */
export default function DashboardPage({ resetUser }) {

    // Lists of JSX components
    const [assignments, setAssignments] = useState([]);
    const [courses, setCourses] = useState([]);

    // To track if loading screen should be shown
    const [loading, setLoading] = useState(true);

    // Fetch assignments and courses on first render
    useEffect(() => {

        async function getInfo() {

            setLoading(true);

            try {
                
                const courseList = await getUserCourses(resetUser);
                const assignmentList = await getAssignments(resetUser);

                setAssignments(getAssignmentJSX(assignmentList));
                setCourses(getCourseJSX(courseList));

            } catch (error) {
                console.log(`Dashboard error: ${error.message}`);
            } finally {
                setLoading(false);
            }

        }

        getInfo();

    }, [resetUser]);

    return loading ? <Loading /> : (
        <div className="content">

            <h1>Dashboard</h1>

            {/* List of upcoming assignments, sorted by due date */}
            <div>
                <h2>Upcoming Assignments</h2>
                {assignments.length > 0 ? assignments : <p>You have no upcoming assignments!</p>}
            </div>

            {/* List of courses, sorted by grade */}
            <div>
                <h2>Grades</h2>
                {courses.length > 0 ? courses : <p>No courses have been created.</p>}
            </div>

        </div>
    );

};