var fs = require('fs');

// promise che contine al suo interno una funzione che conta i file in una directory
function countFile (dir_img) {
  return new Promise(function (resolve, reject) {
    var number_file_folder = 0;
    fs.readdir(dir_img, (err, files) => {
      number_file_folder = files.length;

      if (number_file_folder >= 1) {
        resolve(number_file_folder);
      } else {
        reject(0);
      }
    });

  })
}

module.exports = countFile;
