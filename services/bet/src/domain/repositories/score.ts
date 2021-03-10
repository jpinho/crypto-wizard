import AWS from 'aws-sdk';
import { UserScore } from '../user';
import { repositoryError } from '../error/util';

const TableName = 'score';
const client = new AWS.DynamoDB.DocumentClient();

export function getScore(userId: string): Promise<UserScore | null> {
  return client
    .get({
      TableName,
      Key: { userId },
    })
    .promise()
    .then((data) => (data.Item ? (data.Item as UserScore) : null))
    .catch(repositoryError('Failed to get user score for user ${userId}'));
}

export async function upsertScore(userId: string, scored: boolean) {
  const { score = 0 } = (await getScore(userId)) || {};
  if (score === 0 && !scored) {
    return;
  }

  return client
    .update({
      TableName,
      Key: { userId },
      UpdateExpression: 'ADD score :inc',
      ConditionExpression: 'attribute_not_exists(userId) OR userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
        ':inc': scored ? 1 : -1,
      },
      ReturnValues: 'UPDATED_NEW',
    })
    .promise()
    .catch(repositoryError(`Failed to update score for user ${userId}`));
}
