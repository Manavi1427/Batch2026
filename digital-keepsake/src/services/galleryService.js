import { databases, ID, isAppwriteConfigured, Permission, Query, Role, storage } from '../lib/appwrite'

const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID
const collectionId = import.meta.env.VITE_APPWRITE_GALLERY_COLLECTION_ID || 'gallery'
const bucketId = import.meta.env.VITE_APPWRITE_GALLERY_BUCKET_ID || 'gallery'

function assertGalleryConfig() {
  if (!isAppwriteConfigured || !databaseId || !collectionId || !bucketId) {
    throw new Error('Appwrite gallery configuration is missing. Please check your environment variables.')
  }
}

export async function uploadImage(file) {
  assertGalleryConfig()

  let uploadedFile

  try {
    uploadedFile = await storage.createFile(bucketId, ID.unique(), file, [Permission.read(Role.any())])
  } catch (error) {
    const message = String(error?.message || '')
    const normalizedMessage = message.toLowerCase()

    if (isMissingCreatePermission(message)) {
      throw new Error(
        'Photo upload is blocked by Appwrite permissions. In your gallery storage bucket, add Create access for the role that should upload photos, such as Any or Users.',
      )
    }

    if (normalizedMessage.includes('bucket') && normalizedMessage.includes('not be found')) {
      throw new Error(
        `Gallery storage bucket was not found. Set VITE_APPWRITE_GALLERY_BUCKET_ID to your Appwrite bucket ID, not just the bucket name. Currently using "${bucketId}".`,
      )
    }

    throw error
  }

  const fileView = storage.getFileView(bucketId, uploadedFile.$id)

  return {
    fileId: uploadedFile.$id,
    imageUrl: fileView.toString(),
  }
}

export async function createGalleryEntry({ senderName, senderEmail, imageUrl, note }) {
  assertGalleryConfig()

  const entry = {
    senderName: senderName.trim(),
    senderEmail: senderEmail.trim().toLowerCase(),
    imageUrl,
    note: note.trim(),
    createdAt: new Date().toISOString(),
  }

  try {
    return await databases.createDocument(databaseId, collectionId, ID.unique(), entry, [Permission.read(Role.any())])
  } catch (error) {
    if (isMissingCreatePermission(error?.message)) {
      throw new Error(
        'Photo details are blocked by Appwrite permissions. In your gallery collection, add Create access for the role that should add photos, such as Any or Users.',
      )
    }

    throw error
  }
}

export async function fetchGalleryImages() {
  assertGalleryConfig()

  let response

  try {
    response = await databases.listDocuments(databaseId, collectionId, [Query.orderDesc('createdAt'), Query.limit(100)])
  } catch (error) {
    const message = String(error?.message || '')

    if (!message.includes('createdAt')) {
      throw error
    }

    response = await databases.listDocuments(databaseId, collectionId, [Query.orderDesc('$createdAt'), Query.limit(100)])
  }

  return response.documents
}

function isMissingCreatePermission(message) {
  return String(message || '')
    .toLowerCase()
    .includes("no permissions provided for action 'create'")
}
