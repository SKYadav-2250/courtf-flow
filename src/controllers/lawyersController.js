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
    const { name, barNumber, email, phone, specialization } = req.body;

    if (!name || !barNumber || !email || !phone || !specialization) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check for duplicate email or bar number
    const existingLawyer = await this.LawyerModel.findOne({
      $or: [{ email }, { barNumber }]
    });

    if (existingLawyer) {
      return res.status(400).json({ message: 'Email or Bar Number already exists' });
    }

    // Generate unique Lawyer ID
    const lastLawyer = await this.LawyerModel.findOne().sort({ createdAt: -1 });
    const lastId = lastLawyer ? parseInt(lastLawyer.lawyerId.replace('L', '')) : 1000;
    const lawyerId = `L${lastId + 1}`;

    const lawyer = new this.LawyerModel({
      lawyerId,
      name,
      barNumber,
      email,
      phone,
      specialization
    });

    await lawyer.save();

    // ✅ Response with message + lawyer data
    res.status(201).json({
      message: "Lawyer created successfully",
      lawyer
    });

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


  
    async updateLawyer(req, res) {
    try {
      const { id } = req.params;
      const { email } = req.body;

      if (email) {
        const existingLawyer = await this.LawyerModel.findOne({
          email,
          lawyerId: { $ne: id },
        });
        if (existingLawyer) {
          return res.status(400).json({
            message: "Another lawyer already exists with this email",
          });
        }
      }

      const lawyer = await this.LawyerModel.findOneAndUpdate(
        { lawyerId: id },
        req.body,
        { new: true }
      );

      if (!lawyer)
        return res.status(404).json({ message: "Lawyer not found" });

      res.status(200).json({
        message: "Lawyer updated successfully",
        lawyer,
      });
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
