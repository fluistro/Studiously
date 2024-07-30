import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getCourse } from "../../connection/courses";

export default function Course({ setUser }) {

    // Course information
    const [ course, setCourse ] = useState();
    const [ course_id ] = useParams();

    useEffect(() => {

        // Fetch course info using URL param
        async function loadCourse() {
            const response = await getCourse(course_id);
            setCourse(response);
        }

        loadCourse();

    }, []);

    return (
        <div className="content">
            <h1>{course.name}</h1>
            <p>Grade: {course.grade}</p>
            <h1>Assignments</h1>
            <button onClick={() => setShowLightbox(true)}>Edit Course</button>
            {showLightbox && <ModifyCourse close={() => setShowLightbox(false)} method="edit" setUser={props.setUser} />}
        </div>
    );

}