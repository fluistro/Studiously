// API requests for user authentication (login, signup, etc.)
const route = "http://localhost:5000/api/auth";


/**
 * @typedef AuthInfo - Information needed to authenticate a user
 * 
 * @property {string} username
 * @property {string} password - The plaintext password
 */

/**
 * @typedef User - Basic information about a user
 * 
 * @property {string} user_id - ObjectID from MongoDB
 * @property {string} username
 */


/**
 * Sign up a new user.
 * 
 * @param {AuthInfo} info - Newly created authentication info.
 * 
 * @returns {Promise<User>} - Username and id of the new user (if created successfully).
 */
export const signup = async user => {

    console.log(`Called signup with user ${user}`);

    try {

        const res = await fetch(`${route}/signup`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(user)
        });
    
        return await res.json();
        
    } catch (error) {
        console.log(`Error signing up: ${error}`);
        throw error;
    }

}


/**
 * Log in.
 * 
 * @param {AuthInfo} info - Authentication info for the user to be logged in.
 * 
 * @returns {Promise<User>} - If login successful, return username and id.
 */
export const login = async user => {

    console.log(`Called login with user ${user}`);

    try {

        const res = await fetch(`${route}/login`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(user)
        });
    
        return await res.json();
        
    } catch (error) {
        console.log(`Error logging in: ${error}`);
        throw error;
    }

}


/**
 * Log out the current user. Does not return a value.
 */
export const logout = async () => {

    console.log(`Called logout`);

    try {

        await fetch(`${route}/logout`, {
            method: "DELETE",
            credentials: 'include'
        });
        
    } catch (error) {
        console.log(`Error logging out: ${error}`);
        throw error;
    }

}


/**
 * Get information of the currently logged in user.
 * 
 * @returns {Promise<User|undefined>} - Username and user_id of the current user, or undefined if not logged in.
 */
export const getCurrentUser = async () => {

    console.log("called getCurrentUser");

    try {

        const res = await fetch(`${route}/`, {
            credentials: 'include'
        });
        const data = await res.json();
        if (data.user_id) return data;
        
    } catch (error) {
        console.log(`Error authenticating user: ${error}`);
        throw error;
    }
    
}