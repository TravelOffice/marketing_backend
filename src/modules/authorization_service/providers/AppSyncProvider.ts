import { FieldNode, Kind, parse } from 'graphql';
import { AppSyncAuthorizerResult, AppSyncQueryOperation, AppSyncResolverResultContext } from '../models';

export default class AppSyncProvider {
  // Help function to generate an AppSync authorizer response
  generatePolicy = (
    isAuthorized: boolean,
    deniedFields?: string[],
    ttlOverride?: number,
    context?: AppSyncResolverResultContext,
  ): AppSyncAuthorizerResult => ({
    isAuthorized,
    resolverContext: context,
    deniedFields,
    ttlOverride,
  });

  parseQueryString = (queryString: string): AppSyncQueryOperation => {
    const query = parse(queryString);
    const [queryDefinitions] = query.definitions;
    if (queryDefinitions.kind !== Kind.OPERATION_DEFINITION) {
      throw new Error(`parseQueryString: Only support type [${Kind.OPERATION_DEFINITION}] `);
    }
    // Find the Field selection
    const querySelection = queryDefinitions.selectionSet.selections.find(
      (element) => element.kind === Kind.FIELD,
    );
    if (!querySelection) throw new Error('parseQueryString: Not found any Field in querySelection');
    return {
      operationType: queryDefinitions.operation,
      operationName: queryDefinitions.name?.value,
      queryName: (querySelection as FieldNode).name.value,
    };
  };
}
