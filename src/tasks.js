const schedule = require("node-schedule");

const SHUTDOWN_TASKS = [];

async function init() {
  const config = require("./config.js")();
  // The main runner, and function in charge of initializing all system tasks.

  for (const task of config.TASKS) {
    if (!validateTask(task)) {
      console.error("Invalid task syntax found!");
      console.error(task);
    }

    console.log(`Setting up: '${task.name}'`);

    switch(task.schedule) {
      case "startup": {
        await executeTask(task);
        break;
      }
      case "shutdown": {
        SHUTDOWN_TASKS.push(task);
        break;
      }
      default: {
        const job = schedule.scheduleJob(task.schedule, async function(task) {
          await executeTask(task);
        }.bind(null, task));
      }
    }
  }
}

async function executeTask(task) {
  if (!validateTask(task)) {
    console.error("Invalid task syntax found!");
    console.error(task);
  }

  console.log(`Executing: '${task.name}'`);

  switch(task.action) {
    case "importUsers": {
      const importer = require("./importer.js");

      await importer(task.file);
      break;
    }
    case "jsScript": {
      const customScript = require(`./storage/${task.file}`);

      await customScript(require("./context.js"));
    }
    default: {
      console.error(`Unrecognized task: '${task.action}' in '${task.name}'!`);
      break;
    }
  }
}

function validateTask(task) {
  if (
    typeof task.name !== "string"
    && typeof task.schedule !== "string"
  ) {
    return false;
  } else {
    return true;
  }
}

module.exports = {
  SHUTDOWN_TASKS,
  init,
  executeTask,
};
