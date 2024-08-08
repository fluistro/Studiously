import { getCourseAssignments } from "./assignments";


/**
 * Boilerplate code for checking a response for errors. 
 * Throws an error if the status code is not 2XX. Runs a callback function on a specific status code.
 * 
 * @param {Response} response 
 * @param {Number} status
 * @param {function():void} callback 
 * 
 * @returns {Promise<any>} - The result of await response.json().
 */
export const validateResponse = async (response, status, callback) => {

    if (response.status === status) {
        callback();
    }

    if (!response.ok) {
        const { message } = await res.json();
        throw new Error(message);
    }

    return await response.json();

}


/**
 * Calculate a course grade using assignment grades and weights.
 * 
 * @param {string} courseId 
 * @returns {Promise<Number|null>} - Null if there are no assignments with both a weight and grade.
 */
export const calculateGrade = async courseId => {

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