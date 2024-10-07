// Import DynamoDBClient and commands from the AWS SDK v3
import { DynamoDBClient, PutItemCommand, GetItemCommand } from '@aws-sdk/client-dynamodb';

// Initialize the DynamoDB client
const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' });  // Set your AWS region

// Define your table name
const tableName = 'stockinfo';

export const handler = async (event) => {
    const stockid = event.stockid;
    const stockticker = event.stockticker;
    const amount = event.amount;
    const noofshares = event.noofshares;
    const company = event.company;
    const costbasis = event.costbasis;
    const dividend = event.dividend;
    const stockclassification = event.stockclassification;
    console.info("Create Items\n" + JSON.stringify(event));


    if (stockid && stockticker && amount) {
        return await writeToDynamoDB(event);
    } else if (stockid) {
        return await readFromDynamoDB(event);
    } else {
        return {
            statusCode: 400,
            body: JSON.stringify('Invalid event. Use "stockid", "stockticker", and "amount" for write; or "messageId" for read.')
        };
    }
};

async function writeToDynamoDB(event) {

const params = {
        TableName: tableName,
        Item: {
            stockid: { S: event.stockid },
            company: { S: event.company },
            noofshares: { S: event.noofshares},
            stockticker: { S:event.stockticker},
            costbasis: { S: event.costbasis},
            dividend: { S: event.dividend},
            amount: { S: event.amount},
            stockclassification: { S: event.stockclassification}
            
        }
    };
    


    try {
        console.info("Put Items\n" + JSON.stringify(params));

        const command = new PutItemCommand(params);
        await dynamoDbClient.send(command);
        return {
            statusCode: 200,
            body: JSON.stringify(`Item with messageId ${params.stockid} inserted successfully.`)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify(`Unable to insert item. Error: ${error.message}`)
        };
    }
}

async function readFromDynamoDB(event) {
    const params = {
        TableName: tableName,
        Key: {
            stockid: { S: event.stockid }
        },
    };

    try {
        const command = new GetItemCommand(params);
        const data = await dynamoDbClient.send(command);
        if (!data.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify(`Item with messageId ${event.stockId} not found.`)
            };
        }
        return {
            statusCode: 200,
            body: JSON.stringify(data.Item)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify(`Unable to read item. Error: ${error.quantity}`)
        };
    }
}
