// login.js

import { Client, Account } from "appwrite";
import { appwriteConfig } from "../appwrite"; // Ensure this path is correct

const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

const account = new Account(client);

const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export const login = async (email, password) => {
  try {
    if (!validateEmail(email)) {
      throw new Error("Invalid email format.");
    }

    const session = await account.createSession(email, password);
    return session;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    await account.deleteSession("current");
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    return await account.get();
  } catch (error) {
    return null;
  }
};
