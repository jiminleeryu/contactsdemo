import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, addDoc, deleteDoc, serverTimestamp, collection, query, orderBy, getDocs } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Contact } from '../components/Card/ContactContext';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app);

export const getContacts = async (): Promise<Contact[]> => {
  if (!auth.currentUser) throw new Error("User not authenticated");
  const uid = auth.currentUser.uid;
  
  const contactsCollectionRef = collection(db, `users/${uid}/contacts`);
  const q = query(contactsCollectionRef, orderBy('date'));
  const querySnapshot = await getDocs(q);
  const contacts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as Contact }));
  return contacts;
};

export const addContact = async (contact: Contact): Promise<void> => {
  if (!auth.currentUser) throw new Error("User not authenticated");
  const uid = auth.currentUser.uid;
  
  await addDoc(collection(db, `users/${uid}/contacts`), {
    ...contact,
    date: serverTimestamp()
  });
};

export const editContact = async (contact: Contact): Promise<void> => {
  if (!auth.currentUser || !contact.id) throw new Error("User not authenticated or contact ID missing");
  const uid = auth.currentUser.uid;

  await setDoc(doc(db, `users/${uid}/contacts`, contact.id), contact, { merge: true });
};

export const clearContact = async (contactId: string): Promise<void> => {
  if (!auth.currentUser) throw new Error("User not authenticated");
  const uid = auth.currentUser.uid;

  await deleteDoc(doc(db, `users/${uid}/contacts`, contactId));
};

export const uploadImage = async (file: File): Promise<string> => {
  const storage = getStorage(app);
  const storageRef = ref(storage, `images/${file.name}`);

  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  console.log('File available at', downloadURL);
  return downloadURL;
};

