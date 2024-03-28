import image from "../../components/Image/Image";
import { 
  createCompressedImage,
  generateBase64FromImage, 
} from "../image";

export const createImagePreviews = async (files) => {
  try {

    const imageFiles = [];
    const b64Images = [];
    
    for (const file of files) {
      let image = file;
  
      const fileType = file.name.split('.')[file.name.split('.').length -1].toLowerCase();
  
      if (
        file.type.split('/')[0] === 'image' 
        // && file.size > 1000 * 10**3 
        && fileType !== 'gif'
        ) {
  
        // const compImg = await createCompressedImage(file);
        const compImg = await createCompressedImage(file, 0.8, 500, 500);
        
        if (compImg && compImg.size < file.size) {
          image = new File([compImg], file.name, {type: file.type, lastModified: Date.now()});
          console.log('compImg', compImg);
          // console.log('compFile', compFile);
        }
  
        if (image && image.size >= file.size) {
          image = file;
        }
  
      }

      // console.log(image);
  
      imageFiles.push(image);
      
      
      // generateBase64ImageData(file)
      // generateBase64ImageData(image)
      const b64Img = await generateBase64FromImage(image);
      // console.log(b64Img);
      b64Images.push(b64Img);

      // generateBase64FromImage(image)
      //   .then(data => {
      //     // console.log(data);
  
      //     b64Images.push(data);
      //     // this.setState({ imagePreviews: b64Images });
      //     // console.log(b64Images);
      //     // setFilePreviews(b64Images);
      //   })
      //   .catch(err => {
      //     console.log(err);
      //     // setFilePreviews([]);
      //     // this.setState({ imagePreviews: [] });
      //   });
    }
  
    // return b64Images;
    return { 
      b64Images: b64Images, 
      imageFiles: imageFiles,
    };
  } catch(err) {
    console.log(err);
    throw err;
  }
  
};