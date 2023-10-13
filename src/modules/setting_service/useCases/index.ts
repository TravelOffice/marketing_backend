import CreateKpiSettingUseCaseImpl from './CreateKpiSettingUseCaseImpl';
import GetKpiSettingUseCaseImpl from './GetKpiSettingUseCaseImpl';
import UpdateKpiSettingTargetUseCaseImpl from './UpdateKpiSettingTargetUseCaseImpl';
import { CreateKpiSettingUseCase } from './interfaces/CreateKpiSettingUseCase';
import { GetKpiSettingUseCase } from './interfaces/GetKpiSettingUseCase';
import { UpdateKpiSettingTargetUseCase } from './interfaces/UpdateKpiSettingTargetUseCase';

interface UseCases {
  createKpiSettingUseCase: CreateKpiSettingUseCase,
  getKpiSettingUseCase: GetKpiSettingUseCase,
  updateKpiSettingTargetUseCase: UpdateKpiSettingTargetUseCase,
}

const useCases: UseCases = {
  createKpiSettingUseCase: new CreateKpiSettingUseCaseImpl(),
  getKpiSettingUseCase: new GetKpiSettingUseCaseImpl(),
  updateKpiSettingTargetUseCase: new UpdateKpiSettingTargetUseCaseImpl(),
};

export const {
  createKpiSettingUseCase,
  getKpiSettingUseCase,
  updateKpiSettingTargetUseCase,
} = useCases;
