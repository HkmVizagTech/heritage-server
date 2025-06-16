const express = require("express");
const { Registration } = require("./models/contest");
const School = require("./models/school");
// const school = require("./models/school");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { schoolId, schoolName, contests, totalParticipants } = req.body;
    console.log(schoolId, schoolName, contests, totalParticipants)

    // Validate required fields
    if (
      !schoolId ||
      !Array.isArray(contests) ||
      contests.length === 0 ||
      !totalParticipants
    ) {
      return res.status(400).json({ message: "Invalid registration data." });
    }

    // Optional: Validate school exists
    const school = await School.findById(schoolId);
    if (!school) {
      return res.status(404).json({ message: "School not found." });
    }

    // Filter contests with participants > 0
    const validContests = contests
      .filter((c) => Number(c.participants) > 0)
      .map((c) => ({
        code: c.code,
        name: c.name,
        participants: Number(c.participants),
      }));

    if (validContests.length === 0) {
      return res
        .status(400)
        .json({ message: "No valid contests with participants provided." });
    }

    // Save registration
    const registration = new Registration({
      schoolId,
      schoolName: schoolName || school.name, // fallback to DB value
      contests: validContests,
      totalParticipants,
    });

    await registration.save();

    res
      .status(201)
      .json({ message: "Registration successful", registration });
  } catch (error) {
    console.error("Error saving registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// const express = require("express");
// const router = express.Router();

// const { Registration } = require("../models/Registration");
// const HeritageRegistration = require("../models/HeritageRegistration");

router.get("/events", async (req, res) => {
  try {
    const results = await School.aggregate([
      { 
        $lookup: {
          from: "registrations", // collection name (plural & lowercase)
          localField: "_id",
          foreignField: "schoolId",
          as: "registrationData",
        },
      },
      {
        $unwind: {
          path: "$registrationData",
          preserveNullAndEmptyArrays: true, // keeps schools without registration
        },
      },
      {
        $project: {
          schoolId: "$_id",
          schoolName: "$school",
          personInCharge: "$personInCharge",
          phone: "$phone",
          totalParticipants: "$registrationData.totalParticipants",
        },
      },
    ]);

    res.json(results);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ message: "Failed to fetch schools" });
  }
});
router.delete('/w', async (req, res) => {
  try {       
    const schoolResult = await School.deleteMany();
    const registrationResult = await Registration.deleteMany();
    console.log(schoolResult, registrationResult);
    return res.status(200).json({
      schoolDeleted: schoolResult,
      registrationsDeleted: registrationResult
    });
  } catch (err) {
    console.error("Error deleting documents:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});
// const express = require("express");
// const router = express.Router();

// const { Registration } = require("../models/Registration");
// const HeritageRegistration = require("../models/HeritageRegistration");

router.get("/registrations/:schoolId", async (req, res) => {
  const { schoolId } = req.params;

  try {
    // Fetch school info
    const school = await School.findById(schoolId);
    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }

    // Fetch registration linked to school
    const registration = await Registration.findOne({ schoolId });

    if (!registration) {
      return res.status(404).json({ message: "No registration found for this school" });
    }

    res.json({
      schoolName: registration.schoolName || school.school,
      address: school.address,
      personInCharge: school.personInCharge,
      phone: school.phone,
      telephone: school.telephone,
      mobile: school.mobile,
      contests: registration.contests,
      totalParticipants: registration.totalParticipants,
      createdAt: registration.createdAt,
    });
  } catch (err) {
    console.error("Error fetching school registration:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// module.exports = router;


// module.exports = router;


module.exports = router;
