import ImageDAO from '../dao/image.dao.js';

class ImageService {
  constructor() {
    this.imageDAO = new ImageDAO();
  }

  async saveImage(images) {
    try {
      // Attempt to save the images in bulk  
      const savedImages = await this.imageDAO.bulkCreate(images);
      
      // Return a success response with the saved images
      return {
        success: true,
        message: 'Images saved successfully',
        payload: savedImages,
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

export default ImageService;