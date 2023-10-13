import { dynamoProvider, helper } from 'core';
import { getAwsSecretValue } from 'get-env';
import { CreateKpiSettingDto } from '../models/dto/CreateKpiSettingDto';
import { KpiPeriod } from '../models/kpi/KpiPeriod';
import { KpiSetting } from '../models/kpi/KpiSetting';
import { OrgKpiMetric } from '../models/kpi/OrgKpiType';
import { TENANT_INDEX } from '../utils/constants';
import { KpiSettingRepository } from './interfaces/KpiSettingRepository';

export default class KpiSettingRepositoryImpl implements KpiSettingRepository {
  create = async (tenant: string, kpiSetting: CreateKpiSettingDto) => {
    const settingTable = await getAwsSecretValue('DYNAMO_SETTING_TABLE');
    const {
      kpiMetric, kpiValue, kpiPeriodType, period, description,
    } = kpiSetting;
    const { start, end } = period;
    const pk = `${TENANT_INDEX}#${tenant}#${kpiMetric}`;
    const sk = `${start}#${end}`;
    const now = Date.now();
    const setting: Partial<KpiSetting> = {
      start,
      end,
      description,
      kv: kpiValue,
      km: kpiMetric,
      kpt: kpiPeriodType,
      createdAt: now,
      updatedAt: now,
    };
    await dynamoProvider.putItem(
      settingTable,
      pk,
      sk,
      setting,
    );

    return setting;
  };

  get = async (tenant: string, metricName: OrgKpiMetric, period: KpiPeriod) => {
    const settingTable = await getAwsSecretValue('DYNAMO_SETTING_TABLE');
    const pk = `${TENANT_INDEX}#${tenant}#${metricName}`;
    const sk = `${period.start}#${period.end}`;
    const kpiSetting = await dynamoProvider.getItem<KpiSetting>(settingTable, pk, sk);
    if (!kpiSetting) {
      return undefined;
    }
    return helper.excludeDataFromObject(kpiSetting);
  };

  updateKpiSettingTarget = async (
    tenant: string,
    metricName: OrgKpiMetric,
    period: KpiPeriod,
    newTargetValue: number,
  ) => {
    const settingTable = await getAwsSecretValue('DYNAMO_SETTING_TABLE');
    const { start, end } = period;
    const pk = `${TENANT_INDEX}#${tenant}#${metricName}`;
    const sk = `${start}#${end}`;
    const updatedAt = Date.now();
    const { Attributes: kpiSetting } = await dynamoProvider.updateItemWithSetExpression(
      settingTable,
      pk,
      sk,
      {
        updatedAt,
        kv: newTargetValue,
      },
    );
    if (!kpiSetting) {
      return undefined;
    }
    return helper.excludeDataFromObject(kpiSetting) as Partial<KpiSetting>;
  };
}
