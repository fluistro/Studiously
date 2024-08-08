// API requests for getting course information (once authenticated)
import { getCourseAssignments } from "./assignments";

const route = "http://localhost:5000/api/courses";

/**
 * @typedef Course 
 * 
 * @property {string} _id - ObjectID from MongoDB
 * @property {string} name - The name of the course
 * @property {Date} dateCreated
 * @property {number|null} grade - Grade calculated from assignments
 * @property {[string]} assignments - List of assignment ids
 */


/**
 * Calculate the course grade using assignment grades and weights.
 * 
 * @param {string} courseId 
 * @returns {Promise<Number|null>} - Undefined if there are no assignments with both a weight and grade.
 */
const calculateGrade = async courseId => {

    // Get assignments
    let assignments = getCourseAssignments(courseId);

    // Get assignments with both a grade and weight
    assignments.filter(assignment => typeof assignment.grade !== "undefined" && assignment.weight);

    if (assignments.length === 0) return null;

    // Calculate course grade
    const totalWeight = 0;
    const totalEarned = 0;
    for (let i = 0; i < assignments.length; i++) {
        totalWeight += assignments[i].weight;
        totalEarned += assignments[i].grade;
    }

    if (totalWeight === 0) return null;
    return totalEarned / totalWeight * 100;

}


/**
 * Get information about all courses for the current user.
 * 
 * @param {function():void} onUnauthorized - To call if the user is not logged in
 * 
 * @return {Promise<[Course]>} - A list of all the user's courses.
 */
export const getUserCourses = async onUnauthorized => {

    console.log("Called getCourses");

    try {

        const response = await fetch(`${route}/`, {
            credentials: 'include'
        });

        if (!response.ok) {

            if (response.status === 401) {
                onUnauthorized();
            }

            const { message } = await res.json();
            throw new Error(message);
        }
    
        const data = await response.json();

        let courses = [];
        for (let i = 0; i < data.length; i++) {
            let course = data[i];
            course.grade = await calculateGrade(course._id);
            courses.push(course);
        }

        return courses;
        
    } catch (error) {
        console.log(`Error retrieving courses: ${error}`);
        throw error;
    }
}


/**
 * @param {string} course_id - The id of the requested course.
 * @param {function():void} onUnauthorized - To call if the user is not logged in
 * 
 * @return {Promise<Course>} - Information about the requested course.
 */
export const getCourse = async (course_id, onUnauthorized) => {

    console.log(`called getCourse with id ${course_id}`);

    try {

        const response = await fetch(`${route}/${course_id}`, {
            credentials: 'include'
        });

        if (!response.ok) {

            if (response.status === 401) {
                onUnauthorized();
            }

            const { message } = await response.json();
            throw new Error(message);
        }

        const data = await response.json();
        data.grade = await calculateGrade(data._id);
    
        return data;
        
    } catch (error) {
        console.log(`Error retrieving courses: ${error}`);
        throw error;
    }
}


/**
 * @param {Object} courseInfo
 * @param {string} courseInfo.name
 * 
 * @param {function():void} onUnauthorized - To call if the user is not logged in
 * 
 * @returns {Promise<void>}
 */
export const createCourse = async (courseInfo, onUnauthorized) => {

    try {

        const response = await fetch(`${route}/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(courseInfo)
        });

        if (!response.ok) {

            if (response.status === 401) {
                onUnauthorized();
            }

            const { message } = await response.json();
            throw new Error(message);
        }
        
    } catch (error) {
        console.log(`Error retrieving courses: ${error}`);
        throw error;
    }

}


/**
 * @param {string} course_id
 * 
 * @param {Object} courseInfo
 * @param {string} courseInfo.name
 * 
 * @param {function():void} onUnauthorized - To call if the user is not logged in
 * 
 * @returns {Promise<void>}
 */
export const editCourse = async (course_id, courseInfo, onUnauthorized) => {

    try {

        const response = await fetch(`${route}/${course_id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(courseInfo)
        });

        if (!response.ok) {

            if (response.status === 401) {
                onUnauthorized();
            }

            const { message } = await response.json();
            throw new Error(message);
        }
        
    } catch (error) {
        console.log(`Error retrieving courses: ${error}`);
        throw error;
    }

}


/**
 * @param {string} course_id
 * @param {function():void} onUnauthorized - To call if the user is not logged in
 * 
 * @returns {Promise<void>}
 */
export const deleteCourse = async (course_id, onUnauthorized) => {

    try {

        const response = await fetch(`${route}/${course_id}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(courseInfo)
        });

        if (!response.ok) {

            if (response.status === 401) {
                onUnauthorized();
            }

            const { message } = await response.json();
            throw new Error(message);
        }
        
    } catch (error) {
        console.log(`Error retrieving courses: ${error}`);
        throw error;
    }

}