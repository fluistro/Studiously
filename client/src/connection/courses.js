// API requests for getting course information (once authenticated)
import { validateResponse, calculateGrade } from "./utils";

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
 * Get information about all courses for the current user.
 * 
 * @param {function():void} onUnauthorized - To call if the user is not logged in
 * 
 * @return {Promise<[Course]>} - A list of all the user's courses.
 */
export const getUserCourses = async onUnauthorized => {

    try {

        const response = await fetch(`${route}/`, {
            credentials: 'include'
        });

        const data = await validateResponse(response, 401, onUnauthorized);

        let courses = [];
        for (let i = 0; i < data.length; i++) {
            let course = data[i];
            course.grade = await calculateGrade(onUnauthorized, course._id);
            courses.push(course);
        }

        return courses;
        
    } catch (error) {
        console.log(`Error retrieving courses: ${error}`);
        throw error;
    }
}


/**
 * @param {string} courseId - The id of the requested course.
 * @param {function():void} onUnauthorized - To call if the user is not logged in
 * 
 * @return {Promise<Course>} - Information about the requested course.
 */
export const getCourse = async (courseId, onUnauthorized) => {

    try {

        const response = await fetch(`${route}/${courseId}`, {
            credentials: 'include'
        });

        const course = await validateResponse(response, 401, onUnauthorized);
        course.grade = await calculateGrade(onUnauthorized, course._id);
    
        return course;
        
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

        await validateResponse(response, 401, onUnauthorized);
        
    } catch (error) {
        console.log(`Error retrieving courses: ${error}`);
        throw error;
    }

}


/**
 * @param {string} courseId
 * 
 * @param {Object} courseInfo
 * @param {string} courseInfo.name
 * 
 * @param {function():void} onUnauthorized - To call if the user is not logged in
 * 
 * @returns {Promise<void>}
 */
export const editCourse = async (courseId, courseInfo, onUnauthorized) => {

    try {

        const response = await fetch(`${route}/${courseId}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(courseInfo)
        });

        await validateResponse(response, 401, onUnauthorized);
        
    } catch (error) {
        console.log(`Error retrieving courses: ${error}`);
        throw error;
    }

}


/**
 * @param {string} courseId
 * @param {function():void} onUnauthorized - To call if the user is not logged in
 * 
 * @returns {Promise<void>}
 */
export const deleteCourse = async (courseId, onUnauthorized) => {

    try {

        const response = await fetch(`${route}/${courseId}`, {
            method: "DELETE",
            credentials: 'include',
        });

        await validateResponse(response, 401, onUnauthorized);
        
    } catch (error) {
        console.log(`Error retrieving courses: ${error}`);
        throw error;
    }

}