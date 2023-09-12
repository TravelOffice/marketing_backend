import { CreateTourPostDto } from './CreateTourPostDto';
import { TourPostStatus } from '../models/TourPostStatus';

export type UpdateTourPostDto = CreateTourPostDto & {
    status: TourPostStatus
};
