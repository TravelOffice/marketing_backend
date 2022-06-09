import { Lead } from '../models/Lead';
import {
  leadRepository,
  userRepository,
  taskRepository,
  noteRepository,
} from '../repositories';
import { CreateLeadUseCase } from './interfaces/CreateLeadUseCase';

export default class CreateLeadUseCaseIpml implements CreateLeadUseCase {
  /**
   * To create lead, there are steps need to do:
   * - Step 1: Get tenant ID from dynamo db
   * - Step 2: Check duplicated phone number
   * - Step 3: Save lead information to dynamo db
   * @return pk, sk and all atributes of Lead
   */
  invoke = async (lead: Lead, userId: string) => {
    const userAttributes = await userRepository.getUserAttributes(userId);
    if (!userAttributes) throw new Error('User not existed!');
    const tenantId = userAttributes.tenant;
    if (!tenantId) throw new Error('User is missing tenant attribute');
    const duplicatedLead = await leadRepository.getById(tenantId, lead.primaryPhoneNumber);
    if (duplicatedLead) {
      throw new Error(`Phone number ${lead.primaryPhoneNumber} already exists`);
    }
    let newLead: Lead = { ...lead };
    if (lead.tasks) {
      const tasks = taskRepository.generateData(lead.tasks, userId, userAttributes.name);
      newLead = { ...lead, tasks };
    }
    if (lead.notes) {
      const notes = noteRepository.generateData(lead.notes, userId, userAttributes.name);
      newLead = { ...lead, notes };
    }
    return leadRepository.createOrUpdate(tenantId, newLead);
  };
}
