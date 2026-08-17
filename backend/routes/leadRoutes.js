const express = require("express");

const {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
} = require("../controllers/leadController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getLeads);
router.post("/", createLead);
router.put("/:id", updateLead);
router.delete("/:id", deleteLead);


module.exports = router;
