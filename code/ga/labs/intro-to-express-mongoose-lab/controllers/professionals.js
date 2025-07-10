import express from 'express'
import Professional from '../models/professional.js'

const router = express.Router();


// Home Page
router.get('/', (req, res) => {
    return res.redirect('/professionals');
});

  // INDEX
router.get('/professionals', async (req, res, next) => {
    try {
      const professionals = await Professional.find();
      return res.render('pros/index', { professionals });
    } catch (error) {
      console.log(error)
    }
  });
  
  //NEW
  router.get('/professionals/new', (req, res) => {
    res.render('pros/new');
  });
  
  // EDIT
  router.get('/professionals/:profID/edit', async (req, res, next) => {
    try {
      const { profID } = req.params;
      const professional = await Professional.findById(profID);
      return res.render('pros/edit', { professional });
    } catch (error) {
      console.log(error)
    }
  });
  
  // SHOW
  router.get('/professionals/:profID', async (req, res, next) => {
    try {
      const { profID } = req.params;
      const professional = await Professional.findById(profID);
      return res.render('pros/show', { professional });
    } catch (error) {
      console.log (error)
    }
  });
  
  //CREATE
  router.post('/professionals', async (req, res, next) => {
    try {
      const createdPro = await Professional.create(req.body)
      return res.redirect(`/professionals/${createdPro._id}`)  
    } catch {
      console.log(error)
    }
  });
  
   // DELETE
  router.delete('/professionals/:profID', async (req, res, next) => {
    try {
      const { profID } = req.params;
      const deletedPro = await Professional.findByIdAndDelete(profID)
      console.log(`Deleted: ${deletedPro.title}`)
      return res.redirect('/professionals')
    } catch {
      console.log(error)
    }
  })
  
  
  //UPDATE
  router.put('/professionals/:profID', async (req, res, next) => {
      try {
      const { profID } = req.params;
      const updatedPro = await Professional.findByIdAndUpdate(profID, req.body);
      console.log(`Updated: ${updatedPro.title}`)
      return res.redirect(`/professionals/${profID}`)
    } catch (error) {
      console.log (error)
    }
  });
  
  
  export default router