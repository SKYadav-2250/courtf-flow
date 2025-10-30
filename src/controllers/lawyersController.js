class LawyersController {
  constructor(LawyerModel) {
    this.LawyerModel = LawyerModel;
  }

  // Generate unique Lawyer ID (Lxxxx)
  async generateUniqueLawyerId() {
    let lawyerId;
    let exists = true;

    while (exists) {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      lawyerId = `L${randomNum}`;
      const existing = await this.LawyerModel.findOne({ lawyerId });
      if (!existing) exists = false;
    }

    return lawyerId;
  }

  // ✅ Create Lawyer with unique ID
  async createLawyer(req, res) {
    try {
      if (!req.body || Object.keys(req.body).length === 0)
        return res.status(400).json({ message: "Request body cannot be empty" });

      const lawyerId = await this.generateUniqueLawyerId();

      const lawyerData = {
        ...req.body,
        lawyerId, // Add unique lawyerId
      };

      const lawyer = new this.LawyerModel(lawyerData);
      await lawyer.save();

      res.status(201).json(lawyer);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // ✅ Get all lawyers
  async getLawyers(req, res) {
    try {
      const lawyers = await this.LawyerModel.find();
      res.status(200).json(lawyers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // ✅ Get by lawyerId (e.g., L6578)
  async getLawyerById(req, res) {
    try {
      const { id } = req.params; // L6578
      const lawyer = await this.LawyerModel.findOne({ lawyerId: id });

      if (!lawyer)
        return res.status(404).json({ message: "Lawyer not found" });

      res.status(200).json(lawyer);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // ✅ Update by lawyerId
  async updateLawyer(req, res) {
    try {
      const { id } = req.params;
      const lawyer = await this.LawyerModel.findOneAndUpdate(
        { lawyerId: id },
        req.body,
        { new: true }
      );

      if (!lawyer)
        return res.status(404).json({ message: "Lawyer not found" });

      res.status(200).json(lawyer);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // ✅ Delete by lawyerId
  async deleteLawyer(req, res) {
    try {
      const { id } = req.params;
      const lawyer = await this.LawyerModel.findOneAndDelete({ lawyerId: id });

      if (!lawyer)
        return res.status(404).json({ message: "Lawyer not found" });

      res
        .status(200)
        .json({ message: `Lawyer with ID ${id} deleted successfully` });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = LawyersController;
