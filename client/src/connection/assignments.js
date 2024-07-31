

/**
 * @typedef Assignment 
 * 
 * @property {string} [_id] - Assignment id, if the assignment is already in MongoDB
 * @property {string} name - The name of the assignment
 * @property {number} [weight] - Weight of assignment, between 0 and 100
 * @property {number} [grade] - Assignment grade, between 0 and 100
 * @property {Date} [due_date] - Due date
 */

/**
 * @typedef Error
 * 
 * @property {string} error - The error message
 */


/**
 * Retrieve all assignments for a given course.
 * 
 * @param {string} course_id 
 * @returns {Promise<[Assignment]|Error>}
 */
export const getAssignmentFromCourse = async course_id => {

    return [
        {
            _id: 0,
            name: "A1",
            weight: 15,
        },
        {
            _id: 0,
            name: "A2",
            weight: 10,
        },
    ]

} 