//source from https://www.youtube.com/watch?v=V1nJ7ZJ_o44
const AWS = require('aws-sdk')
const s3 = new AWS.S3()
const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    let statusCode = 0;
    let responseBody = '';
    const {name} = event.Records[0].s3.bucket;
    const {key} = event.Records[0].s3.object;

    const getParms = {
        Bucket: name,
        Key: key
    };

    try {
        //var origimage = await s3.getObject(params).promise();
        const s3Data = await s3.getObject(getParms).promise();
        const usersStr = s3Data.Body.toString();
        const usersJSON = JSON.parse(usersStr);
        console.log('Users ::: ${usersStr}');

        await Promise.all(usersJSON.map(async user => {
            const {id, firstname, lastname} = user;
            const putParams = {
                TableName: "roddbtable77",
                Item: {
                    id: id,
                    firstname: firstname,
                    lastname: lastname
                }
            };
            await documentClient.put(putParams).promise();
        }));
        
            //const {id, firstname, lastname} = usersJSON[0];
    responseBody = 'Sucess adding data';
    statusCode = 201;

     } catch (err) {
        responseBody = 'Error adding data';
     statusCode = 403;  
  }
    
    const response = {
        statusCode: statusCode,
        body: responseBody
    };
    return response;
};
