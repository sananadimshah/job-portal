import express from "express";
import {
  createuser,
  login,
  updateUser,
} from "../controllers/userController.js";
import { testPostController } from "../controllers/testController.js";
import {
  createJobs,
  getsjobs,
  updatejob,
  deletejob,
  jobStats,
} from "../controllers/jobController.js";
import { userauth } from "../middlewares/authmiddleware.js";

const router = express.Router();

// TEST ROUTE
router.post("/test", userauth, testPostController);
// USER ROUTES

// CREATE USER || POST
router.post("/register", createuser);
// LOGIN USER || POST
router.post("/login", login);
// UPDATE USER || PUT
router.put("/updateUser", userauth, updateUser);

// JOBS ROUTES

// CREATE JOBS || POST METHOD

router.post("/create-job", userauth, createJobs);

// GET JOBS || GET METHOD
router.get("/get-job", userauth, getsjobs);

// UPDATE JOBS || PUT METHOD
router.put("/update-job/:id", userauth, updatejob);

//DELETE JOBS || DELETE
router.delete("/delete-job/:id", userauth, deletejob);

//JOBS STATS FILTER || GET
router.get("/job-stats", userauth, jobStats);
// router.get("/job-stats", userauth, jobStats);

export default router;
