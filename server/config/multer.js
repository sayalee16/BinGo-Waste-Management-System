import multer from "multer";

const storage = multer.memoryStorage(); // store file in memory
const upload = multer({ storage });

export default upload;
