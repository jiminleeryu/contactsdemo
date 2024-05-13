import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, addDoc, deleteDoc, serverTimestamp, collection, query, orderBy, getDocs } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Contact } from '../components/Card/ContactContext';

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const getContacts = async (): Promise<Contact[]> => {
  const contactsCollectionRef = collection(db, 'contacts');
  const q = query(contactsCollectionRef, orderBy('date')); 
  const querySnapshot = await getDocs(q);
  const contacts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as Contact }));
  return contacts;
};

export const addContact = async (contact: Contact): Promise<void> => {
  await addDoc(collection(db, 'contacts'), {
    ...contact,
    date: serverTimestamp() // Use serverTimestamp for Firebase
  });
};

export const editContact = async (contact: Contact): Promise<void> => {
  if (!contact.id) throw new Error("Contact must have an ID for update operations");
  await setDoc(doc(db, 'contacts', contact.id), contact, { merge: true });
};

export const clearContact = async (contactId: string): Promise<void> => {
  await deleteDoc(doc(db, 'contacts', contactId));
};

export const uploadImage = async (file: File): Promise<string> => {
  const storage = getStorage(app);
  const storageRef = ref(storage, `images/${file.name}`);

  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  console.log('File available at', downloadURL);
  return downloadURL;
};

