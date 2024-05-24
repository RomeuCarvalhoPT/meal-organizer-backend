//routes/files.js
const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

// Route for uploading files
router.post("/upload", upload.single("image"), (req, res) => {
  try {
    // Respond with the URL of the uploaded file
    const host = req.get('host');
    const filePath = "http://" + host + "/files/" + req.file.filename;

    return res
      .status(200)
      .json({
        message: "File uploaded successfully!",
        url: filePath,
      });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});
const path = require('path');


router.get("/:filename", async (req, res) => {
  const filename = req.params.filename;
  const file = path.join(__dirname, '../uploads', filename);
  res.sendFile(file);
});

router.use("/files", express.static(path.join(__dirname, 'uploads')));

//router.use("/files", express.static("./uploads/"));


module.exports = router;