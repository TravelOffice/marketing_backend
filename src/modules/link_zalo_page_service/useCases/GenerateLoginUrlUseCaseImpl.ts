import { zaloPageRepository } from '../repositories';
import { GenerateLoginUrlUseCase } from './interfaces/GenerateLoginUrlUseCase';

export default class GenerateLoginUrlUseCaseImpl implements GenerateLoginUrlUseCase {
  /**
   * To generate zalo login url, there are steps need to do:
   * - Step 1: Generate code verifier, code challenge and state variables
   * - Step 2: Save code verifier and state to dynamodb
   * - Step 3: Generate login url
   * @return Zalo login url
   */
  invoke = async () : Promise<string> => {
    const { codeVerifier, codeChallenge, state } = await zaloPageRepository.generateCodeChallenge();
    await zaloPageRepository.saveCodeVerifierToDynamo(codeVerifier, state);
    return zaloPageRepository.generateLoginUrl(codeChallenge, state);
  };
}
