import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';

const UserForm = ({ user, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    company: { name: '' }
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        company: { name: user.company?.name || '' }
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'companyName') {
      setFormData(prev => ({
        ...prev,
        company: { ...prev.company, name: value }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (user) {
        const updatedUser = await userService.updateUser(user.id, formData);
        onSubmit(updatedUser);
      } else {
        const newUser = await userService.createUser(formData);
        onSubmit(newUser);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert(error.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="text-xl md:text-2xl font-bold mb-6">
          {user ? 'Edit User' : 'Add New User'}
        </h2>
        <form onSubmit={handleSubmit} className="form-input">
          <div className='maincont' >
            <label className='cont1'>Name :</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className='cont2'
              required
            />
          </div>
          <div  className='maincont'>
            <label className="block mb-2 text-sm">Username :</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="cont2"
              required
            />
          </div>
          <div className='maincont'>
            <label className="block mb-2 text-sm">Email :</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="cont2"
              required
            />
          </div>
          <div className='maincont'>
            <label className="block mb-2 text-sm">Phone :</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="cont2"
            />
          </div>
          <div className='maincont'>
            <label className="block mb-2 text-sm">Company Name :</label>
            <input
              type="text"
              name="companyName"
              value={formData.company.name}
              onChange={handleChange}
              className="cont2"
            />
          </div>
          <div className="pop">
            <button
              type="submit"
              className="btn"
            >
              {user ? 'Update User' : 'Add User'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="btn2"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;