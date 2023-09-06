import { CognitoUser } from '../../models/CognitoUser';
import { LinkedLeadOrTourInfo } from '../../models/LinkedLeadOrTourInfo';

export interface GetLinkedLeadOrTourInfoOnMarketplaceUseCase {
  invoke(
    currentUser: CognitoUser,
    targetId: string, // Can be lead id or tour template id
  ): Promise<LinkedLeadOrTourInfo | undefined>,
}
