import { Service } from '../models/booking/Service';

const calculateRevenue = (services: Service[]) => {
  let revenue = 0;
  // Calculate booking total payment when completed booking
  services?.forEach((service: Service) => {
    const payment = (service.price * service.quantity) * (100 + service.tax);
    revenue += payment / 100;
  });
  return revenue;
};

export { calculateRevenue };
