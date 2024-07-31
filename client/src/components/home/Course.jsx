import React, { useState, useEffect } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { getCourse, deleteCourse } from "../../connection/courses";
import ModifyCourse from "./ModifyCourses";
import ListBlock from "./ListBlock";

// Given a list of assignment information, return JSX representing that information
function listToJSX(assignments) {

    if (!assignments) return <p>No assignments have been created</p>;

    return assignments.map((assignment, index) => {
        return (
            <ListBlock 
                key={index} 
                left={assignment.name} />
        );
    });

}

export default function Course({ setUser }) {

    const navigate = useNavigate();

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

    async function handleDelete() {
        deleteCourse(course_id);
        navigate("/home/courses")
    }

    return (
        <div className="content">
            <h1>{course.name}</h1>
            <p>Grade: {course.grade}</p>
            <h1>Assignments</h1>
            <button onClick={() => setShowLightbox(true)}>Edit Course</button>
            <button onClick={handleDelete}>Delete course</button>
            {showLightbox && <ModifyCourse close={() => setShowLightbox(false)} method="edit" setUser={setUser} />}
        </div>
    );

}