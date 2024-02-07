const bucketStorage = require("../../config/firebase.config");
const productModel = require("../../models/product.model");
const { validateProductUpload } = require("../../utils/validateUserInput");
const {
  ref,
  getDownloadURL,
  updateMetadata,
  uploadBytes,
} = require("firebase/storage");

global.XMLHttpRequest = require("xhr2"); // must be used to avoid bug

const uploadProduct = async (req, res, next) => {
  try {
    const { error } = validateProductUpload(req.body);

    if (error) {
      const errorMessage = error.details[0].message.replace(/"/g, ""); // strip out quotes
      return res.status(400).json({
        success: false,
        message: errorMessage,
      });
    }

    //Grab file
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No image provided",
      });
    }

    // Format the filename
    const timestamp = Date.now();
    const name = file.originalname.split(".")[0];
    const type = file.originalname.split(".")[1];
    const fileName = `${name}_${timestamp}.${type}`;

    // Step 1. Create reference for storage and file name in cloud storage
    const imageRef = ref(bucketStorage, `images/${fileName}`);

    // Step 2. Upload the file in the bucket storage
    const uploadImage = await uploadBytes(imageRef, file.buffer);

    // Create file metadata.
    const newMetadata = {
      cacheControl: "public,max-age=2629800000", // 1 month
      contentType: uploadImage.metadata.contentType,
    };

    await updateMetadata(imageRef, newMetadata);

    // Get the image URL.
    const downloadURL = await getDownloadURL(imageRef);

    const {
      productName,
      productDetails,
      productPrice,
      vendorName,
      vendorAddress,
    } = req.body;

    const newProduct = await new productModel({
      vendorId: req.user._id,
      name: productName,
      photo: downloadURL,
      productDetails: productDetails,
      price: productPrice,
      vendorName: vendorName,
      vendorAddress: vendorAddress,
    }).save();

    res.status(201).json({
      success: true,
      message: "Product uploaded successfully",
      payload: { newProduct },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { uploadProduct };
