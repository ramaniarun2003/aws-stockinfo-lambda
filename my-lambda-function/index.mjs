// Import DynamoDBClient and commands from the AWS SDK v3
import { DynamoDBClient, PutItemCommand, ScanCommand } from '@aws-sdk/client-dynamodb';

// Initialize the DynamoDB client
const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' });  // Set your AWS region

// Define your table name
const tableName = 'stockinfo';

export const handler = async (event) => {
    console.log("Received Event\n" + JSON.stringify(event));

    // Extract parameters directly from the event object
    const { stockid, stockticker, amount, noofshares, company, costbasis, dividend, stockclassification } = event;

    // Check if this is a write (POST) or read (GET) operation
   if (event.httpMethod === 'POST') {
        console.log("Processing POST request...");
        if (stockid && stockticker && amount) {
            return await writeToDynamoDB(event);
        } 
        
    } else if (event.httpMethod === 'GET') {
        return await readAllFromDynamoDB();
    } else {
        return {
            statusCode: 405, // Method Not Allowed
            body: JSON.stringify('Method not supported')
        };
    }
};

// Function to write an item to DynamoDB
async function writeToDynamoDB(data) {
    const params = {
        TableName: tableName,
        Item: {
            stockid: { S: data.stockid },
            company: { S: data.company },
            noofshares: { S: data.noofshares },
            stockticker: { S: data.stockticker },
            costbasis: { S: data.costbasis },
            dividend: { S: data.dividend },
            amount: { S: data.amount },
            stockclassification: { S: data.stockclassification }
        }
    };

    try {
        console.info("Writing Item\n" + JSON.stringify(params));
        const command = new PutItemCommand(params);
        await dynamoDbClient.send(command);
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: `Item with stockid ${data.stockid} inserted successfully.` })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify(`Unable to insert item. Error: ${error.message}`)
        };
    }
}

// Function to read all items from DynamoDB (using ScanCommand)
async function readAllFromDynamoDB() {
    const params = {
        TableName: tableName
    };

    try {
        console.info("Scanning all items in the table.");
        const command = new ScanCommand(params);
        const data = await dynamoDbClient.send(command);

        return {
            statusCode: 200,
            body: JSON.stringify(data.Items) // Returns all items from the table
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify(`Unable to retrieve items. Error: ${error.message}`)
        };
    }
}
