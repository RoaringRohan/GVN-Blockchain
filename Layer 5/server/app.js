const express = require('express');

const app = express();

const PORT = 8000;

// Make GVN admin privileges required to access anything in the layerZero.js class
app.use('/secure/layerZero/', require ('./routes/layerZero'));

// Anyone who wants to develop on this blockchain can use any of these API routes
// Needs to be logged in to website before, aka require authentication to use these API endpoints.
app.use('/api/layerOne/', require ('./routes/layerOne'));
app.use('/api/layerTwo/', require ('./routes/layerTwo'));
app.use('/api/layerThree/', require ('./routes/layerThree'));

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});
