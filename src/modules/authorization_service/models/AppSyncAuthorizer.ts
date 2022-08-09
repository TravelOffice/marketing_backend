export interface AppSyncAuthorizerEvent {
    authorizationToken: string;
    requestContext: {
        apiId: string;
        accountId: string;
        requestId: string;
        queryString: string;
        variables: { [key: string]: any };
    };
}

export interface AppSyncAuthorizerResult<TResolverContext = undefined> {
    isAuthorized: boolean;
    resolverContext?: TResolverContext;
    deniedFields?: string[];
    ttlOverride?: number;
}
