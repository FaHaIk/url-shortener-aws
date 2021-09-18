const { nanoid } = require('nanoid');
const AWS = require('aws-sdk');
let dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async(event) => {

    let respObject = {
        ID: nanoid(7),
        expirationDate: event.expirationDate,
        isPublic: event.isPublic,
        longLink: event.longLink
    };

    let params = {
        TableName: 'Links',
        Key: {
            ID: respObject.ID
        }
    };

    let result = await dynamodb.get(params).promise();

    if (result.Item !== undefined || result.Item === null) {
        respObject.ID = nanoid(7);
    }

    let paramsInsert = {
        TableName: 'Links',
        Item: respObject
    };

    await dynamodb.put(paramsInsert).promise();

    const response = {
        statusCode: 200,
        body: "https://main.d3cdca1g1crqo4.amplifyapp.com/" + respObject.ID,
    };
    return response;
};