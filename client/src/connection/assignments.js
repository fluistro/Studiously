import { validateResponse } from "./utils";

// API requests to /assignments endpoint
const route = "http://localhost:5000/api/assignments";


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
 * @param {function():void} onUnauthorized - To call if the user is not logged in
 * 
 * @returns {Promise<[Assignment]>}
 */
export const getAssignments = async onUnauthorized => {

    try {

        const response = await fetch(`${route}/`, {
            credentials: "include"
        });

        return await validateResponse(response, 401, onUnauthorized);
        
    } catch (error) {
        console.log(`Error from getAssignments: ${error}`);
        throw error;
    }

}


/**
 * Retrieve all assignments for a given course.
 * 
 * @param {string} courseId 
 * @param {function():void} onUnauthorized - To call if the user is not logged in
 * 
 * @returns {Promise<[Assignment]>}
 */
export const getCourseAssignments = async (onUnauthorized, courseId) => {

    

    try {

        const response = await fetch(`${route}/${courseId}`, {
            credentials: "include"
        });

        return await validateResponse(response, 401, onUnauthorized);
        
    } catch (error) {
        console.log(`Error from getCourseAssignments: ${error}`);
        throw error;
    }

} 


/**
 * 
 * @param {string} courseId - ID of the course that this assignment belongs to
 * @param {function():void} onUnauthorized - To call if the user is not logged in
 * 
 * @param {Object} assignmentInfo 
 * @param {string} assignmentInfo.name - Name of the new assignment
 * @param {Date} assignmentInfo.dueDate - Due date
 * @param {number} [assignmentInfo.weight]
 * @param {number} [assignmentInfo.grade]
 * 
 * @returns {Promise<void>}
 */
export const createAssignment = async (courseId, assignmentInfo, onUnauthorized) => {

    try {

        const response = await fetch(`${route}/${courseId}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify(assignmentInfo),
        });

        await validateResponse(response, 401, onUnauthorized);
        
    } catch (error) {
        console.log(`Error creating assignment: ${error}`);
        throw error;
    }

}


/**
 * @param {string} courseId
 * @param {string} assignmentId
 * @param {function():void} onUnauthorized - To call if the user is not logged in
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
export const editAssignment = async (courseId, assignmentId, assignmentInfo, onUnauthorized) => {

    try {

        const response = await fetch(`${route}/${courseId}/${assignmentId}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify(assignmentInfo),
        });

        await validateResponse(response, 401, onUnauthorized);
        
    } catch (error) {
        console.log(`Error editing assignment: ${error}`);
        throw error;
    }

}


/**
 * @param {string} assignmentId
 * @param {function():void} onUnauthorized - To call if the user is not logged in
 * 
 * @returns {Promise<void>}
 */
export const deleteAssignment = async (courseId, assignmentId, onUnauthorized) => {

    try {

        const response = await fetch(`${route}/${courseId}/${assignmentId}`, {
            method: "DELETE",
            credentials: "include",
        });

        await validateResponse(response, 401, onUnauthorized);
        
    } catch (error) {
        console.log(`Error deleting assignment: ${error}`);
        throw error;
    }

}