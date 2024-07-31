// API requests for getting course information (once authenticated)
const route = "http://localhost:5000/api/courses";

/**
 * @typedef Course 
 * 
 * @property {string} [_id] - Course ID, if the course is already in MongoDB
 * @property {string} name - The name of the course
 * @property {bool} manuallyEnterGrade - Whether the grade should be manually entered or calculated
 * @property {number} [grade] - Manually entered course grade, between 0 and 100
 * @property {number} [gradeFromAssignments] - Course grade calculated from assignments
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

    console.log("Called getCourses");

    try {

        const res = await fetch(`${route}/`, {
            credentials: 'include'
        });
    
        const data = await res.json();
        console.log(data);
        return data;
        
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

    console.log(`called getCourse with id ${course_id}`);

    try {

        console.log(course_id)

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

    console.log(`Called createCourse with body ${course}`)

}


/**
 * @param {Course} course - Must have _id field
 * 
 * @returns {Promise<void|Error>}
 */
export const editCourse = async course => {

    console.log(`Called editCourse with body ${course}`)

}


/**
 * @param {string} course_id - ID of the course to delete
 * 
 * @returns {Promise<void|Error>}
 */
export const deleteCourse = async course_id => {

    console.log(`Called deleteCourse with course_id ${course_id}`)

}