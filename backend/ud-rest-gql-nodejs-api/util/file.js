const fs = require('fs');
const path = require('path');

const clearImage = filePath => {
  // filePath = path.join(__dirname, '..', filePath);
  // console.log('filePath', filePath);
  fs.unlink(filePath, err => console.log(err));
}


const acceptImageExt = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];
const acceptVideoExt = ['.mp4', '.webm'];
const acceptAudioExt = ['.mp3', '.wav', '.weba'];

const isAudioFile = (fileName) => {
  // const fileNameArray = fileName.split('.');
  const ext = path.parse(fileName).ext;
  // console.log('fileName, ext', fileName, ext);
  let matchType;
  
  if (ext) {
    matchType = acceptAudioExt.find(type => type === ext.toLowerCase());
  }
  // console.log(matchType);

  if (matchType) {
    return true;
  } else {
    return false;
  }
};

module.exports = {
  clearImage,
  isAudioFile,
}

// exports.clearImage = clearImage;