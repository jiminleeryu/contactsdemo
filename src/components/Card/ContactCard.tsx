import React, { useContext, useState } from 'react';
import Modal from 'react-modal';
import '../../styles/Card/ContactCard.css';
import '../../styles/Card/EditContact.css';
import defaultImage from '../../images/default_pfp.png';
import { Contact } from './CardProps';
import ContactsContext from './ContactContext';
import { clearContact } from '../../utils/firestore';

const ContactCard: React.FC<Contact> = ({ contact}) => {
  const { setContacts } = useContext(ContactsContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedContact, setEditedContact] = useState<Contact>(contact ? contact : {
    id: '',
    name: '',
    types: [],
    address: '',
    phone: '',
    imageUrl: '',
    date: new Date(),
});
  const [selectedTypes, setSelectedTypes] = useState<string[]>(contact.types || []);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setEditedContact({ ...editedContact, [name]: value });
  };

  const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // onSave({...editedContact, types: selectedTypes});
    setContacts((current: Contact[]) => current.map(c => c.id === editedContact.id ? {...c, ...editedContact, types: selectedTypes} : c));
    handleCloseModal();
  };

  const handleCancel = () => {
    setEditedContact(contact); 
    setSelectedTypes(contact.types || []);  
    handleCloseModal(); 
  };

  const handleDelete = () => {
    setContacts((current: Contact[]) => current.filter(c => c.id !== contact.id));
    clearContact(contact.id);
    handleCloseModal();
  };

  const toggleType = (type: string, event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); 
    event.stopPropagation();
    setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

  return (
    <div> 
      <div className="contact-card" onClick={handleOpenModal} style={{ cursor: 'pointer', border: '1px solid #ccc', padding: '15px', borderRadius: '8px', margin: '15px' }}>
        <img src={contact.imageUrl ? contact.imageUrl : defaultImage} alt={contact.name} style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
        <h3>{contact.name}</h3>
      </div>

      <Modal isOpen={isModalOpen} onRequestClose={handleCloseModal} contentLabel="Edit Contact" style={{ overlay: { backgroundColor: 'rgba(0, 0, 0, 0.75)' }, content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', width: '40%', height: '80%', border: '1px solid #ccc', borderRadius: '10px', padding: '20px' } }}>
        <form onSubmit={(e) => { e.preventDefault(); 
          handleSave(e); }}>

          <div className='contact-edit-content'>
            <input type="text" name="name" placeholder="Name" value={editedContact.name} onChange={handleChange} />
            <input type="text" name="address" placeholder="Address" value={editedContact.address} onChange={handleChange} />
            <input type="text" name="phone" placeholder="Phone Number" value={editedContact.phone} onChange={handleChange} />
            <input type="text" name="imageUrl" placeholder="Image URL" value={editedContact.imageUrl || ''} onChange={handleChange} />

            <div className={'select-buttons'}>
              {['Business', 'Personal', 'School'].map(type => (
                <button key={type} onClick={(e) => toggleType(type, e)} style={{ backgroundColor: selectedTypes.includes(type) ? 'lightblue' : 'White', margin: '5px', border: '2px solid #000000', borderRadius: '8px' }}>{type}</button>
              ))}
            </div>

            <button type="submit">Save Changes</button>
            <button style={{ color: 'red' }} type="button" onClick={handleDelete}>Delete Contact</button>
            <button type="button" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      </Modal>
      </div>
  );
};

export default ContactCard;
