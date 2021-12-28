import QRCode from 'qrcode';
// import Resizer from "react-image-file-resizer";
import Compressor from 'compressorjs';

export const generateBase64FromImage = imageFile => {
  const reader = new FileReader();
  const promise = new Promise((resolve, reject) => {
    reader.onload = e => {
      console.log(e.target);
      return resolve(e.target.result);
    }
    reader.onerror = err => {
      // console.log(err);
      return reject(err);
    }
  });

  reader.readAsDataURL(imageFile);
  return promise;
};


export const generateBase64ImageData = imageFile => {
  const reader = new FileReader();
  const promise = new Promise((resolve, reject) => {
    reader.onload = async (e) => {
      console.log(e.target);

      var image = new Image()
      image.src = e.target.result
      await image.decode();
      
      // console.log(imageFile);
      // console.log('decodedImage', image.width, image.height);

      return resolve({
        fileName: imageFile.name,
        height: image.height,
        width: image.width,
        size: imageFile.size,
        fileExtention: imageFile.name.split('.').pop(),
        base64: e.target.result,
      });
    }
    reader.onerror = err => {
      // console.log(err);
      return reject(err);
    }
  });

  reader.readAsDataURL(imageFile);
  return promise;
};

export const isImageFile = (fileType) => {
  if (
    fileType === 'png' ||
    fileType === 'jpg' ||
    fileType === 'jpeg' ||
    fileType === 'webp'
  ) {
    return true
  } else {
    return false
  }
}

export const isVideoFile = (fileType) => {
  if (
    fileType === 'mp4' ||
    fileType === 'webm'
  ) {
    return true;
  } else {
    return false;
  }
}

export const makeQrcode = (textData) => {
  return new Promise((resolve, reject) => {
    QRCode.toDataURL(textData, {
      margin: 2,
    })
      .then(url => {
        // console.log(url);
        resolve(url);
      })
      .catch(err => {
        // console.error(err);
        reject(err);
      })
  });
}


// export const resizeImageFile = (file, fileType) =>
//   new Promise((resolve) => {
//     let quality = 100;

//     //4MB image file
//       if (file.size >= 4000000) {
//         quality = 90;
//       }
//     //8MB image file
//       if (file.size > 8000000) {
//         quality = 85;
//       }

//       Resizer.imageFileResizer(
//         file,
//         1400,
//         1400,
//         fileType,
//         quality,
//         0,
//         (uri) => {
//           resolve(uri);
//         },
//         "blob"
//       );
//   });

export const createCompressedImage = (file) => {
  return new Promise((resolve, reject) => {
    const image = file;

    let quality = 0.8;
    if (file.size > 3 * 10**6) {
      quality = 0.6;
    }
    // console.log('quality', quality);

    new Compressor(image, {
      quality: quality, // 0.6 can also be used, but its not recommended to go below.
      maxHeight: 1400,
      maxWidth: 1400,
      success: (compressedResult) => {
        // compressedResult has the compressed file.
        // Use the compressed file to upload the images to your server.        
        // setCompressedFile(res)
        console.log('compressedResult', compressedResult);
        resolve(compressedResult);
      },
    });
  });
}
export const checkFileNumberLimit = (totalFileNumber) => {
  if (totalFileNumber <= 6) {
    return true;
  }
  return false;
}

export const checkFileSizesLimit = (fileList) => {
  const resultList = [];

  for (const file of fileList) {
    if (file.size < 1024 * 1024 * 5) {
    // if (file.size < 1024 * 1024 * 1) {
      resultList.push(file.size);
    }
  }

  if (resultList.length === fileList.length) {
    return true;
  } else {
    return false;
  }
};


export const isVideoUploaded = fileList => {
  const videoFiles = [];

  for (const file of fileList) {
    if (file.type.split('/')[0] === 'video') {
      videoFiles.push(file.type);
    }
  }

  if (videoFiles.length > 0) {
    return true;
  } else {
    return false;
  }
};


export const isPerviousVideoExist = pathList => {
  const videoFiles = [];

  for (const path of pathList) {
    const fileType = path.split('.')[path.split('.').length -1];
    if (fileType === 'mp4' || fileType === 'webm') {
      videoFiles.push(path);
    }
  }

  if (videoFiles.length > 0) {
    return true;
  } else {
    return false;
  }
};