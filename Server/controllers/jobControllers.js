import Job from "../models/job.js";

const createJob = async (req, res) => {
  try {
    const job = await Job.create({
      ...req.body,
      recruiterId: req.user.id
    });

    res.status(201).json({
      message: "Job created successfully",
      job
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create job",
      error: error.message
    });
  }
};

const getJobs = async (req, res) => {
  try {
    console.log("QUERY:", req.query);

    const { location, employmentType, skills } = req.query;

    const filter = {};

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    if (employmentType) {
      filter.employmentType = employmentType;
    }

    if (skills) {
      filter.skills = {
        $in: skills.split(",")
      };
    }

    console.log("FILTER:", filter);

    const jobs = await Job.find(filter);

    res.status(200).json({
      message: "Jobs fetched successfully",
      count: jobs.length,
      jobs
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch jobs",
      error: error.message
    });
  }
};

const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      recruiterId: req.user.id
    });

    res.status(200).json({
      message: "Your jobs fetched successfully",
      count: jobs.length,
      jobs
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch your jobs",
      error: error.message
    });
  }
};

const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found"
      });
    }

    res.status(200).json({
      message: "Job fetched successfully",
      job
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch job",
      error: error.message
    });
  }
};


const updateJob = async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      recruiterId: req.user.id
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found or you are not authorized"
      });
    }

    Object.assign(job, req.body);

    await job.save();

    res.status(200).json({
      message: "Job updated successfully",
      job
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update job",
      error: error.message
    });
  }
};

const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      recruiterId: req.user.id
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found or you are not authorized"
      });
    }

    await job.deleteOne();

    res.status(200).json({
      message: "Job deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete job",
      error: error.message
    });
  }
};

export { createJob, getJobs, getJobById, updateJob, deleteJob ,getMyJobs};

