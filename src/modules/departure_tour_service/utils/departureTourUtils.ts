import { getEnv } from 'get-env';
import { Booking } from '../models/booking/Booking';
import { PaymentVoucher } from '../models/PaymentVoucher';
import { userRepository } from '../repositories';
import { MailTemplate } from '../models/MailTemplate';
import sendEmail from './email';
import { DepartureTour } from '../models/DepartureTour';
import { OPERATOR_MANAGER_ROLE } from './constants';
import TourOperationStatus from '../models/TourOperationstatus';

const calculateRevenueOfDepartureTour = (bookings: Booking[]) => bookings.reduce((
  total,
  booking,
) => total + booking.totalPayment, 0);

const calculateCostOfDepartureTour = (paymentVouchers: PaymentVoucher[]) => paymentVouchers.reduce((
  total,
  paymentVoucher,
) => total + paymentVoucher.amount, 0);

const sendEmailNotiTourStatusChanged = async (
  tenantId: string,
  departureTour: DepartureTour,
  assigneeId: string,
  tourCurrentStatus: TourOperationStatus,
  tourNewStatus: TourOperationStatus,
) => {
  // Notify the change to the operator manager
  const operatorManagers = await userRepository.listByRole(tenantId, OPERATOR_MANAGER_ROLE);
  // Retrieve the user attributes based on the tenantId and assigneeId
  const assignee = await userRepository.getUserAttributes(tenantId, assigneeId);
  const departureTourUrl = `${tenantId}.${getEnv('DEPARTURE_TOUR_URL')}/${departureTour.code}`;
  if (!assignee) {
    throw new Error(`User ${assigneeId} does not exist!`);
  }

  // Send mail to Operator manager
  // TODO: In the future, tenants can configure the mail template
  const mail: MailTemplate = {
    toAddresses: [assignee.email],
    ccAddresses: operatorManagers.map((item) => item.email),
    subject: `Operate departure tour [${departureTour.code}]`,
    text: `The departure tour [${departureTour.code}] has been transited to new state`, // For non-html client
    html: `<p>The operational status of departure tour [${departureTour.code}] has been changed from ${tourCurrentStatus} to ${tourNewStatus}</p><a href="${departureTourUrl}">Details</a>`, // For html client
  };
  await sendEmail(getEnv('NO_REPLY_DEFAULT_EMAIL'), mail);
};

export {
  calculateRevenueOfDepartureTour,
  calculateCostOfDepartureTour,
  sendEmailNotiTourStatusChanged,
};
