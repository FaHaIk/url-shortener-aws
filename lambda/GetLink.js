const AWS = require('aws-sdk');
let dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async(event) => {

    let _response = "";

    let params = {
        TableName: 'Links',
        Key: {
            ID: event.id
        }
    };

    let result = await dynamodb.get(params).promise();

    if (result.Item !== undefined && result.Item !== null) {
        _response = result
    }

    const response = {
        statusCode: 200,
        body: JSON.stringify(_response),
    };

    return response;
};