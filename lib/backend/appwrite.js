import { Client, Account, ID, Databases, Query, Storage } from 'react-native-appwrite';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { v4 as uuidv4 } from 'uuid'


export const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.scheduler.voj',
    projectId: '67a2f1100016d6a0636b',
    databaseId: '67a2f2b5002cb3ce4de6',
    userCollectionId: '67a2f2e200268a16b617',
    tasksCollectionId: '67a2f31100017bc6c645',
    archiveCollectionId: '67aaf4fa000da019b7a7',
    bucketId: '67ac08130036eedbef34',
    APIKey: 'standard_f5d397cbcf32de9ab99ff5336e2d5d6522da9e32b6bc593ffe94266b1b03dfc130b8e71c33c508be1316cc5b73113f220738129f00256bebc09f98ac0d01572d0d6ea6b20284172673f12caddc2c62284b374dbd7ed315347011998b31a5caec76a49bfce406f0d501bc563ec486378a6d2a6295a3fad8c9ba7dc6f7a880cc21'
};

const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint) 
    .setProject(appwriteConfig.projectId) 
    .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
const databases = new Databases(client);
export const storage = new Storage(client);

export const createUser = async ({ email, password, role, displayName, hobbies }) => {
    try {
        const formattedRole = Array.isArray(role) ? role : [role];
        const formattedDisplayName = Array.isArray(displayName) ? displayName : [displayName];
        const formattedHobbies = Array.isArray(hobbies) ? hobbies : [hobbies];

        const newAccount = await account.create(
            ID.unique(),  
            email, 
            password   
        );

        if (!newAccount) {
            throw new Error('Failed to create account.');
        }

        const newUser = await databases.createDocument(
            appwriteConfig.databaseId, 
            appwriteConfig.userCollectionId, 
            ID.unique(), 
            { 
                accountId: newAccount.$id,
                email,
                role: formattedRole,      
                displayName: formattedDisplayName,
                hobbies: formattedHobbies  
            }
        );

        return newUser; 
    } catch (error) {
        console.error('Error in createUser:', error.message);
        throw new Error(`User creation failed: ${error.message}`);
    }
};

export function signIn(email, password) {
    return new Promise((resolve, reject) => {
        account.createEmailPasswordSession(email, password)
            .then(function(response) {
                resolve(response); 
            })
            .catch(function(error) {
                console.error("Sign-in failed:", error.message); 
                reject(new Error(`Sign-in failed: ${error.message}. Please check your credentials.`)); // Reject with the error message
            });
    });
}

export const logout = async () => {
    try {
        const sessions = await account.listSessions();
        
        if (sessions.sessions.length > 0) {
            await account.deleteSession('current');
            console.log('Logout successful');
            return { success: true, message: 'Logout successful' };
        } else {
            console.log('No active session to log out');
            return { success: false, message: 'No active session found' }; 
        }
    } catch (error) {
        console.error('Logout failed:', error.message);
        return { success: false, message: error.message };
    }
};

export const getCurrentUser = async () => {
    try {
        const user = await account.get();
        return user;
    } catch (error) {
        throw new Error('Failed to fetch current user');
    }
};

export const createTask = async ({ taskname, difficulty, taskdate, tasktime, repetition, description, category, user_id }) => {
    try {
        const difficultyMap = {
            Easy: 10,
            Medium: 20,
            Hard: 30,
        };
        
        const exp = difficultyMap[difficulty] || 0; // Default to 0 if difficulty is not found
        const currentUser = await account.get();
        if (!currentUser) {
            throw new Error('User is not authenticated');
        }
        const user_id = currentUser.$id; // Get the authenticated user's ID
        const taskData = {
            taskname,
            difficulty,
            taskdate,
            tasktime,
            repetition,
            description,
            category,
            status: "Pending", // Default status
            exp,
            user_id
        };

        const task = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.tasksCollectionId,
            ID.unique(),
            taskData // Send the full task data
        );

        return task;
    } catch (error) {
        console.error('Error creating task:', error.message);
        throw new Error(`Task creation failed: ${error.message}`);
    }
};

export const getTasks = async () => {
    try {
        const user = await getCurrentUser();
        if (!user) throw new Error("User not authenticated");

        const user_id = user.$id;

        const databases = new Databases(client);

        const tasks = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.tasksCollectionId,
            [
                Query.equal('user_id', user_id)
            ]
        );

        return tasks.documents;
    } catch (error) {
        console.error('Error fetching tasks:', error.message);
        throw new Error(`Fetching tasks failed: ${error.message}`);
    }
};

export const getTaskById = async (taskId) => {
    try {
        const task = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.tasksCollectionId,
            taskId
        );
        return task;
    } catch (error) {
        console.error('Error fetching task:', error.message);
        throw new Error(`Fetching task failed: ${error.message}`);
    }
};

export const updateTask = async (taskId, updates) => {
    try {
        const updatedTask = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.tasksCollectionId,
            taskId,
            updates
        );
        return updatedTask;
    } catch (error) {
        console.error('Error updating task:', error.message);
        throw new Error(`Task update failed: ${error.message}`);
    }
};

export const deleteTask = async (taskId) => {
    try {
        await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.tasksCollectionId,
            taskId
        );
        return { success: true, message: 'Task deleted successfully' };
    } catch (error) {
        console.error('Error deleting task:', error.message);
        throw new Error(`Task deletion failed: ${error.message}`);
    }
};

