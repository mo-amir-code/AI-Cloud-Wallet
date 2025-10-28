import multer from "multer"

const storage = multer.memoryStorage();

// File filter to accept only audio files
const fileFilter = (req: any, file: any, cb: any) => {
    const allowedMimes = [
        'audio/wav',
        'audio/wave',
        'audio/x-wav',
        'audio/mpeg',
        'audio/mp3',
        'audio/webm',
        'audio/ogg',
        'audio/m4a'
    ];

    console.log("MULTER: ", file)

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only audio files are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
});

export {
    upload,
    fileFilter
}