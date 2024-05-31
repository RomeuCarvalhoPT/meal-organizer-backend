//routes/files.js
const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { expressjwt: jwt } = require('express-jwt');


router.use('/', jwt({ secret: 'your_jwt_secret', algorithms: ['HS256'] }));

// Route for uploading files
router.post("/upload", upload.single("image"), (req, res) => {
  try {
    const userId = req.auth.id; // Extract username from the token
    // Respond with the URL of the uploaded file
    const host = req.get('host');
    const filePath = "http://" + host + "/files/" + userId + "_" + req.file.filename;

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
  const userId = req.auth.id;
  const reqFilename = req.params.filename;
  const filename = userId + "_" + reqFilename.substring(reqFilename.indexOf("_") + 1);
  const file = path.join(__dirname, '../uploads', filename);
  res.sendFile(file);
});

router.use("/files", express.static(path.join(__dirname, 'uploads')));



module.exports = router;