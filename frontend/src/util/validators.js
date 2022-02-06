export const required = value => value.trim() !== '';

export const length = config => value => {
  let isValid = true;
  if (config.min) {
    isValid = isValid && value.trim().length >= config.min;
  }
  if (config.max) {
    isValid = isValid && value.trim().length <= config.max;
  }
  return isValid;
};

export const email = value =>
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
    value
  );

export const validComplexPassword = value => {
  //Minimum 8 maximum 20 characters, at least one uppercase letter, one lowercase letter, one number and one special character:
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(
    value
  );
}

export const acceptableFile = value => {
  const fileType = value.split('.')[value.split('.').length -1].toLowerCase();
  console.log(fileType);
  if (
    fileType === 'png' || 
    fileType === 'jpg' || 
    fileType === 'jpeg' ||
    fileType === 'webp' ||
    fileType === 'mp4' ||  
    fileType === 'webm' 
  ) {
    return true;
  } else {
    return false;
  }
}



export const acceptImageType = ['png', 'jpg', 'jpeg', 'webp', 'gif'];
export const acceptVideoType = ['mp4', 'webm'];

export const acceptableFiles = fileList => {
  const passlist = [];

  for (const file of fileList) {
    const fileType = file.name.split('.')[file.name.split('.').length -1].toLowerCase();
    console.log(fileType);

    const acceptTypes = acceptImageType.concat(acceptVideoType);
    
    let matchType;
    if (fileType) {
      matchType = acceptTypes.find(type => type === fileType.toLowerCase());
    }
    console.log(matchType);

    if (
      // fileType === 'png' || 
      // fileType === 'jpg' || 
      // fileType === 'jpeg' ||
      // fileType === 'webp' ||
      // fileType === 'mp4' ||  
      // fileType === 'webm' 
      matchType
    ) {
      // return true;
      passlist.push(file.name);
    }
  }

  if (passlist.length === fileList.length) {
    return true;
  } else {
    return false;
  }
};

export const acceptableUserImageFile = value => {
  const fileType = value.split('.')[value.split('.').length -1].toLowerCase();
  console.log(fileType);
  if (
    fileType === 'png' || 
    fileType === 'jpg' || 
    fileType === 'jpeg'
  ) {
    return true;
  } else {
    return false;
  }
}