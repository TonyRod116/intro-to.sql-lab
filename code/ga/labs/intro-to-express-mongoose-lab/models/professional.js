import mongoose from 'mongoose';

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

export default Professional