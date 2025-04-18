import Image from '../database/models/Image.model.js';

class ImageDAO {
  async bulkCreate(images) {
    try {
      // Attempt to save the images in bulk  
      const savedImages = await Image.bulkCreate(images);
      const imageUrls = savedImages.map(image => image.url);

      // Return a success response with the URLs of the saved images
      return {
        success: true,
        message: 'Images saved successfully',
        payload: imageUrls,
      };
    } catch (error) {
      // Return an error response if image saving fails
      return {
        success: false,
        error: {
          code: 500,
          message: 'Failed to save images',
        },
      };
    }
  }
}

export default ImageDAO;