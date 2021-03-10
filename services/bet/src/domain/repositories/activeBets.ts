import AWS from 'aws-sdk';
import { UserBet } from '../bet';
import { repositoryError } from '../error/util';

const TableName = 'active-bets';
const client = new AWS.DynamoDB.DocumentClient();

export function createBet(bet: UserBet): Promise<void> {
  return client
    .put({
      TableName,
      Item: { ...bet, scored: false },
    })
    .promise()
    .then((_) => Promise.resolve())
    .catch(repositoryError('Unable to place bet'));
}

export function deleteBet(userId: string): Promise<void> {
  return client
    .delete({
      TableName,
      Key: {
        userId,
      },
    })
    .promise()
    .then(() => Promise.resolve())
    .catch(repositoryError(`Error delete active bets for user ${userId}`));
}

export function updateBetScore({ userId }: UserBet, scored: boolean): Promise<void> {
  return client
    .update({
      TableName,
      Key: {
        userId,
      },
      UpdateExpression: 'set scored = :s',
      ExpressionAttributeValues: {
        ':s': scored,
      },
    })
    .promise()
    .then((_) => Promise.resolve())
    .catch(repositoryError('Unable to update bet score'));
}

export function hasActiveBet(userId: string): Promise<boolean> {
  return client
    .get({
      TableName,
      Key: {
        userId,
      },
    })
    .promise()
    .then((data) => Object.keys(data).length !== 0)
    .catch(repositoryError('Error checking active bets'));
}

export function getActiveBet(userId: string): Promise<UserBet | null> {
  return client
    .get({
      TableName,
      Key: {
        userId,
      },
    })
    .promise()
    .then((data) => (data.Item ? (data.Item as UserBet) : null))
    .catch(repositoryError('Error getting active bets'));
}
