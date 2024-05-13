import { useState } from 'react';
import ContactsPage from '../components/ContactPage';
import  ContactsContext  from './Card/ContactContext';
import { ContactCardProps } from './Card/CardProps';

function ParentComponent() {
  const [contacts, setContacts] = useState<ContactCardProps[]>([]);

  return (
    <div>
      <ContactsContext.Provider value={{ contacts, setContacts}}> 
        <ContactsPage /> 
      </ContactsContext.Provider>
    </div>
  );
}

export default ParentComponent;
