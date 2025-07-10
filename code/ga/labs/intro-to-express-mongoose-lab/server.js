import express from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'
import 'dotenv/config'
import methodOverride from 'method-override'

// Routers / controllers
import prosRouter from './controllers/professionals.js'


const app = express();
const port = 3000;

app.set('view engine', 'ejs');

// Middleware
app.use(express.urlencoded());
app.use(morgan('dev'));
app.use(methodOverride('_method'))


//Routes start
//Home
app.get('/', (req, res) => {
    return res.render('index')
})
// PROS
app.use(prosRouter)
//Routes End


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
