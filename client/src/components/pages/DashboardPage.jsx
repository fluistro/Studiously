import React, { useState, useEffect } from "react";
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
    const arr = assignmentList.slice();

    // Filter out completed assignments
    arr.filter(assignment => !assignment.isCompleted);

    // Sort assignment list by due date
    arr.sort((a,b) => a.dueDate - b.dueDate);

    // Convert to JSX
    arr.forEach((assignment, index) => {
        return (
            <div className="list-block" key={index}>
                <div><p>{assignment.name}</p></div>
                <div><p>{assignment.dueDate}</p></div>
            </div>
        );
    });

    // Return at most 5 elements
    return arr.length > 5 ? arr.slice(0,5) : arr;

};

/**
 * @param {[Course]} courseList 
 * @returns {[React.JSX.Element]}
 */
const getCourseJSX = courseList => {

    // Create a shallow copy
    const arr = courseList.slice();

    // Sort by grade
    arr.sort((a,b) => {
        if (a.grade === null && b.grade === null) return 0;
        if (a.grade === null) return 1;
        if (b.grade === null) return -1;
        return b.grade - a.grade;
    });

    // Convert to JSX
    arr.forEach((course, index) => {
        return (
            <div className="list-block" key={index}>
                <div><p>{course.name}</p></div>
                <div><p>{course.grade}</p></div>
            </div>
        );
    });

}


export default function DashboardPage({ resetUser }) {

    // Lists of JSX components
    const [assignments, setAssignments] = useState([]);
    const [courses, setCourses] = useState([]);

    // Fetch assignments and courses on first render
    useEffect(() => {

        async function getInfo() {

            try {
                
                const courseList = await getUserCourses(resetUser);
                const assignmentList = await getAssignments(resetUser);

                setAssignments(getAssignmentJSX(assignmentList));
                setCourses(getCourseJSX(courseList));

            } catch (error) {
                console.log(`Dashboard error: ${error.message}`);
            }

        }

        getInfo();

    }, []);

    return (
        <div className="content">

            <h1>Dashboard</h1>

            {/* List of upcoming assignments, sorted by due date */}
            <div>
                {assignments}
            </div>

            {/* List of courses, sorted by grade */}
            <div>
                {courses}
            </div>

        </div>
    );
    
};