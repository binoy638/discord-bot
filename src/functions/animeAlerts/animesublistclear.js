const mongo = require("../../mongo");
const animeAlertSchema = require("../../schemas/animeAlertSchema");
const Job = require("../JobManager");

module.exports = async (id) => {
  let jobs;
  await mongo().then(async (mongoose) => {
    try {
      jobs = await animeAlertSchema.find({
        guild: id,
      });

      if (jobs) {
        jobs.map((job) => Job.delete(`Alerts-${job._id}`));
        await animeAlertSchema.deleteMany({ guild: id });
      }
    } catch (e) {
      console.log(e);
      console.log("not found");
    } finally {
      mongoose.connection.close();
    }
  });
};