export const archiveTask = async (task) => {
    try {
        const archivedTask = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.archiveCollectionId,
            task.$id, 
            {
                taskname: task.taskname,
                difficulty: task.difficulty,
                taskdate: task.taskdate,
                tasktime: task.tasktime,
                description: task.description,
                category: task.category,
                status: "Archived",
                exp: task.exp,
                user_id: task.user_id,
            }
        );

        console.log("Task successfully archived:", archivedTask);
        return archivedTask;
    } catch (error) {
        console.error("Error archiving task:", error.message);
        throw new Error("Failed to archive task");
    }
};

export const getArchivedTasks = async (userId) => {
    try {
        const response = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.archiveCollectionId, [
                Query.equal("user_id", userId)
            ]
        );

        return response.documents;
    } catch (error) {
        console.error("Error fetching archived tasks:", error.message);
        throw new Error("Failed to load archived tasks");
    }
};

export const getTasksForWeek = async () => {
    try {
        const response = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.tasksCollectionId
        );

        const tasks = response.documents;

        const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

        const weeklyTasks = weekdays.reduce((acc, day) => {
            acc[day] = [];
            return acc;
        }, {});

        tasks.forEach((task) => {
            if (Array.isArray(task.repetition) && task.repetition.length > 0) {
                task.repetition.forEach((day) => {
                    if (weekdays.includes(day)) {
                        weeklyTasks[day].push(task);
                    }
                });
            }
        });

        return weeklyTasks;
    } catch (error) {
        console.error("Error fetching weekly tasks:", error.message);
        throw new Error("Failed to retrieve weekly tasks");
    }
};

export const getUserData = async () => {
    try {
        const user = await getCurrentUser();
        if (!user) throw new Error("User not authenticated");

        const user_id = user.$id;
        console.log("Authenticated user ID:", user_id);

        const databases = new Databases(client);

        let userData;
        try {
            userData = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.userCollectionId,
                [
                    Query.equal("accountId", user_id)
                ]
            );
            console.log("User data from Appwrite:", userData);

            if (userData.documents.length === 0) {
                console.warn("User document not found. Creating a new one...");

                userData = await databases.createDocument(
                    appwriteConfig.databaseId,
                    appwriteConfig.userCollectionId,
                    user_id,
                    {
                        displayName: [user.name || ""],
                        role: ["User"],
                        hobbies: [],
                        total_exp: 0,
                        accountId: user_id,
                    }
                );
                console.log("New user document created:", userData);
            } else {
                userData = userData.documents[0];
            }
        } catch (error) {
            console.error("Error fetching user data:", error.message);
            throw new Error("Fetching user data failed");
        }

        return {
            displayName: userData.displayName || ["Unknown"],
            role: userData.role || ["User"],
            hobbies: userData.hobbies || [],
            exp: userData.total_exp || 0,
            accountId: userData.accountId || user_id,
        };
    } catch (error) {
        console.error("Error fetching user data:", error.message);
        return null;
    }
};

export const updateUserProfile = async (displayName, role, hobbies, exp, avatarUrl) => {
    try {
        const user = await getCurrentUser();

        if (!user || !user.$id) {
            throw new Error('User not authenticated or invalid user data');
        }

        const userId = user.$id;

        if (!/^[a-zA-Z0-9_]{1,36}$/.test(userId)) {
            throw new Error('Invalid userId format');
        }

        const roleArray = Array.isArray(role) ? role : [role];
        const displayNameArray = Array.isArray(displayName) ? displayName : [displayName];

        const updateData = {
            displayName: displayNameArray,
            role: roleArray,
            hobbies: hobbies.split(',').map(hobby => hobby.trim()),
            total_exp: exp,
            AvatarUri: avatarUrl,
        };

        const databases = new Databases(client);

        const userDocuments = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [
                Query.equal('accountId', userId)
            ]
        );

        if (userDocuments.documents.length === 0) {
            throw new Error('User document not found');
        }

        const userDocumentId = userDocuments.documents[0].$id;

        const updatedUser = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            userDocumentId,
            updateData
        );

        console.log('User profile updated successfully:', updatedUser);
        return updatedUser;

    } catch (error) {
        console.error('Error updating user profile:', error.message);
        throw new Error('Failed to update user profile');
    }
};

/* export const uploadAvatarImage = async (imageUri) => {
    try {
      const formData = new FormData();
      
      // Generate a unique fileId manually
      const fileId = `avatar_${Date.now()}`;

      // Use the generated fileId in the mutation
      formData.append('operations', JSON.stringify({
        query: `
          mutation CreateFile($bucketId: String!, $fileId: String!, $file: Upload!) {
            storageCreateFile(bucketId: $bucketId, fileId: $fileId, file: $file) {
              id
              fileId
            }
          }
        `,
        variables: {
          bucketId: appwriteConfig.bucketId,
          fileId, // Pass the generated fileId
          file: null // Placeholder for file
        }
      }));
  
      // Map the file to the correct location in the multipart request
      formData.append('map', '{ "file": ["variables.file"] }');
  
      // Add the actual file
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'avatar.jpg',
      });
  
      // Make the request
      const response = await fetch(
        `${appwriteConfig.endpoint}/storage/buckets/${appwriteConfig.bucketId}/files`,
        {
          method: 'POST',
          headers: {
            'X-Appwrite-Project': appwriteConfig.projectId,
            'X-Appwrite-API-Key': appwriteConfig.APIKey,
            'Content-Type': 'multipart/form-data'
          },
          body: formData,
        }
      );
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(`HTTP error! status: ${response.status} - ${error.message}`);
      }
  
      const result = await response.json();
      console.log('Avatar uploaded successfully:', result);
      return result.storageCreateFile.id;
    } catch (error) {
      console.error('Error uploading avatar image:', error.message);
      return null;
    }
  }; */