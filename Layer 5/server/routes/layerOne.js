const express = require('express');
const router = express.Router();


//I want to make it so that each API endpoint in this class will have to make a call to a method in the layerZero.js class
// How do I import that class from the middleware folder into here?
// If I cannot import those methods here, then make those methods into each their own API endpoints and make a fetch call to them here.
//const app = express();
//app.use('/secure/layerZero/', require ('./middleware/layerZero'));
//END


router.get('/', async (req, res) => {
    console.log('hello');
});

module.exports = router;