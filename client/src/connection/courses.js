// API requests for getting course information (once authenticated)

/**
 * @typedef Course 
 * 
 * @property {string} name - The name of the course
 * @property {bool} manuallyEnterGrade - Whether the grade should be manually entered or calculated
 * @property {number} [grade] - Course grade, between 0 and 1
 * @property {[string]} assignments - List of assignment ids
 */


/**
 * @param {string} user_id 
 * 
 * @return {Promise<[Course]>}
 */
export const getCourses = async user_id => {
    return [];
}