const axios = require("axios");
const { json } = require("body-parser");
const FormData = require("form-data");
const http = require("http");

// In your controllers.js or where your CRUD functions are defined:
exports.createJobDetail = async (req, res, next) => {
  const { jobDetail } = req.db.models;
  const { jobdetaillink, userDataId } = req.body;

  try {
    console.log(req.body);
    if (!jobdetaillink || !userDataId) {
      res
        .status(200)
        .send({ message: "Provide job detail link and UserDataId" });
    }

    if (jobdetaillink && userDataId) {
      console.log("fIRST");
      let data = new FormData();
      data.append("link", jobdetaillink);
      data.append("username", process.env.USERNAME_INDEED);
      data.append("password", process.env.PASSWORD_INDEED);

      let config = {
        method: "post",
        // timeout: 15000,
        maxBodyLength: Infinity,
        url: `${process.env.AI_URL}/get_jobdesc`,
        headers: {
          ...data.getHeaders(),
        },
        data: data,
      };
      console.log("sECOND");
      axios
        .request(config)
        .then(async (response) => {
          console.log("THIRD");
          console.log("response", response);
          console.log("for data", response.data);
          console.log("for error", response.data.error);
          let resps = JSON.stringify(response.data);

          console.log(resps);
          if (!response.data) {
            console.log("Fourth");
            res.status(200).send({
              status: true,
              message: "Scrapping Failed",
              response: response,
            });
          }
          // console.log("response", JSON.parse(resps));
          if (response) {
            console.log("Fifth");
            if (response.data.error) {
              console.log("Sixth");
              console.log("Error:", response.data.error);
              return res
                .status(400)
                .json({ status: false, error: response.data });
            } else {
              if (response.data) {
                console.log(":Seventh");
                console.log("Data Received");

                try {
                  console.log("Eigth");
                  const newJobDetail = await jobDetail.create({
                    jobdetaillink: jobdetaillink,
                    jobdetail: resps,
                    userDataId: userDataId,
                  });
                  return res.status(201).json({
                    status: true,
                    message: "Job detail created successfully.",
                    jobDetail: newJobDetail,
                  });
                } catch (err) {
                  console.log("Ninth");
                  console.error("Error creating job detail:", err);
                  return res.status(500).json({
                    status: false,
                    error: "Failed to create job detail.",
                  });
                }
              }
            }
          } else {
            console.log("Tenth");
            console.error("Empty or undefined response.");
            return res.status(500).json({
              status: false,
              error: "Empty or undefined response from the server.",
            });
          }
        })
        .catch((error) => {
          console.log("Eleventh");
          if (error.code === "ETIMEDOUT") {
            console.error("Request to AI server timed out:", error);
            res.status(500).json({
              status: false,
              message: "Request to AI server timed out.",
              error: error,
            });
          } else {
            console.error("Axios request failed:", error);
            res.status(500).json({
              status: false,
              message: "Request to AI server failed.",
              error: error,
            });
          }
        });
    } else {
      res.send({
        status: false,
        message: "Provide Accurate Detail like id and Job Link",
      });
    }
  } catch (error) {
    console.error("Error creating job detail:", error);
    return res.status(500).json({
      status: false,
      message: "An error occurred while creating the job detail.",
      error,
    });
  }
};
// Get job detail by ID

exports.getAllJobDetail = async (req, res, next) => {
  const { jobDetail } = req.db.models;
  const { id } = req.params;

  try {
    const jobDetailData = await jobDetail.findAll();
    if (!jobDetailData) {
      return res.status(404).json({
        status: false,
        message: "Job detail not found.",
      });
    }
    return res.status(200).json({
      status: true,
      jobDetail: jobDetailData,
    });
  } catch (error) {
    console.error("Error getting job details:", error);
    return res.status(500).json({
      status: false,
      message: "An error occurred while getting the job detail.",
      error,
    });
  }
};

exports.getJobDetailById = async (req, res, next) => {
  const { jobDetail } = req.db.models;
  const { id } = req.params;

  try {
    const jobDetailData = await jobDetail.findByPk(id);
    if (!jobDetailData) {
      return res.status(404).json({
        status: false,
        message: "Job detail not found.",
      });
    }
    return res.status(200).json({
      status: true,
      jobDetail: jobDetailData,
    });
  } catch (error) {
    console.error("Error getting job detail by ID:", error);
    return res.status(500).json({
      status: false,
      message: "An error occurred while getting the job detail.",
      error,
    });
  }
};

// Update job detail by ID
exports.updateJobDetail = async (req, res, next) => {
  const { jobDetail } = req.db.models;
  const { id } = req.params;
  const newData = req.body; // Assuming you are sending the updated data in the request body

  try {
    const jobDetailData = await jobDetail.findByPk(id);
    if (!jobDetailData) {
      return res.status(404).json({
        status: false,
        message: "Job detail not found.",
      });
    }
    await jobDetailData.update(newData);
    return res.status(200).json({
      status: true,
      message: "Job detail updated successfully.",
      jobDetail: jobDetailData,
    });
  } catch (error) {
    console.error("Error updating job detail:", error);
    return res.status(500).json({
      status: false,
      message: "An error occurred while updating the job detail.",
      error,
    });
  }
};

// Delete job detail by ID
exports.deleteJobDetail = async (req, res, next) => {
  const { jobDetail } = req.db.models;
  const { id } = req.params;

  try {
    const jobDetailData = await jobDetail.findByPk(id);
    if (!jobDetailData) {
      return res.status(404).json({
        status: false,
        message: "Job detail not found.",
      });
    }
    await jobDetailData.destroy();
    return res.status(200).json({
      status: true,
      message: "Job detail deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting job detail:", error);
    return res.status(500).json({
      status: false,
      message: "An error occurred while deleting the job detail.",
      error,
    });
  }
};
