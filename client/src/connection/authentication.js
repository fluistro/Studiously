// API requests for user authentication (login, signup, etc.)
const route = `https://studiously.onrender.com/api/auth`;


/**
 * @typedef AuthInfo - Information needed to authenticate a user
 * 
 * @property {string} username
 * @property {string} password - The plaintext password
 */

/**
 * @typedef User - Basic information about a user
 * 
 * @property {string} userId - ObjectID from MongoDB
 * @property {string} username
 */


/**
 * Sign up a new user.
 * 
 * @param {AuthInfo} user - Newly created authentication info.
 * 
 * @returns {Promise<User>} - Username and id of the new user (if created successfully).
 */
export const signup = async user => {

    try {

        const response = await fetch(`${route}/signup`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(user)
        });

        if (!response.ok) {
            const { message } = await response.json();
            throw new Error(message);
        }
    
        return await response.json();
        
    } catch (error) {
        console.log(`Error signing up: ${error}`);
        throw error; // Propogate error forward
    }

}


/**
 * Log in.
 * 
 * @param {AuthInfo} user - Authentication info for the user to be logged in.
 * @param {function():void} onSessionExists - Callback to run if a user session already exists.
 * 
 * @returns {Promise<User>} - If login successful, return username and id.
 */
export const login = async (user) => {

    try {

        const response = await fetch(`${route}/login`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(user)
        });

        if (!response.ok) {

            const { message } = await response.json();
            throw new Error(message);

        }
    
        const data = await response.json();
        localStorage.setItem('token', data.token);
        return {userId: data.userId, username: data.username};
        
    } catch (error) {
        console.log(`Error logging in: ${error}`);
        throw error; // Propogate error forward
    }

}


/**
 * Log out the current user. Does not return a value.
 */
export const logout = async () => {

    try {

        localStorage.removeItem('token');
        
    } catch (error) {
        console.log(`Error logging out: ${error}`);
        throw error; // Propogate error forward
    }

}


/**
 * Get information of the currently logged in user.
 * 
 * @returns {Promise<User|undefined>} - Username and user_id of the current user, or undefined if not logged in.
 */
export const getCurrentUser = async () => {

    try {

        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch(`${route}/`, {
            headers: {
                authorization: `Bearer ${token}`
            },
            credentials: 'include'
        });
        
        if (!response.ok) {
            const { message } = await response.json();
            throw new Error(message);
        }

        // Return user information if it is present in the response object
        if (response.status === 200) {
            return await response.json();
        }
        
    } catch (error) {
        console.log(`Error authenticating user: ${error}`);
        throw error; // Propogate error forward
    }
    
}