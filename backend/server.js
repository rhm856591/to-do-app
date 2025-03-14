const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/todo', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Todo Schema
const todoSchema = new mongoose.Schema({
    title: String,
    description: String,
    date: { type: Date, default: Date.now }
});

const Todo = mongoose.model('Todo', todoSchema);

// API Routes
app.post('/todos', async (req, res) => {
    try {
        const { title, description } = req.body;
        const newTodo = new Todo({ title, description });
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        res.status(500).json({ message: 'Error creating todo', error: error.message });
    }
});

app.get('/todos', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const todos = await Todo.find()
            .sort({ date: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));
        
        const count = await Todo.countDocuments();
        
        res.json({
            todos,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page)
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching todos', error: error.message });
    }
});

app.get('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await Todo.findById(id);
        
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        
        res.json(todo);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching todo', error: error.message });
    }
});

app.put('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;
        
        const updatedTodo = await Todo.findByIdAndUpdate(
            id, 
            { title, description }, 
            { new: true }
        );
        
        if (!updatedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        
        res.json(updatedTodo);
    } catch (error) {
        res.status(500).json({ message: 'Error updating todo', error: error.message });
    }
});

app.delete('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTodo = await Todo.findByIdAndDelete(id);
        
        if (!deletedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        
        res.json({ message: 'Todo deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting todo', error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});