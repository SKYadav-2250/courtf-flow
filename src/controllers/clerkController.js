class ClerksController {
  constructor(ClerkModel) {
    this.ClerkModel = ClerkModel;
  }

  // ➤ Create Clerk
async createClerk(req, res) {
  try {
    const { name, email, phone, assignedCourtroom } = req.body;

    if (!name || !email || !phone)
      return res.status(400).json({ message: 'Name, email, and phone are required' });

    // ✅ Check duplicate email or phone
    const existingClerk = await this.ClerkModel.findOne({
      $or: [{ email }, { phone }]
    });
    if (existingClerk) {
      return res.status(400).json({ message: 'Clerk with this email or phone already exists' });
    }

    // ✅ Generate unique clerkId (C1001, C1002...)
    const lastClerk = await this.ClerkModel.findOne().sort({ createdAt: -1 });
    const lastId = lastClerk ? parseInt(lastClerk.clerkId.replace('C', '')) : 1000;
    const clerkId = `C${lastId + 1}`;

    // ✅ Save new clerk
    const newClerk = new this.ClerkModel({
      clerkId,
      name,
      email,
      phone,
      assignedCourtroom
    });
    await newClerk.save();

    // ✅ Populate assigned courtroom details properly
    const populatedClerk = await this.ClerkModel.findById(newClerk._id)
      .populate('assignedCourtroom', 'courtroomId name location number capacity');

    res.status(201).json(populatedClerk);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}


  // ➤ Get All Clerks
  async getClerks(req, res) {
    try {
      const clerks = await this.ClerkModel.find().populate('assignedCourtroom', 'courtroomId name location');
      res.status(200).json(clerks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // ➤ Get Clerk by ID
  async getClerkById(req, res) {
    try {
      const clerk = await this.ClerkModel.findOne({ clerkId: req.params.id })
        .populate('assignedCourtroom', 'courtroomId name location');
      if (!clerk) return res.status(404).json({ message: 'Clerk not found' });
      res.status(200).json(clerk);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // ➤ Update Clerk
  async updateClerk(req, res) {
    try {
      const updatedClerk = await this.ClerkModel.findOneAndUpdate(
        { clerkId: req.params.id },
        req.body,
        { new: true }
      ).populate('assignedCourtroom', 'courtroomId name location');

      if (!updatedClerk)
        return res.status(404).json({ message: 'Clerk not found' });

      res.status(200).json(updatedClerk);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // ➤ Delete Clerk
  async deleteClerk(req, res) {
    try {
      const deletedClerk = await this.ClerkModel.findOneAndDelete({ clerkId: req.params.id });
      if (!deletedClerk)
        return res.status(404).json({ message: 'Clerk not found' });

      res.status(200).json({
        message: 'Clerk deleted successfully',
        deletedClerk: {
          clerkId: deletedClerk.clerkId,
          name: deletedClerk.name,
          assignedCourtroom: deletedClerk.assignedCourtroom,
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default ClerksController;
