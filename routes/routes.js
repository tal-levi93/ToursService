const express = require('express'),
    tourRoutes = require('./tours');

var router = express.Router();


router.get('/tours', tourRoutes.get_tours);
router.get('/tours/:id' , tourRoutes.get_tour)
router.post('/tours', tourRoutes.create_tour);
router.put('/tours/:id', tourRoutes.update_tour);
router.put('/updatesite/:id' , tourRoutes.create_site);
router.put('/deletesite/:id' , tourRoutes.delete_site)
router.delete('/tours/:id', tourRoutes.delete_tour);

module.exports = router;