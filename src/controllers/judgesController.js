import User from '../models/User.js'; // Import User model

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
      const { name, court, experience, contact, password ,email } = req.body;

      if (!name || !court || !experience || !contact || !password || !email) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      // Generate a unique Judge ID
      const judgeId = await this.generateUniqueJudgeId();

      // Create and save the judge
      const judge = new this.JudgeModel({
        judgeId,
        name,
        court,
        experience,
        password,
        contact,
        email
      });
      await judge.save();

      // ✅ Add judge to User model for login
      const newUser = new User({
        username: name,
        email: email, // Generate a dummy email if not provided
        number: contact,

        password:password,
        role: 'judge'
      });
      await newUser.save();

      res.status(201).json({
        message: 'Judge created successfully and registered for login',
        judge
      });
    } catch (error) {
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


// ➤ Update Judge
// ➤ Update Judge
async updateJudge(req, res) {
  try {
    const updatedJudge = await this.JudgeModel.findOneAndUpdate(
      { judgeId: req.params.id },   // use judgeId instead of _id
      req.body,
      { new: true }                 // return updated document
    );

    if (!updatedJudge) {
      return res.status(404).json({ message: "Judge not found" });
    }

    res.status(200).json({
      message: "Judge updated successfully",
      updatedJudge
    });
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

export default JudgesController;
