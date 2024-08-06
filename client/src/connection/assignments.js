

/**
 * @typedef Assignment 
 * 
 * @property {string} _id - Assignment id, if the assignment is already in MongoDB
 * @property {string} name - The name of the assignment
 * @property {Date} dueDate
 * @property {Date} dateCreated
 * @property {boolean} isCompleted
 * 
 * @property {number} [weight] - Weight of assignment, between 0 and 100
 * @property {number} [grade] - Assignment grade, between 0 and 100
 */


/**
 * Retrieve all assignments for the current user.
 * 
 * @returns {Promise<[Assignment]>}
 */
export const getAssignments = async () => {

}


/**
 * Retrieve all assignments for a given course.
 * 
 * @param {string} courseId 
 * 
 * @returns {Promise<[Assignment]>}
 */
export const getCourseAssignments = async courseId => {

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


/**
 * 
 * @param {string} courseId - ID of the course that this assignment belongs to
 * 
 * @param {Object} assignmentInfo 
 * @param {string} assignmentInfo.name - Name of the new assignment
 * @param {Date} assignmentInfo.dueDate - Due date
 * @param {number} [assignmentInfo.weight]
 * @param {number} [assignmentInfo.grade]
 * 
 * @returns {Promise<void>}
 */
export const createAssignment = async (courseId, assignmentInfo) => {

}


/**
 * @param {string} assignmentId
 * 
 * @param {Object} assignmentInfo 
 * @param {string} assignmentInfo.name
 * @param {Date} assignmentInfo.dueDate
 * @param {boolean} assignmentInfo.isCompleted
 * @param {number} [assignmentInfo.weight]
 * @param {number} [assignmentInfo.grade]
 * 
 * @returns {Promise<void>}
 */
export const editAssignment = async (assignmentId, assignmentInfo) => {

}


/**
 * 
 * @param {string} assignmentId - ID of the assignment to delete
 * 
 * @returns {Promise<void>}
 */
export const deleteAssignment = async assignmentId => {

}