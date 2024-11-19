import { v4 as uuidv4 } from 'uuid';
const generateRandomId = () => {
  const randomId = uuidv4()


  return randomId;
};

export default generateRandomId;
