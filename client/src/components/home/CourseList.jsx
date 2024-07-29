import React, { useState } from "react";
import ListBlock from "./ListBlock";

function listToJSX(courses) {
    if (!courses) return <p>No courses have been created</p>;
    else return courses.map((course, index) => {
        return <ListBlock key={index} left={course.name} right={`${course.grade}%`} />
    });
}

export default function CourseList() {

    /*
    One of:
    - date (date created)
    - grade
    - assignments (# of)
    */
    const [ sort, setSort ] = useState("date");

    // true = ascending, false = descending
    // const [ sortOrder, setSortOrder ] = useState(true);

    return (
        <div className="content">
            <h1>Courses</h1>
        </div>
    );
};