import axios from "axios";

export const talkFileUpload = async (url, token, files) => {
  try {
    const formData = new FormData();

    formData.append('files', files);

    const result = await axios.request({
      method: 'POST',
      url: url + `/file-upload`,
      data: formData,
      headers: {
        Authorization: 'Bearer ' + token,
      },
      onUploadProgress: (p) => {
        console.log('onUploadProgress', (p.loaded/p.total*100).toFixed(0), p); 
        // this.setState({
        //     uploadProgress: p.loaded / p.total * 100
        // });
      }
    });

    console.log(result);

    return result;
    
    // const result = await fetch(url + `/file-upload`, {
    //   method: 'POST',
    //   headers: {
    //     Authorization: 'Bearer ' + token,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     destUserId: destUserId,
    //   }),
    // });

    // const resData = await result.json();

    // console.log(result, resData);

    // if (!result.ok) {
    //   throw new Error('error occured');
    // }

    // return resData;
  } catch(err) {
    console.log(err);
    throw err;
  }
};