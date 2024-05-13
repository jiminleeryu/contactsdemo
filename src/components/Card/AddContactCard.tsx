import React, { useState, useContext, useEffect } from 'react';
import Modal from 'react-modal';
import '../../styles/Card/AddContactCard.css';
import { Contact, useContacts } from './ContactContext';

interface AddContactProps {
    onSave: (contact: Contact) => void;
}

const AddContactCard : React.FC<AddContactProps> = ({}) =>{
    const { contacts, setContacts } = useContacts(); // Context
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const initialContactState = {
      name: '',
      address: '',
      phoneNumber: '',
      phone: '',
      imageUrl: '',
      date: new Date(),
      types: []
  };

    const handleOpenModal = () => {setIsModalOpen(true)
        console.log('modal opened')
    }
    const handleCloseModal = () => {setIsModalOpen(false)}

    const [newContact, setNewContact] = useState(initialContactState);

    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setNewContact(prev => ({
          ...prev,
          [name]: value
      }));
    };

    const handleSaveContact = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);  // Set the submitting state to true to prevent multiple submissions

        const newId = Date.now().toString();  // Generate a new id for the new contact
        const contactWithId = {
            ...newContact,
            id: newId,
            types: selectedTypes,
            date: new Date()  // Set the current date as the contact's date
        };

        setContacts(prevContacts => [...prevContacts, contactWithId]); 

        setIsSubmitting(false); 
        handleCloseAndReset();
    };

    // Toggle functionality for buttons
    const toggleType = (type: string, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault(); 
      setSelectedTypes(prev => {
          const currentIndex = prev.indexOf(type);
          const newSelectedTypes = [...prev];

          if (currentIndex === -1) { //If currentIndex is -1, it means the type is not currently in the array, so it adds type to newSelectedTypes.
              newSelectedTypes.push(type); 
          } else {
              newSelectedTypes.splice(currentIndex, 1); // If currentIndex is not -1, then it's already in the array, and is thus removed
          }
          return newSelectedTypes;
      }); 
    };

    const handleCloseAndReset = () => {
        setIsModalOpen(false);
        setNewContact(initialContactState); 
        setSelectedTypes([]);  
  };

    return ( 
        <div>
            <div className="add-contact-card" onClick={() => handleOpenModal()}></div>

            <Modal isOpen={isModalOpen} onRequestClose={handleCloseModal} contentLabel="Add New Contact"
                style={{ overlay: { backgroundColor: 'rgba(0, 0, 0, 0.75)' },
                            content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', width: '40%', height: '80%', border: '1px solid #ccc', borderRadius: '10px', padding: '20px' }
                }}>
                <form onSubmit={handleSaveContact}>
                <div className={'contact-add-content'}>
                    <input type="text" name="name" placeholder="Name" value={newContact.name} onChange={handleInputChange} />
                    <input type="text" name="address" placeholder="Address" value={newContact.address} onChange={handleInputChange} />
                    <input type="text" name="phoneNumber" placeholder="Phone Number" value={newContact.phoneNumber} onChange={handleInputChange} />
                    <input type="text" name="imageUrl" placeholder="Image URL" value={newContact.imageUrl} onChange={handleInputChange} />

                    {/* Buttons to select contact type */}
                    <div className={'select-buttons'}>
                    {['Business', 'Personal', 'School'].map(type => (
                        <button 
                            key={type}
                            onClick={(e) => toggleType(type, e)}
                            style={{
                                backgroundColor: selectedTypes.includes(type) ? 'lightblue' : 'white',
                                margin: '5px',
                                border: '2px solid #000000',
                                borderRadius: '8px'
                            }}>
                            {type}
                        </button>
                    ))}
                    </div>
                    <button type="submit" disabled={isSubmitting}>Save Contact</button>
                    <button type="button" onClick={handleCloseAndReset}>Cancel</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default AddContactCard;