import Helper from './helper';

interface Utils {
  helper: Helper,
}

const utils : Utils = {
  helper: new Helper(),
};

// eslint-disable-next-line import/prefer-default-export
export const {
  helper,
} = utils;
