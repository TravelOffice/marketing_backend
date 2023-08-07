import S3Provider from './S3Provider';

interface Providers {
  s3Provider: S3Provider,
}

const providers: Providers = {
  s3Provider: new S3Provider(),
};

// eslint-disable-next-line import/prefer-default-export
export const {
  s3Provider,
} = providers;
