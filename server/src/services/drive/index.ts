import { drive_v3 } from "googleapis";
import { DRIVE_FILE_NAME } from "../../config/constants.js";
import { DriveFileType } from "../../types/services/drive/index.js";
import { Readable } from "stream";


const getFileById = async (drive: drive_v3.Drive, fileId: string): Promise<DriveFileType> => {
    const file = await drive.files.get({
        fileId,
        alt: 'media',
    });

    // console.log("File: ", file.data);
    return file.data as DriveFileType
}

const uploadJsonFile = async (drive: drive_v3.Drive, data: DriveFileType): Promise<string> => {

    // The request body for the file to be uploaded.
    const requestBody = {
        name: DRIVE_FILE_NAME,
        fields: 'id name',
        parents: ["appDataFolder"],
    };

    const jsonString = JSON.stringify(data, null, 2);
    const streamData = Readable.from([jsonString])

    // The media content to be uploaded.
    const media = {
        mimeType: 'application/json',
        body: streamData,
    };

    // Upload the file.
    const file = await drive.files.create({
        requestBody,
        media,
    });

    return file.data.id as string;
}

const updateJsonFile = async (drive: drive_v3.Drive, fileId: string, updated_data: DriveFileType) => {

    // The request body for the file to be uploaded.
    const requestBody = {
        name: DRIVE_FILE_NAME,
        fields: 'id name'
    };

    const jsonString = JSON.stringify(updated_data, null, 2);
    const dataStream = Readable.from([jsonString]);

    // The media content to be uploaded.
    const media = {
        mimeType: 'application/json',
        body: dataStream,
    };

    // Upload the file.
    const file = await drive.files.update({
        fileId: fileId,
        requestBody,
        media,
    });

    // Print the ID of the uploaded file.
    console.log('File has been updated!');
}


export {
    uploadJsonFile,
    updateJsonFile,
    getFileById
}