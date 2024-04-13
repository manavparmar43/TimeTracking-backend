import multer from 'multer';
import path from 'path';
import { v4 as uuid } from 'uuid';
import fs from 'fs';

const multerStorage = multer.diskStorage({
  destination: function (_req: any, _file: any, cb: any) {
    const dir = './public/uploads/screenshots';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, './public/uploads/screenshots');
  },
  filename: function (_req: any, file: any, cb: any) {
    const pathStr = `${uuid()}${path.extname(file.originalname)}`;
    cb(null, pathStr);
  },
});

const multerFilter = (req: any, file: any, cb: any) => {
  if (
    !file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/) &&
    !(file.mimetype === 'image/png' || file.mimetype === 'image/jpeg')
  ) {
    req.fileValidationError = 'Only image files are allowed!';
    return cb(null, false);
  } else {
    cb(null, true);
  }
};
const uploadScreenshots = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export default uploadScreenshots;
