// API requests for getting course information (once authenticated)
const route = "http://localhost:5000/api/courses";

/**
 * @typedef Course 
 * 
 * @property {string} [_id] - Course ID, if the course is already in MongoDB
 * @property {string} name - The name of the course
 * @property {bool} manuallyEnterGrade - Whether the grade should be manually entered or calculated
 * @property {number} [grade] - Course grade, between 0 and 100
 * @property {[string]} assignments - List of assignment ids
 */

/**
 * @typedef Error
 * 
 * @property {string} error - The error message
 */


/**
 * @return {Promise<[Course]|Error>} - A list of all the user's courses, or an object with an error field
 */
export const getCourses = async () => {
    try {

        const res = await fetch(`${route}/`, {
            credentials: 'include'
        });
    
        return await res.json();
        
    } catch (error) {
        console.log(`Error retrieving courses: ${error}`);
    }
}


/**
 * @param {string} course_id - The id of the requested course
 * 
 * @return {Promise<Course|Error>} - The requested course, or an object with an error field
 */
export const getCourse = async (course_id) => {
    try {

        const res = await fetch(`${route}/${course_id}`, {
            credentials: 'include'
        });
    
        return await res.json();
        
    } catch (error) {
        console.log(`Error retrieving courses: ${error}`);
    }
}


/**
 * @param {Course} course 
 * 
 * @returns {Promise<void|Error>}
 */
export const createCourse = async course => {

}


/**
 * @param {Course} course - Must have _id field
 * 
 * @returns {Promise<void|Error>}
 */
export const editCourse = async course => {

}


/**
 * @param {string} course_id - ID of the course to delete
 * 
 * @returns {Promise<void|Error>}
 */
export const deleteCourse = async course_id => {

}