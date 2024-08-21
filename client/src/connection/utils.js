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

    if (response.status === 204) return;

    if (response.status === status) {
        callback();
    }

    if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message);
    }

    return await response.json();

}


/**
 * Calculate a course grade using assignment grades and weights.
 * 
 * @param {function():void} onUnauthorized - To call if the user is not logged in
 * @param {string} courseId 
 * @returns {Promise<Number|null>} - Null if there are no assignments with both a weight and grade.
 */
export const calculateGrade = async (onUnauthorized, courseId) => {

    // Get assignments
    const assignments = await getCourseAssignments(onUnauthorized, courseId);

    // Get assignments with both a grade and weight
    const hasGradeAndWeight = assignments.filter(assignment => Object.hasOwn(assignment, "grade") && Object.hasOwn(assignment, "weight"));

    if (hasGradeAndWeight.length === 0) return null;

    // Calculate course grade
    let totalWeight = 0;
    let totalEarned = 0;
    for (let i = 0; i < hasGradeAndWeight.length; i++) {
        totalWeight += hasGradeAndWeight[i].weight;
        totalEarned += hasGradeAndWeight[i].grade * hasGradeAndWeight[i].weight;
    }

    if (totalWeight === 0) return null;

    // Round to 2 decimal places
    return Math.round(totalEarned / totalWeight * 100) / 100;

}