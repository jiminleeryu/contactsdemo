import { Dispatch, SetStateAction, createContext, useContext } from 'react';

export interface Contact {
    id: string;
    name: string;
    types: string[];
    address: string;
    phone: string;
    imageUrl: string;
    date: Date;
  }

interface ContactsContext {
  contacts: Contact[];
  setContacts: Dispatch<SetStateAction<Contact[]>>;
}

const ContactsContext = createContext<ContactsContext | undefined>(undefined);

export function useContacts(): ContactsContext {
  const context = useContext(ContactsContext);
  if (!context) {
    throw new Error('useContacts must be used within a ContactsProvider');
  }

  return context;
}

export default ContactsContext; 
