import React, { useState, useEffect } from "react";
import ListBlock from "./ListBlock";

function listToJSX(courses) {
    if (!courses) return <p>No courses have been created</p>;
    else return courses.map((course, index) => {
        return <ListBlock key={index} left={course.name} right={`${course.grade}%`} />
    });
}

export default function Dashboard() {

    // Get courses and grades
    const [courses, setCourses] = useState();

    useEffect(() => {
        fetch(
            "http://localhost:5000/api/courses/", 
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
        })
        .then(res => res.json())
        .then(data => {
            setCourses(data);
        });
    }, []);

    return (
        <div className="content">
            <h1>Dashboard</h1>
            <h2>Next Assignment</h2>
            <ListBlock left="Name" middle="Weight" right="Due date" />
            <h2>Grades</h2>
            { listToJSX(courses) }
        </div>
    );
    
};