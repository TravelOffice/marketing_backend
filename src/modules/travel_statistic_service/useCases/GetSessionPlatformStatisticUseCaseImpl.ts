import { GetSessionPlatformStatisticUseCase } from './interfaces/GetSessionPlatformStatisticUseCase';
import { tenantChatStatisticRepository } from '../repositories';
import { getDateFromTimestamp } from '../utils/utils';
import { ConversationPlatformStatistic, ConversationStatistic } from '../models/ConversationStatistic';

export default class GetSessionPlatformStatisticUseCaseImpl
implements GetSessionPlatformStatisticUseCase {
  invoke = async (
    tenant: string,
    startTime: string,
    endTime: string,
  ) => {
    // eslint-disable-next-line max-len
    const conversationStatistic = await tenantChatStatisticRepository.getConversationPlatformStatistic(
      tenant,
      startTime,
      endTime,
    );

    return this.transformConversationStatisticData(conversationStatistic);
  };

  /**
   * Transform the ConversationStatistic data to the format that the client expects.
   *
   * @param data - The ConversationStatistic data.
   * @returns - The transformed data with format [{ name: string, data: number[], date: number[] }]
   */
  private async transformConversationStatisticData(data: Array<ConversationStatistic>) {
    const countedData = data.reduce((transformedData: {
      [key: string]: Array<{
        name: string,
        count: number
      }>
    }, item) => {
      const { lsi1: createdAt, lsi2: platform } = item;

      if (!createdAt || !platform) return transformedData;

      const date = getDateFromTimestamp(Number(createdAt));

      // if the date is not existed in the transformedData, add it
      if (!transformedData[date]) {
        // eslint-disable-next-line no-param-reassign
        transformedData[date] = [{
          name: platform,
          count: 1,
        }];
      } else {
        // if the date is existed in the transformedData, check if the platform is existed
        const index = transformedData[date].findIndex((statistic) => statistic.name === platform);
        // if the platform is not existed, add it
        if (index === -1) {
          transformedData[date].push({
            name: platform,
            count: 1,
          });
        } else {
          // eslint-disable-next-line no-param-reassign
          transformedData[date][index].count += 1;
        }
      }

      return transformedData;
    }, {});

    const groupByPlatform: Array<ConversationPlatformStatistic> = [];
    Object.entries(countedData).forEach(([key, current]) => {
      current.forEach((item) => {
        const { name, count } = item;
        const statistic = groupByPlatform.find(((s) => s.name === name));
        if (!statistic) {
          groupByPlatform.push({
            name,
            data: [count],
            date: [key],
          });
        } else {
          statistic.data.push(count);
          statistic.date.push(key);
        }
      });
    });

    // sort the data by date
    groupByPlatform.forEach((item) => {
      item.date.sort();
      item.data.sort((a, b) => {
        const dateA = new Date(Date.parse(item.date[item.data.indexOf(a)]));
        const dateB = new Date(Date.parse(item.date[item.data.indexOf(b)]));
        return dateA.getMilliseconds() - dateB.getMilliseconds();
      });
    });

    return groupByPlatform;
  }
}
