import axios from 'axios';


// --- Configuration Constants ---
const BASE_URL = 'http://localhost:8080/api/v1'; // Your API base URL

// Login credentials
const LOGIN_EMAIL = '2016mehrab@gmail.com';
const LOGIN_PASSWORD = 'adminpass';

// Fixed IDs for new posts
const CATEGORY_ID = 'c14dbcd2-5fef-470a-b2e2-e1f332315276';
const TAG_ID = 'ed1b465f-5d3a-4e5d-ba82-249b8d101e34'; // Assuming it's an array for tagIds, so it will be [TAG_ID]

// Number of posts to create (MODIFY THIS VALUE)
const NUM_POSTS_TO_CREATE = 15;

// --- Helper Function for Random Strings ---
/**
 * Generates a random alphanumeric string of a given length.
 * @param {number} length The desired length of the string.
 * @returns {string} A random string.
 */
function generateRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

// --- Main Script Logic ---
async function createBlogPosts() {
    let accessToken = null;

    console.log('--- Starting Post Creation Script ---');

    // 1. Login to get the Access Token
    console.log('Attempting to log in...');
    try {
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
            email: LOGIN_EMAIL,
            password: LOGIN_PASSWORD
        });

        accessToken = loginResponse.data.accessToken;
        if (accessToken) {
            console.log('Login successful! Access Token obtained.');
            // console.log('Access Token:', accessToken); // Uncomment for debugging token
        } else {
            console.error('Login failed: Access token not found in response.');
            return; // Exit if login fails
        }
    } catch (error) {
        console.error('Error during login:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }
        return; // Exit if login fails
    }

    // 2. Create Blog Posts using the Access Token
    console.log(`Attempting to create ${NUM_POSTS_TO_CREATE} blog posts...`);
    for (let i = 0; i < NUM_POSTS_TO_CREATE; i++) {
        const randomTitle = `Random Post Title ${generateRandomString(10)}`;
        const randomContent = `This is the content for random post number ${i + 1}. It includes some generated text: ${generateRandomString(150)}.`;

        const postData = {
            title: randomTitle,
            content: randomContent,
            categoryId: CATEGORY_ID,
            tagIds: [TAG_ID], // Ensure tagIds is an array
            status: "DRAFT"
        };

        try {
            console.log(`Creating post ${i + 1}/${NUM_POSTS_TO_CREATE}...`);
            const createPostResponse = await axios.post(`${BASE_URL}/posts`, postData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}` // Attach the access token
                }
            });
            console.log(`Post ${i + 1} created successfully! ID: ${createPostResponse.data.id}`);
        } catch (error) {
            console.error(`Error creating post ${i + 1}:`, error.message);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
            }
            // Continue to next post even if one fails
        }

        // Optional: Add a small delay between requests to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 200)); // 200ms delay
    }

    console.log('--- Post Creation Script Finished ---');
}

// Execute the main function
createBlogPosts();
