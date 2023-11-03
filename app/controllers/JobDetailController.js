const axios = require("axios");
const FormData = require("form-data");
let data = new FormData();

// In your controllers.js or where your CRUD functions are defined:
exports.createJobDetail = async (req, res, next) => {
  const { jobDetail } = req.db.models;
  const { jobdetaillink, userDataId } = req.body;

  console.log(req.body);
  try {
    if (!jobdetaillink || !userDataId) {
      res
        .status(200)
        .send({ message: "Provide job detail link and UserDataId" });
    }

    if (jobdetaillink && userDataId) {
      data.append("link", jobdetaillink);
      data.append("username", process.env.USERNAME_INDEED);
      data.append("password", process.env.PASSWORD_INDEED);

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${process.env.AI_URL}/get_jobdesc`,
        headers: {
          ...data.getHeaders(),
        },
        data: data,
      };

      axios
        .request(config)
        .then(async (response) => {
          let resps = JSON.stringify(response.data);
          // console.log(response);
          if (response?.data?.error) {
            console.log("Error");
            res
              .status(500)
              .send({ status: false, error: response?.data?.error });
          } else {
            console.log("data Received");

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
          }
        })
        .catch((error) => {
          console.log(error);
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
