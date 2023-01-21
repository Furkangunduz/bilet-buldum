const chalk = require("chalk");

class Cron {
  static schedule = require("node-schedule");
  static v4 = require("uuid").v4;
  static defaultFrequency = "*/30 * * * * *";

  constructor() {
    this.frequency = Cron.defaultFrequency;
    this.jobIdList = [];
  }

  startJob(JobFunction) {
    try {
      const id = Cron.v4();
      Cron.schedule.scheduleJob(id, this.frequency, JobFunction);
      this.jobIdList.push(id);

      return id;
    } catch (error) {
      console.log("Error when create Job", error);
    }
  }

  finishJob(id) {
    Cron.schedule.scheduledJobs[id].cancel();
    this.jobIdList = this.jobIdList.filter((jobId) => jobId !== id);
  }

  finishAllJobs() {
    Cron.schedule.gracefulShutdown();
    this.jobIdList = [];
    console.log("Bütün işlemler başarıyla sonlandırıldı.");
  }

  setFrequency(frequency) {
    console.log("frequency changed", frequency);
    this.frequency = frequency;
  }

  setFrequencyDefault() {
    console.log("default frequency");
    this.frequency = Cron.defaultFrequency;
  }

  setFrequencyLower() {
    console.log("lower frequency");
    this.frequency = "* * * * * *";
  }
}

module.exports = Cron;
