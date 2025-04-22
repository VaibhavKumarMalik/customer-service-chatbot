const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const Message = require('../models/Message');

// GET chat page
router.get("/", chatController.getChatPage);

// POST message from user
router.post("/send-message", chatController.handleUserMessage);

// Clear chat route
router.post("/clear-chat", async (req, res) => {
  try {
    await Message.deleteMany({}); // ← this deletes ALL messages
    console.log("All chat messages deleted.");
    res.redirect("/");
  } catch (error) {
    console.error("Error deleting messages:", error);
    res.status(500).send("Failed to clear chat history.");
  }
});

module.exports = router;
