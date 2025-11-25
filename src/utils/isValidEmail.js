export const isValidEmail = (email) => {
  /* eslint-disable no-useless-escape */
  const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  if (email && email.match(pattern)) return true;

  return false;
};

export default isValidEmail;
