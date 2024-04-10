const fs = require('fs')
const sharp = require('sharp')

const imageProcessing = async (req, res) => {
    fs.access('./uploads', (err) => {
        if (err) {
            fs.mkdir('./uploads')
        }
    })
    const formattedName = req.file.originalname.split(' ').join('-');

    // Generate a unique filename with current date prefix
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const filename = `${year}-${month}-${day}-${hours}${minutes}${seconds}-${formattedName}`;
    try {
        await sharp(req.file.buffer)
        .resize({width: 615, height: 350})
        .toFile(`./uploads/${filename}`)
        console.log('Image processed successfully:', filename);
        req.processedImage = filename;

    

   
    }
    catch (err) {
        console.log('Error while processing image')
    }
   

}
module.exports = imageProcessing;