const mongo = require("../../mongo");
const ninegagSchema = require("../../schemas/ninegagSchema");

const Job = require("../JobManager");

module.exports = async (id) => {
  let jobs;

  await mongo().then(async (mongoose) => {
    try {
      jobs = await ninegagSchema.find({
        guild: id,
      });

      if (jobs) {
        jobs.map((job) => Job.delete(`job-${job.channel}`));
        await ninegagSchema.deleteMany({ guild: id });
      }
    } catch (e) {
      console.log(e);
      console.log("not found");
    } finally {
      mongoose.connection.close();
    }
  });
};
