// Get courses of current user
async function getCourses() {
    courses = await fetch(
        "http://localhost:5000/api/courses/", 
        {
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
    })
    .then(res => res.json());
    return courses;
}

// Get the grade of a course
// Return number or undefined
async function getGrade(course) {
    if (course.manuallyEnterGrade) return course.grade;
    return undefined; // Change to calculate grade from assignments later
}