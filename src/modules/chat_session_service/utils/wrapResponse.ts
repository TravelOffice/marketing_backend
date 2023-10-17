export default function wrapResponse(message: string, data?: any, hint?: string) {
  return {
    message,
    data,
    hint,
  };
}
