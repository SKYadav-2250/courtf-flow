import mongoose from 'mongoose';

const caseSchema = new mongoose.Schema({
    caseId: {
        type: String,
        unique: true,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    caseType: {
        type: String,
        required: true,
        enum: ['Criminal', 'Civil', 'Family', 'Corporate', 'Constitutional', 'Other'],
        default: 'Other'
    },
    judge: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Judge',
        required: true
    },
    filingLawyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lawyer',
        required: true
    },
    defendingLawyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lawyer',
        required: true
    },
    courtroom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Courtroom',
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Closed'],
        default: 'Pending'
    },
    nextDate:{
        type:Date,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update timestamp before saving
caseSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

// Auto-generate incrementing Case ID
caseSchema.pre('validate', async function (next) {
    if (this.isNew) {
        const lastCase = await mongoose.model('Case').findOne().sort({ createdAt: -1 }).exec();
        let nextIdNumber = 100001; // starting case number if none exist

        if (lastCase && lastCase.caseId) {
            const lastNumber = parseInt(lastCase.caseId.replace('Case', ''));
            nextIdNumber = lastNumber + 1;
        }

        this.caseId = `Case${nextIdNumber}`;
    }
    next();
});

export default mongoose.model('Case', caseSchema);
