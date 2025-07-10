import express from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'
import 'dotenv/config'

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.urlencoded());
app.use(morgan('dev'));

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

app.get('/', (req, res) => {
  res.redirect('/professionals');
});


app.get('/professionals', async (req, res) => {
  const professionals = await Professional.find();
  res.render('index', { professionals });
});

app.get('/professionals/:id', async (req, res) => {
  const professional = await Professional.findById(req.params.id);
  res.render('show', { professional });
});

app.get('/professionals/new', (req, res) => {
  res.render('new');
});

app.post('/professionals', async (req, res) => {
  const createdProfessional = await Professional.create(req.body);
  return res.redirect(`/professionals/${createdProfessional._id}`);
});

app.get('/professionals/:id/edit', async (req, res) => {
  const professional = await Professional.findById(req.params.id);
  res.render('edit', { professional });
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
