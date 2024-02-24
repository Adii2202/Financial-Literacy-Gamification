import React, {createContext, useState} from 'react';

export const PollContext = createContext();
const PollProvider = ({children}) => {
  const [question, setQuestion] = useState('');

  return (
    <PollContext.Provider value={[question, setQuestion]}>
      {children}
    </PollContext.Provider>
  );
};

export default PollProvider;
