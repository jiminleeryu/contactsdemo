import React, { useState, useEffect, createContext } from 'react';
import '../styles/ContactPage.css';
import ContactCard from './Card/ContactCard';
import AddContact from './Card/AddContactCard';
import { Contact, useContacts } from './Card/ContactContext';
import { addContact, editContact, getContacts } from '../utils/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function ContactsPage() {
  const { contacts, setContacts} = useContacts();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [filterType, setFilterType] = useState('');
  const [filterAreaCode, setFilterAreaCode] = useState('');
  const [sortKey, setSortKey] = useState('dateAdded');

  const auth = getAuth(); 
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        const fetchContacts = async () => {
          try {
            const loadedContacts = await getContacts();
            setContacts(loadedContacts);
          } catch (error) {
            console.error('Error fetching contacts:', error);
          }
        };
        
        fetchContacts();
      } else {
        setContacts([]); 
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
      contacts.forEach(contact => {
        // If the contact has an id, it is set to edit contact
          if (contact.id) {
              editContact(contact);
          } else {
            // Otherwise, it is a new contact and is added to the context
              addContact(contact).then(docRef => {
                  // Update global state with new id from firestore
                  setContacts(currentContacts =>
                      currentContacts.map(c => 
                          c === contact ? { ...c, id: docRef.id } : c
                      )
                  );
              });
          }
      });
  }, [contacts]); // Processes changes in the global contacts array

  // Adds updated contacts to the previous list of contacts
  const handleSave = (updatedContact: Contact) => {
    setContacts((prevContacts: Contact[]) =>
      prevContacts.map(contact =>
        contact.id === updatedContact.id
          ? { ...contact, contact: updatedContact }
          : contact
      )
    );
  };

  // Adds a new contact to the global context
  const handleSaveNewContact = (newContact: Contact) => {
    const newContactCard = {
      ...newContact,
      onSave: handleSave, 
      onDelete: handleDelete 
    };
      setContacts(prevContacts => [...prevContacts, newContactCard]);
  };

  const handleDelete = (contactId: string) => {
    setContacts(prevContacts => 
      prevContacts.filter(contactProps => contactProps.id !== contactId)
    );
  };

  const openModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
  }

  const applyFilters = () => {
    return contacts.filter(contact => {
      const typeMatch = filterType ? contact.types.includes(filterType) : true;
      const areaCodeMatch = filterAreaCode ? contact.phone.startsWith(filterAreaCode) : true;
      return typeMatch && areaCodeMatch;
    });
  };
  
  // Sort function for sorting by date added and alphabetical
  const sortContacts = (contacts: Contact[], sortBy: string) => {
    switch (sortBy) {
      case 'dateAdded':
        return [...contacts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case 'alphabetical':
        return [...contacts].sort((a, b) => a.name.localeCompare(b.name));
      default:
        return contacts;
    }
  };
  

  const displayedContacts = sortContacts(applyFilters(), sortKey);

  return (
    <div className='container'>
      <div className='filters'>
        <select onChange={e => setFilterType(e.target.value)}>
          <option value="">All Types</option>
          <option value="Business">Business</option>
          <option value="Personal">Personal</option>
          <option value="School">School</option>
        </select>
        </div>

        <div className='filters'>
        <select onChange={e => setSortKey(e.target.value)}>
          <option value="dateAdded">Date Added</option>
          <option value="alphabetical">Alphabetical</option>
        </select>
        </div>

        <input className="area-code-filter" type="text" placeholder="Filter by area code" onChange={e => setFilterAreaCode(e.target.value)} />

        <AddContact onSave={handleSaveNewContact} />

        {displayedContacts.map(contact => (
          <ContactCard
            key={contact.id}
            contact={contact}
          />
        ))} 
      </div>
  );
}

export default ContactsPage;
