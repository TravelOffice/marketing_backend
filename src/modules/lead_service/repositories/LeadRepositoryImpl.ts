/* eslint-disable @typescript-eslint/no-unused-vars */
import AWS from 'aws';
import { Lead, LeadStatus } from '../models/Lead';
import { LeadRepository } from './interfaces/LeadRepository';

export default class LeadRepositoryImpl implements LeadRepository {
  get = async (tenantId: string, leadId: string) => undefined;

  create = async (tenantId: string, lead: Lead) => lead;

  update = async (tenantId: string, lead: Lead) => lead;

  delete = async (tenantId: string, leadId: Lead) => { };

  changeAssignee = async (tenantId: string, leadId: string, saleId: string) => undefined;

  changeStatus = async (tenantId: string, leadId: string, status: LeadStatus) => undefined;
}
