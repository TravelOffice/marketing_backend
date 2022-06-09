import cors from 'cors';
import express, { Request, Response, NextFunction  } from 'express';
import compression from 'compression';
import {
  createEmployeeUseCase, deleteEmployeeUseCase, getEmployeeListUseCase, getEmployeeUseCase,
  updateEmployeeUseCase,
} from './useCases';
import wrapResponse from './utils/wrapResponse';
import { FAILED, SUCCESS } from './utils/constants';

const app = express();

app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', ['*']);
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`Request to ${req.method}: ${req.url}`);
  next();
});

app.get('/', async (req: Request, res: Response) => {
  try {
    const employees = await getEmployeeListUseCase.invoke();
    res.json(wrapResponse(SUCCESS, employees));
  } catch {
    res.json(wrapResponse(FAILED, undefined));
  }
});

app.post('/', async (req: Request, res: Response) => {
  try {
    // TODO: Validate request body if needed
    const employee = await createEmployeeUseCase.invoke(req.body);
    res.json(wrapResponse(SUCCESS, employee));
  } catch {
    res.json(wrapResponse(FAILED, undefined));
  }
});

app.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // TODO: Convert the `id` to integer if needed
    const employee = await getEmployeeUseCase.invoke(id);
    res.json(wrapResponse(SUCCESS, employee));
  } catch {
    res.json(wrapResponse(FAILED, undefined));
  }
});

app.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // TODO: Convert the `id` to integer if needed
    // TODO: Validate request body if needed
    const employee = await updateEmployeeUseCase.invoke(id, req.body);
    res.json(wrapResponse(SUCCESS, employee));
  } catch {
    res.json(wrapResponse(FAILED, undefined));
  }
});

app.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // TODO: Convert the `id` to integer if needed
    await deleteEmployeeUseCase.invoke(id);
    res.json(wrapResponse(SUCCESS, {}));
  } catch {
    res.json(wrapResponse(FAILED, undefined));
  }
});

export default app;
