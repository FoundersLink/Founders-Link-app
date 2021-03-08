import AWS from 'aws-sdk';
import fs from 'fs';


/// Connect to AWS S3
const s3 = new AWS.S3({
    accessKeyId: process.env.LC_AWS_ACCESS_ID,
    secretAccessKey: process.env.LC_AWS_SECRET_KEY,
    region: process.env.AWS_REGION
});


export default function uploadFile({ file: file }) {
    console.log(file);

    // fs.readFile(fileName, (err, data) => {
    //     if (err) throw err;
    //     const params = {
    //         Bucket: process.env.LC_BUCKET_NAME, // Bucket name,
    //         Key: fileName,
    //         Body: JSON.stringify(data, null, 2)
    //     };

    //     s3.upload(params, function(s3Err, fileData) {
    //         if (s3Err) throw s3Err;
    //         console.log(`File upload successfully at ${fileData.Location}`);
    //     })
    // })
}




