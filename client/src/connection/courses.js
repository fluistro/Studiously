// API requests for getting course information (once authenticated)
const route = "http://localhost:5000/api/courses";

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
 * @return {Promise<[Course]>} - A list of all the user's courses
 */
export const getCourses = async user_id => {

    try {

        const res = await fetch(`${route}/`, {
            credentials: 'include'
        });
    
        return await res.json();
        
    } catch (error) {
        console.log(`Error retrieving courses: ${error}`);
    }
}