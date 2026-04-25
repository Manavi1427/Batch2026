import { Client, Account, Databases, Storage, ID, Query } from 'appwrite'

const client = new Client()
const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID

if (endpoint && projectId) {
  client.setEndpoint(endpoint).setProject(projectId)
}

export const isAppwriteConfigured = Boolean(endpoint && projectId)

export const account = new Account(client)
export const databases = new Databases(client)
export const storage = new Storage(client)
export { client, ID, Query }
