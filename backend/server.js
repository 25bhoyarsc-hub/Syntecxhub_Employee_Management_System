const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dns = require('dns');
require('dotenv').config();

// Google DNS force kar rahe hain
dns.setServers(['8.8.8.8', '1.1.1.1']);

const app = express();
app.use(express.json());
app.use(cors());



mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000 // Force failure in 5s if can't reach DB
})
.then(() => {
  console.log('✅ DATABASE CONNECTED SUCCESSFULLY!');
})
.catch((err) => {
  console.error('❌ DB CONNECTION ERROR:', err.message);
});
// Employee Schema & Routes
const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  salary: { type: Number, required: true },
  email: { type: String, required: true, unique: true }
}, { timestamps: true });

const Employee = mongoose.model('Employee', employeeSchema);

app.post('/api/employees', async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).json(employee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/api/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/employees/:id', async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedEmployee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/employees/:id', async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));