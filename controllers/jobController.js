import jobModel from "../models/jobModel.js";
import mongoose from "mongoose";
import moment from "moment";
// =========== CREATE JOBS =============
const createJobs = async (req, res, next) => {
  const { company, position } = req.body;
  if (!company || !position) {
    next("Please Provide All Fields");
  }
  req.body.createdBy = req.user.userId;
  const job = await jobModel.create(req.body);
  res.status(201).json({ job });
};

// =========== GET JOBS =============
const getsjobs = async (req, res) => {
  const { status, workType, search, sort } = req.query;

  const queryObj = {
    createdBy: req.user.userId,
  };

  if (status && status !== "all") {
    queryObj.status = status;
  }

  if (workType && workType !== "all") {
    queryObj.workType = workType;
  }
  if (search) {
    queryObj.position = { $regex: search, $options: "i" };
  }

  let queryResult = jobModel.find(queryObj);

  // sorting
  if (sort === "latest") {
    queryResult = queryResult.sort("-createdAt");
  }
  if (sort === "oldest") {
    queryResult = queryResult.sort("createdAt");
  }
  if (sort === "a-z") {
    queryResult = queryResult.sort("position");
  }
  if (sort === "z-a") {
    queryResult = queryResult.sort("-position");
  }

  const job = await queryResult;
  // const jobs = await jobModel.find({ createdBy: req.user.userId });
  res.status(200).json({
    totalJobs: job.length,
    job,
  });
};

// =========== UPDATE JOBS =============

const updatejob = async (req, res, next) => {
  const { id } = req.params;
  const { company, position } = req.body;
  //validation
  if (!company || !position) {
    next("Please Provide All Fields");
  }
  let job = await jobModel.findOne({ _id: id });
  if (!job) {
    next(`no jobs found with this ${id}`);
  }
  if (!req.user.userId === job.createdBy.toString()) {
    next("You are not authorised");
    return;
  }
  const updateJob = await jobModel.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ updateJob });
};

// =========== DELETE JOBS =============

const deletejob = async (req, res, next) => {
  const { id } = req.params;
  // console.log(id)
  //find job
  const job = await jobModel.findOne({ _id: id });

  //validation
  console.log(job);
  if (!job) {
    next(`No Job Found With This ID ${id}`);
  }
  if (!req.user.userId === job.createdBy.toString()) {
    next("Your Not Authorize to delete this job");
    return;
  }
  await job.deleteOne();
  res.status(200).json({ message: "Success, Job Deleted!" });
};

// =========== JOBS STATS =============

const jobStats = async (req, res) => {
  const stats = await jobModel.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.userId),
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  // default stats
  const defaultStats = {
    pending: stats.pending || 0,
    reject: stats.reject || 0,
    interview: stats.interview || 0,
  };

  // monthly yearly stats
  let monthlyApplication = await jobModel.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.userId),
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: {
          $sum: 1,
        },
      },
    },
  ]);
  monthlyApplication = monthlyApplication
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = moment()
        .month(month - 1)
        .year(year)
        .format("MMM Y");
      return { date, count };
    })
    .reverse();
  console.log(monthlyApplication);
  res
    .status(200)
    .json({ totalJob: stats.length, defaultStats, monthlyApplication });
};

export { createJobs, getsjobs, updatejob, deletejob, jobStats };
