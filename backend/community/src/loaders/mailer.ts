import config from '@/config';
import { IEmail } from '@/interfaces/IEmail';
import { EmailClient, EmailMessage, EmailSendResponse } from '@azure/communication-email';

const connectionString = config.emails.azure_connection_string;
const emailClient = new EmailClient(connectionString);

const generateMessage = (emailMessage: IEmail): EmailMessage => {
  const { sender, subject, text, html, to } = emailMessage;

  return {
    senderAddress: sender,
    content: {
      subject,
      plainText: text,
      html,
    },
    recipients: {
      to,
    },
  };
};

const sendEmail = async (message: EmailMessage) => {
  const poller = await emailClient.beginSend(message);
  const response = await poller.pollUntilDone();
  return response;
};

export default { generateMessage, sendEmail };
