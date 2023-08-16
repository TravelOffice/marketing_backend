import { OperationTypeNode } from 'graphql';

export interface AppSyncAuthorizerEvent {
    authorizationToken: string;
    requestContext: {
        apiId: string;
        accountId: string;
        requestId: string;
        queryString: string;
        operationName?: string;
        variables: { [key: string]: any };
    };
}

export interface AppSyncResolverResultContext {
    [name: string]: any;
  }

export interface AppSyncAuthorizerResult {
    isAuthorized: boolean;
    resolverContext?: AppSyncResolverResultContext;
    deniedFields?: string[];
    ttlOverride?: number;
}

export type AppSyncOperationType = OperationTypeNode;

export interface AppSyncQueryOperation {
    operationType: AppSyncOperationType,
    operationName?: string,
    queryName: string,
}

// TODO: Need to add more events to the whitelist
export const AppSyncWhiteListOperation = [
  'Deepdish:Connect', // AppSync subscription connecting event
];
