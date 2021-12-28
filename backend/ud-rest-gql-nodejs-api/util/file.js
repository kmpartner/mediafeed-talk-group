const fs = require('fs');
const path = require('path');

const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  // console.log('filePath', filePath);
  fs.unlink(filePath, err => console.log(err));
}

exports.clearImage = clearImage;