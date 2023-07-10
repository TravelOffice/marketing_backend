import Helper from './helper';
import Logger from './logger';

interface Utils {
  helper: Helper,
  logger: Logger,
}

const utils: Utils = {
  helper: new Helper(),
  logger: new Logger(),
};

// eslint-disable-next-line import/prefer-default-export
export const {
  helper,
  logger,
} = utils;

export * from './constants';
