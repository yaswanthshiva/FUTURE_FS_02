const express = require("express");

const {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  addActivity,
} = require("../controllers/leadController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getLeads);
router.post("/", createLead);
router.put("/:id", updateLead);
router.delete("/:id", deleteLead);
router.post("/:id/activity", addActivity);


module.exports = router;
