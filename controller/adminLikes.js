const Like = require("../model/adminLikes");

const getLikesById = async (req, res, nesxt) => {
  const adminId = req.params.id;
  try {
    const likes = await Like.find({ admin: adminId }).populate({
      path: "admin",
      select: "email",
    });

    const isTrue = likes[0].admin._id.toString();

    if (!likes || !isTrue) {
      return res.status(404).json({ message: "Could not find like" });
    }
    if (adminId !== likes[0].admin._id.toString()) {
      return res.status(404).json({ message: "Not authorized" });
    }
    res.status(200).json({ message: "Like fetched", like: likes });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Internal server error" });
  }
};

module.exports = {
  getLikesById,
};
