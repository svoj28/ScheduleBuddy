// signup.js

import { Client, Account, Databases } from 'appwrite';
import { appwriteConfig } from '../appwrite'; // assuming this is the file you provided

const client = new Client();
client.setEndpoint(appwriteConfig.endpoint).setProject(appwriteConfig.projectId);

const account = new Account(client);
const databases = new Databases(client);

// Sign up user with email and password
export const signUpUser = async (email, password, role, displayName, hobbies) => {
  try {
    // Ensure role, displayName, and hobbies are arrays
    const roleArray = Array.isArray(role) ? role : [role];
    const displayNameArray = Array.isArray(displayName) ? displayName : [displayName];
    const hobbiesArray = Array.isArray(hobbies) ? hobbies : [hobbies];

    // Create a new user in Appwrite's Authentication system
    const user = await account.create('unique()', email, password);

    // Save additional info in the database
    const response = await databases.createDocument(
      appwriteConfig.databaseId, // Database ID
      appwriteConfig.userCollectionId, // Collection ID for user data
      'unique()', // unique ID for the document
      {
        role: roleArray,         // Convert to array
        displayName: displayNameArray, // Convert to array
        hobbies: hobbiesArray    // Convert to array
      }
    );

    return { user, response };
  } catch (error) {
    console.error('Error during sign up:', error);
    throw error;
  }
};
