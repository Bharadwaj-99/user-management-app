import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import UserForm from './UserForm';
import { Trash2, Edit, Plus,ChevronLeft, ChevronRight } from 'lucide-react';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const fetchedUsers = await userService.getAllUsers();
      setUsers(fetchedUsers);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    
    if (confirmDelete) {
      try {
        await userService.deleteUser(userId);
        setUsers(users.filter(user => user.id !== userId));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleSubmit = (user) => {
    if (selectedUser) {
      
      setUsers(users.map(u => u.id === user.id ? user : u));
    } else {
      
      setUsers([...users, { ...user, id: users.length + 1 }]);
    }
    setIsFormOpen(false);
    setSelectedUser(null);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        {error}
      </div>
    );
  }

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(users.length / usersPerPage); i++) {
      pageNumbers.push(i);
    }
     
    return (
        <nav className="user">
          <button 
            onClick={() => paginate(currentPage - 1)} 
            disabled={currentPage === 1}
            className="p-2 disabled:opacity-50"
          >
            <ChevronLeft />
          </button>
          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-4 py-2 rounded ${
                currentPage === number 
                  ? 'btn-primary text-white' 
                  : 'btn-neutral text-gray-800'
              }`}
            >
              {number}
            </button>
          ))}
          <button 
            onClick={() => paginate(currentPage + 1)} 
            disabled={currentPage === pageNumbers.length}
            className="p-2 disabled:opacity-50"
          >
            <ChevronRight />
          </button>
        </nav>
      );
    };




    return (
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h1 className='heading'>USER MANAGEMENT</h1>
            <div className='heading-sub'>
            <button 
              onClick={() => {
                setSelectedUser(null);
                setIsFormOpen(true);
              }}
              className="btn"
            >
               Add User <Plus/> 
            </button>
            </div>
          </div>
    
          <div className="table-container">
            <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-2 md:px-4 py-3 text-left">ID</th>
                  <th className="px-2 md:px-4 py-3 text-left">Name</th>
                  <th className="hidden md:table-cell px-2 md:px-4 py-3 text-left">Username</th>
                  <th className="hidden md:table-cell px-2 md:px-4 py-3 text-left">Email</th>
                  <th className="hidden md:table-cell px-2 md:px-4 py-3 text-left">Company</th>
                  <th className="px-2 md:px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map(user => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="px-2 md:px-4 py-3">{user.id}</td>
                    <td className="px-2 md:px-4 py-3">{user.name}</td>
                    <td className="hidden md:table-cell px-2 md:px-4 py-3">{user.username}</td>
                    <td className="hidden md:table-cell px-2 md:px-4 py-3">{user.email}</td>
                    <td className="hidden md:table-cell px-2 md:px-4 py-3">{user.company?.name || 'N/A'}</td>
                    <td className="px-2 md:px-4 py-3 flex justify-center space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="btn"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="btn2"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
    
          
          {renderPagination()}
    
          {isFormOpen && (
            <UserForm
              user={selectedUser}
              onSubmit={handleSubmit}
              onCancel={() => {
                setIsFormOpen(false);
                setSelectedUser(null);
              }}
            />
          )}
        </div>
      );
    };
    
    export default UserList;