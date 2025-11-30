'use client';

import { Provider } from 'react-redux';
import { useEffect,  useState } from 'react';
import { makeStore } from '../redux/store';

export default function Providers({ children }) {
  const [store, setStore] = useState(null);

  useEffect(() => {
    const footballeurInfo = typeof window !== 'undefined' && localStorage.getItem('footballeurInfo')
      ? JSON.parse(localStorage.getItem('footballeurInfo'))
      : null;

       const proprietaireInfo =
      typeof window !== 'undefined' && localStorage.getItem('proprietaireInfo')
        ? JSON.parse(localStorage.getItem('proprietaireInfo'))
        : null;

    const preloadedState = {
      footballeurSignin: { footballeurInfo },
      footballeurRegister: {},  

        proprietaireSignin: { proprietaireInfo },
      proprietaireRegister: {},
    
    };

    const newStore = makeStore(preloadedState);
    setStore(newStore);
  }, []);

  if (!store) return null; // ou spinner de chargement

  return <Provider store={store}>{children}</Provider>;
}

// 'use client'

// import { Provider } from 'react-redux'
// import { store } from '../redux/store'

// export default function Providers({ children }) {
//   return <Provider store={store}>{children}</Provider>
// }