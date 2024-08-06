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
 * @returns {Number|undefined} - Undefined if there are no assignments with both a weight and grade.
 */
const calculateGrade = async courseId => {

    // Get assignments
    let assignments = getCourseAssignments(courseId);
    if (assignments.error) throw new Error("Error calculating assignment grade"); // Error object

    // Get assignments with both a grade and weight
    assignments.filter(assignment => assignment.grade && assignment.weight);

    if (assignments.length === 0) return undefined;

    // Calculate course grade
    const totalWeight = 0;
    const totalEarned = 0;
    for (let i = 0; i < assignments.length; i++) {
        totalWeight += assignments[i].weight;
        totalEarned += assignments[i].grade;
    }

    if (totalWeight === 0) return undefined;
    return totalEarned / totalWeight * 100;

}


/**
 * Get information about all courses for the current user.
 * 
 * @return {Promise<[Course]>} - A list of all the user's courses.
 */
export const getUserCourses = async () => {

    console.log("Called getCourses");

    try {

        const res = await fetch(`${route}/`, {
            credentials: 'include'
        });
    
        const data = await res.json();
        data.forEach(element => {
            
        });
        data.gradeFromAssignments = calculateGrade(data.course_id);
        return data;
        
    } catch (error) {
        console.log(`Error retrieving courses: ${error}`);
        throw error;
    }
}


/**
 * @param {string} course_id - The id of the requested course.
 * 
 * @return {Promise<Course>} - Information about the requested course.
 */
export const getCourse = async (course_id) => {

    console.log(`called getCourse with id ${course_id}`);

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
 * @param {string} course_name
 * 
 * @returns {Promise<void>}
 */
export const createCourse = async course_name => {

    console.log(`Called createCourse with name ${course_name}`)

}


/**
 * Edit the course name
 * 
 * @param {string} course_id - Course to edit
 * @param {string} new_name - New name
 * 
 * @returns {Promise<void>}
 */
export const editCourse = async (course_id, new_name) => {

    console.log(`Called editCourse with id ${course_id} and name ${new_name}`)

}


/**
 * @param {string} course_id - ID of the course to delete
 * 
 * @returns {Promise<void>}
 */
export const deleteCourse = async course_id => {

    console.log(`Called deleteCourse with course_id ${course_id}`)

}