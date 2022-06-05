export const validateMessage = (error: any, message: any[]) => {
  return message.map((val) => {
    return error === val.split(':')[0] && val.split(':')[1];
  });
};
