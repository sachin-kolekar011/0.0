const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));  // Serve static files

// Flatmate requests (mock database)
let flatmateRequests = [];

// Endpoint to get flatmate requests
app.get('/api/flatmates', (req, res) => {
    res.json(flatmateRequests);
});

// Endpoint to create a new flatmate request
app.post('/api/flatmates', (req, res) => {
    const { name, phone, college, location, ownerName, ownerPhone, facilities, flatType, rent } = req.body;

    // Ensure the request body is valid before proceeding
    if (!name || !phone || !college || !location || !ownerName || !ownerPhone || !facilities || !flatType || !rent) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const newRequest = {
        id: Date.now(),
        name,
        phone,
        college,
        location,
        ownerName,
        ownerPhone,
        facilities,
        flatType,
        rent
    };

    flatmateRequests.push(newRequest);
    res.status(201).json(newRequest);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
