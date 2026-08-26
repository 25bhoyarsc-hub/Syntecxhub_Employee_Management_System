import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'https://syntecxhub-employee-management-system-g9ef.onrender.com/api/employees';


function App() {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({ name: '', role: '', salary: '', email: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(API_URL);
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.role || !formData.salary || !formData.email) {
      setError('All fields are required.');
      return;
    }
    setError('');

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData);
        setEditingId(null);
      } else {
        await axios.post(API_URL, formData);
      }
      setFormData({ name: '', role: '', salary: '', email: '' });
      fetchEmployees();
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred.');
    }
  };

  const handleEdit = (emp) => {
    setFormData({ name: emp.name, role: emp.role, salary: emp.salary, email: emp.email });
    setEditingId(emp._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      await axios.delete(`${API_URL}/${id}`);
      fetchEmployees();
    }
  };

  return (
    <div className="container">
      <h2>Employee Management System</h2>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="form">
        <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
        <input type="text" name="role" placeholder="Job Role" value={formData.role} onChange={handleChange} required />
        <input type="number" name="salary" placeholder="Salary" value={formData.salary} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
        <button type="submit">{editingId ? 'Update Employee' : 'Add Employee'}</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Salary</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp._id}>
              <td>{emp.name}</td>
              <td>{emp.role}</td>
              <td>${emp.salary}</td>
              <td>{emp.email}</td>
              <td>
                <button onClick={() => handleEdit(emp)}>Edit</button>
                <button onClick={() => handleDelete(emp._id)} className="delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;