import admin from 'firebase-admin';
import { logger } from '../utils/logger';

let firebaseApp: admin.app.App | null = null;

export const initializeFirebase = async (): Promise<void> => {
  try {
    if (firebaseApp) {
      logger.info('Firebase already initialized');
      return;
    }

    const serviceAccount = {
      type: 'service_account',
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI,
      token_uri: process.env.FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    };

    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID,
    });

    logger.info('Firebase Admin SDK initialized successfully');
  } catch (error) {
    logger.error('Firebase initialization failed:', error);
    throw error;
  }
};

export const getFirebaseApp = (): admin.app.App => {
  if (!firebaseApp) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return firebaseApp;
};

export const getAuth = (): admin.auth.Auth => {
  return getFirebaseApp().auth();
};

export const getFirestore = (): admin.firestore.Firestore => {
  return getFirebaseApp().firestore();
};

export const getStorage = (): admin.storage.Storage => {
  return getFirebaseApp().storage();
};

// Firebase Auth utilities
export const verifyIdToken = async (idToken: string): Promise<admin.auth.DecodedIdToken> => {
  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    logger.error('Token verification failed:', error);
    throw new Error('Invalid token');
  }
};

export const createCustomToken = async (uid: string, additionalClaims?: object): Promise<string> => {
  try {
    const customToken = await getAuth().createCustomToken(uid, additionalClaims);
    return customToken;
  } catch (error) {
    logger.error('Custom token creation failed:', error);
    throw new Error('Failed to create custom token');
  }
};

export const getUserByEmail = async (email: string): Promise<admin.auth.UserRecord> => {
  try {
    const userRecord = await getAuth().getUserByEmail(email);
    return userRecord;
  } catch (error) {
    logger.error('Get user by email failed:', error);
    throw new Error('User not found');
  }
};

export const createUser = async (userData: {
  email: string;
  password: string;
  displayName?: string;
  photoURL?: string;
}): Promise<admin.auth.UserRecord> => {
  try {
    const userRecord = await getAuth().createUser(userData);
    return userRecord;
  } catch (error) {
    logger.error('User creation failed:', error);
    throw new Error('Failed to create user');
  }
};

export const updateUser = async (uid: string, userData: admin.auth.UpdateRequest): Promise<admin.auth.UserRecord> => {
  try {
    const userRecord = await getAuth().updateUser(uid, userData);
    return userRecord;
  } catch (error) {
    logger.error('User update failed:', error);
    throw new Error('Failed to update user');
  }
};

export const deleteUser = async (uid: string): Promise<void> => {
  try {
    await getAuth().deleteUser(uid);
  } catch (error) {
    logger.error('User deletion failed:', error);
    throw new Error('Failed to delete user');
  }
};

// Firestore utilities
export const createDocument = async (collection: string, data: any, id?: string): Promise<string> => {
  try {
    const db = getFirestore();
    let docRef;
    
    if (id) {
      docRef = db.collection(collection).doc(id);
      await docRef.set(data);
      return id;
    } else {
      docRef = await db.collection(collection).add(data);
      return docRef.id;
    }
  } catch (error) {
    logger.error('Document creation failed:', error);
    throw new Error('Failed to create document');
  }
};

export const getDocument = async (collection: string, id: string): Promise<any> => {
  try {
    const db = getFirestore();
    const doc = await db.collection(collection).doc(id).get();
    
    if (!doc.exists) {
      return null;
    }
    
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    logger.error('Document retrieval failed:', error);
    throw new Error('Failed to get document');
  }
};

export const updateDocument = async (collection: string, id: string, data: any): Promise<void> => {
  try {
    const db = getFirestore();
    await db.collection(collection).doc(id).update(data);
  } catch (error) {
    logger.error('Document update failed:', error);
    throw new Error('Failed to update document');
  }
};

export const deleteDocument = async (collection: string, id: string): Promise<void> => {
  try {
    const db = getFirestore();
    await db.collection(collection).doc(id).delete();
  } catch (error) {
    logger.error('Document deletion failed:', error);
    throw new Error('Failed to delete document');
  }
};

export const queryDocuments = async (
  collection: string,
  filters?: Array<{ field: string; operator: FirebaseFirestore.WhereFilterOp; value: any }>,
  orderBy?: { field: string; direction: 'asc' | 'desc' },
  limit?: number
): Promise<any[]> => {
  try {
    const db = getFirestore();
    let query: FirebaseFirestore.Query = db.collection(collection);
    
    if (filters) {
      filters.forEach(filter => {
        query = query.where(filter.field, filter.operator, filter.value);
      });
    }
    
    if (orderBy) {
      query = query.orderBy(orderBy.field, orderBy.direction);
    }
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    logger.error('Document query failed:', error);
    throw new Error('Failed to query documents');
  }
};
