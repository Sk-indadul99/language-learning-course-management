// course-management-service/routes/course.js

const express = require("express");
const router = express.Router();
const Course = require("../models/course");
const axios = require("axios");

router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/search", async (req, res) => {
  try {
    const searchQuery = req.query.query;
    const courses = await Course.find({
      $or: [
        { title: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
      ],
    });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/recommendations/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const response = await axios.get(
      `http://localhost:3001/users/${userId}/proficiency`
    );
    const userProficiency = response.data.proficiency;

    const courses = await Course.find({ level: userProficiency });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id/lessons", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course.lessons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
