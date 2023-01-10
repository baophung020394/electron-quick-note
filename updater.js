// Electron-updater Module
const { dialog } = require("electron");
const { autoUpdater } = require("electron-updater");

// Configure log debugging
autoUpdater.logger = require("electron-log");
autoUpdater.logger.transports.file.level = "info";

// Disable auto downloading of updates
// autoUpdater.autoDownload = false;

// Singe export to check for and apply any available updates
module.exports = () => {
  // Check for update (GH Releases)
  autoUpdater.checkForUpdates();

  // Listen for update found
//   autoUpdater.on("update-available", () => {
//     // Promt user to start download
//     dialog.showMessageBox({
//         type: 'info',
//         title: 'Update available',
//         message: 'A new version of Readit is available. Do you want to update now?',
//         buttons: ['Update', 'No']
//     }).then(result => {
//         let buttonIndex = result.response

//         // If button 0 (update), start downloading the update
//         if(buttonIndex === 0) autoUpdater.downloadUpdate()
//     })
//   });
};
