import express from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'
import 'dotenv/config'
import methodOverride from 'method-override'

const app = express();
const port = 3000;

app.set('view engine', 'ejs');


app.use(express.urlencoded());
app.use(morgan('dev'));
app.use(methodOverride('_method'))


const professionalSchema = new mongoose.Schema({
  type: { type: String, required: true },
  name: { type: String, required: true },
  valuation: [{ type: String }],
  pics: [{ type: String }],
  description: { type: String, required: true },
  location: { type: String, required: true },
  contact: { type: String, required: true },
  tags: [{ type: String }]
});

const Professional = mongoose.model('Professional', professionalSchema);


// const createProfile = async () => {
//   const profileToAdd = {
//     type: 'Reformista',         
//     name: 'Roberto',
//     valuation: ['⭐⭐⭐⭐⭐'],       
//     description: 'Manitas para todo',
//     location: 'Barcelona',
//     contact: '645645645',
//     tags: ['lampista', 'paleta', 'alicatador']
//   }
//   const response = await Professional.create(profileToAdd)
//   console.log('Response:', response)
// }

// Home Page
app.get('/', (req, res) => {
  res.redirect('/professionals');
});

// INDEX
app.get('/professionals', async (req, res) => {
  try {
    const professionals = await Professional.find();
    return res.render('pros/index', { professionals });
  } catch (error) {
    console.log(error)
  }
});

//NEW
app.get('/professionals/new', (req, res) => {
  res.render('pros/new');
});

// EDIT
app.get('/professionals/:profID/edit', async (req, res) => {
  try {
    const { profID } = req.params;
    const professional = await Professional.findById(profID);
    return res.render('pros/edit', { professional });
  } catch (error) {
    console.log(error)
  }
});

// SHOW
app.get('/professionals/:profID', async (req, res) => {
  try {
    const { profID } = req.params;
    const professional = await Professional.findById(profID);
    return res.render('pros/show', { professional });
  } catch (error) {
    console.log (error)
  }
});

//CREATE
app.post('/professionals', async (req, res) => {
  try {
    const createdPro = await Professional.create(req.body)
    return res.redirect(`/professionals/${createdPro._id}`)  
  } catch {
    console.log(error)
  }
});

 // DELETE
app.delete('/professionals/:profID', async (req, res) => {
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
app.put('/professionals/:profID', async (req, res) => {
    try {
    const { profID } = req.params;
    const updatedPro = await Professional.findByIdAndUpdate(profID, req.body);
    console.log(`Updated: ${updatedPro.title}`)
    return res.redirect(`/professionals/${profID}`)
  } catch (error) {
    console.log (error)
  }
});


const init = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('Connected')
        app.listen(port, () => console.log(`🚀 Server up and running on port ${port}`))
    } catch (error) {
        console.log(error)
    }
}
init()
