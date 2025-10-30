class CasesController {
  constructor(CaseModel) {
    this.CaseModel = CaseModel;
  }

    async createCase(req, res) {
        try {
            console.log('Request Body:', req.body);
            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({ message: 'Request body cannot be empty' });
            }

            const newCase = new this.CaseModel(req.body);
            const savedCase = await newCase.save();
            res.status(201).json(savedCase);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getCases(req, res) {
        try {
            const cases = await this.CaseModel.find();
            if (!cases.length) return res.status(404).json({ message: 'No cases found' });
            res.status(200).json(cases);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getCaseById(req, res) {
        try {
            const caseItem = await this.CaseModel.findOne({ caseId: req.params.id });
            if (!caseItem) return res.status(404).json({ message: 'Case not found' });
            res.status(200).json(caseItem);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateCase(req, res) {
        try {
            const updatedCase = await this.CaseModel.findOneAndUpdate(
                { caseId: req.params.id },
                { ...req.body, updatedAt: new Date() },
                { new: true }
            );
            if (!updatedCase) return res.status(404).json({ message: 'Case not found' });
            res.status(200).json(updatedCase);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async deleteCase(req, res) {
        try {
            const deletedCase = await this.CaseModel.findOneAndDelete({ caseId: req.params.id });
            if (!deletedCase) return res.status(404).json({ message: 'Case not found' });
            res.status(200).json({ message: `Case ${req.params.id} deleted successfully` });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = CasesController;
