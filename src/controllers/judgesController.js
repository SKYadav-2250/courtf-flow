class JudgesController {
  constructor(JudgeModel) {
    this.JudgeModel = JudgeModel;
  }

  // Function to generate a unique Judge ID
  async generateUniqueJudgeId() {
    let judgeId;
    let exists = true;

    // Keep generating until we get a unique ID
    while (exists) {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      judgeId = `J${randomNum}`;
      const existing = await this.JudgeModel.findOne({ judgeId });
      if (!existing) exists = false;
    }

    return judgeId;
  }

  async createJudge(req, res) {
    try {
      console.log("Incoming Data:", req.body);

      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: "Request body cannot be empty" });
      }

      // Generate a unique Judge ID
      const judgeId = await this.generateUniqueJudgeId();

      // Merge the judgeId into the request body
      const judgeData = { ...req.body, judgeId };

      // Create and save the judge
      const judge = new this.JudgeModel(judgeData);
      await judge.save();

      console.log("Judge Saved:", judge);
      res.status(201).json(judge);
    } catch (error) {
      console.error("Error Creating Judge:", error);
      res.status(400).json({ message: error.message });
    }
  }

  async getJudges(req, res) {
    try {
      const judges = await this.JudgeModel.find();
      res.status(200).json(judges);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

async getJudgeById(req, res) {
  try {
    const { id } = req.params; // this will be your judgeId (e.g. J9087)
    const judge = await this.JudgeModel.findOne({ judgeId: id }); // ✅ use judgeId instead of _id

    if (!judge) {
      return res.status(404).json({ message: "Judge not found" });
    }

    res.status(200).json(judge);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


  async updateJudge(req, res) {
    try {
      const judge = await this.JudgeModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!judge) return res.status(404).json({ message: "Judge not found" });
      res.status(200).json(judge);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
async deleteJudge(req, res) {
  try {
    const { id } = req.params; // Example: J9087
    const judge = await this.JudgeModel.findOneAndDelete({ judgeId: id }); // ✅ delete by judgeId

    if (!judge) {
      return res.status(404).json({ message: "Judge not found" });
    }

    res.status(200).json({ message: `Judge with ID ${id} deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

}

module.exports = JudgesController;
