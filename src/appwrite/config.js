import { Client,Databases,Account,ID } from 'appwrite';
const client = new Client();
client.setEndpoint("https://fra.cloud.appwrite.io/v1").setProject(import.meta.env.VITE_PROJECT_ID)

const databases = new Databases(client);
const account = new Account(client);


export { client, databases, account,ID };