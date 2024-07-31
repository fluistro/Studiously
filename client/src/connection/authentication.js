// API requests for user authentication (login, signup, etc.)
const route = "http://localhost:5000/api/auth";

/**
 * Sign up a new user.
 * 
 * @param {Object} user - The user being signed up.
 * @param {string} user.username - The user's username.
 * @param {string} user.password - The user's plaintext password.
 * 
 * @returns {Promise<Object>} - Contains either an error field, or username and user_id fields.
 */
export const signup = async user => {

    console.log(`Called signup with user ${user}`)

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
    }

}


/**
 * Log in.
 * 
 * @param {Object} user - The user being logged in.
 * @param {string} user.username - The user's username.
 * @param {string} user.password - The user's plaintext password.
 * 
 * @returns {Promise<Object>} - Contains either an error field, or username and user_id fields.
 */
export const login = async user => {

    console.log(`Called login with user ${user}`)

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
    }

}


/**
 * Log out the current user. Does not return a value.
 */
export const logout = async () => {

    console.log(`Called logout`)

    try {

        await fetch(`${route}/logout`, {
            method: "DELETE",
            credentials: 'include'
        });
        
    } catch (error) {
        console.log(`Error logging out: ${error}`);
    }

}


/**
 * Get information of the currently logged in user.
 * 
 * @returns {Promise<Object|undefined>} - Username and user_id of the current user, or undefined if not logged in.
 */
export const getCurrentUser = async () => {

    console.log("called getCurrentUser")

    try {

        const res = await fetch(`${route}/`, {
            credentials: 'include'
        });
        const data = await res.json();
        if (data.user_id) return data;
        
    } catch (error) {
        console.log(`Error authenticating user: ${error}`);
    }
    
}