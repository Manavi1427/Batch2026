import { databases, ID, isAppwriteConfigured, Query } from '../lib/appwrite'

const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID
const collectionId = import.meta.env.VITE_APPWRITE_MEMORIES_COLLECTION_ID

function assertAppwriteConfig() {
  if (!isAppwriteConfigured || !databaseId || !collectionId) {
    throw new Error('Appwrite database configuration is missing. Please check your .env file.')
  }
}

export async function fetchMemories() {
  assertAppwriteConfig()

  const response = await databases.listDocuments(databaseId, collectionId, [
    Query.orderDesc('createdAt'),
    Query.limit(100),
  ])

  return response.documents
}

export async function createMemory({ senderName, message }) {
  assertAppwriteConfig()

  const trimmedMemory = {
    senderName: senderName.trim(),
    message: message.trim(),
    createdAt: new Date().toISOString(),
  }

  return databases.createDocument(databaseId, collectionId, ID.unique(), trimmedMemory)
}
