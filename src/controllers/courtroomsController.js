class CourtroomsController {
  constructor(CourtroomModel) {
    this.Courtroom = CourtroomModel;
  }

  // ➤ Create courtroom
  async createCourtroom(req, res) {
    try {
     

      if (!req.body || Object.keys(req.body).length === 0)
        return res.status(400).json({ message: 'Request body cannot be empty' });

      const { name, number, location, capacity } = req.body;

      const existingCourtroom = await this.Courtroom.findOne({ number });
      if (existingCourtroom)
        return res.status(400).json({ message: `Courtroom number ${number} already exists` });

      const newCourtroom = new this.Courtroom({ name, number, location, capacity });
      await newCourtroom.save();

      console.log("✅ New courtroom saved:", newCourtroom);
      res.status(201).json(newCourtroom);
    } catch (error) {
      console.error("❌ Error creating courtroom:", error.message);
      res.status(400).json({ message: error.message });
    }
  }

  // ➤ Get all courtrooms
  async getCourtrooms(req, res) {
    try {
      const courtrooms = await this.Courtroom.find();
      res.status(200).json(courtrooms);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // ➤ Get courtroom by ID
  async getCourtroomById(req, res) {
    try {
      const courtroom = await this.Courtroom.findOne({ courtroomId: req.params.id });
      if (!courtroom) return res.status(404).json({ message: 'Courtroom not found' });
      res.status(200).json(courtroom);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // ➤ Update courtroom
async updateCourtroom(req, res) {
  try {
    const updatedCourtroom = await this.Courtroom.findOneAndUpdate(
      { number: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedCourtroom) {
      return res.status(404).json({ message: "Courtroom not found" });
    }

    res.status(200).json({
      message: "Courtroom updated successfully",
      courtroom: updatedCourtroom
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: `Duplicate value detected for field: ${
          Object.keys(error.keyValue)[0]
        }`
      });
    }
    res.status(400).json({ message: error.message });
  }
}

  // ➤ Delete courtroom by number
  async deleteCourtroom(req, res) {
    try {
      const deletedCourtroom = await this.Courtroom.findOneAndDelete({ number: req.params.id });
      if (!deletedCourtroom)
        return res.status(404).json({ message: 'Courtroom not found' });

      res.status(200).json({
        message: `Courtroom deleted successfully room number ${req.params.id}`,
        
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = CourtroomsController;
