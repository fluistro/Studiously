import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getCourse } from "../../connection/courses";
import ModifyCourse from "./ModifyCourses";

export default function Course({ setUser }) {

    // Course information
    const [ course, setCourse ] = useState({});
    const { course_id } = useParams();

    // Lightbox for editing course
    const [ showLightbox, setShowLightbox ] = useState(false);

    useEffect(() => {

        // Fetch course info using URL param
        async function loadCourse() {
            console.log(course_id)
            const response = await getCourse(course_id);
            console.log(response);
            setCourse(response);
        }

        loadCourse();

    }, [course_id]);

    return (
        <div className="content">
            <h1>{course.name}</h1>
            <p>Grade: {course.grade}</p>
            <h1>Assignments</h1>
            <button onClick={() => setShowLightbox(true)}>Edit Course</button>
            {showLightbox && <ModifyCourse close={() => setShowLightbox(false)} method="edit" setUser={setUser} />}
        </div>
    );

}