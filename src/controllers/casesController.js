class CasesController {
  constructor(CaseModel) {
    this.CaseModel = CaseModel;
  }

  // ✅ Create a new case
  async createCase(req, res) {
    try {
      console.log('Request Body:', req.body);

      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: 'Request body cannot be empty' });
      }

      // Create and save case
      const newCase = new this.CaseModel(req.body);
      const savedCase = await newCase.save();

      // Populate related data
      const populatedCase = await this.CaseModel.findById(savedCase._id)
        .populate('judge', 'judgeId name email phone')
        .populate('filingLawyer', 'lawyerId name email phone specialization')
        .populate('defendingLawyer', 'lawyerId name email phone specialization')
        .populate('courtroom', 'courtroomId name location capacity');

      res.status(201).json({
        message: "Case created successfully",
        case: populatedCase
      });

    } catch (error) {
      console.error("Error creating case:", error);
      res.status(400).json({ message: error.message });
    }
  }

  // ✅ Get all cases (with details)
  async getCases(req, res) {
    try {
      const cases = await this.CaseModel.find()
        .populate('judge', 'judgeId name email phone')
        .populate('filingLawyer', 'lawyerId name email phone specialization')
        .populate('defendingLawyer', 'lawyerId name email phone specialization')
        .populate('courtroom', 'courtroomId name location capacity');

      if (!cases.length) {
        return res.status(404).json({ message: 'No cases found' });
      }

      res.status(200).json(cases);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // ✅ Get case by ID (with details)
  async getCaseById(req, res) {
    try {
      const caseItem = await this.CaseModel.findOne({ caseId: req.params.id })
        .populate('judge', 'judgeId name email phone')
        .populate('filingLawyer', 'lawyerId name email phone specialization')
        .populate('defendingLawyer', 'lawyerId name email phone specialization')
        .populate('courtroom', 'courtroomId name location capacity');

      if (!caseItem) {
        return res.status(404).json({ message: 'Case not found' });
      }

      res.status(200).json(caseItem);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // ✅ Update a case (with details)
  async updateCase(req, res) {
    try {
      const updatedCase = await this.CaseModel.findOneAndUpdate(
        { caseId: req.params.id },
        { ...req.body, updatedAt: new Date() },
        { new: true }
      )
        .populate('judge', 'judgeId name email phone')
        .populate('filingLawyer', 'lawyerId name email phone specialization')
        .populate('defendingLawyer', 'lawyerId name email phone specialization')
        .populate('courtroom', 'courtroomId name location capacity');

      if (!updatedCase) {
        return res.status(404).json({ message: 'Case not found' });
      }

      res.status(200).json({
        message: "Case updated successfully",
        case: updatedCase
      });

    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // ✅ Delete a case
  async deleteCase(req, res) {
    try {
      const deletedCase = await this.CaseModel.findOneAndDelete({ caseId: req.params.id });
      if (!deletedCase) {
        return res.status(404).json({ message: 'Case not found' });
      }

      res.status(200).json({
        message: `Case ${req.params.id} deleted successfully`
      });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default CasesController;
