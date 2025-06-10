'use client'

import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from '../store'
import { LanguageInitializer } from '../components/ui/LanguageSelector'

export function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <LanguageInitializer>
          {children}
        </LanguageInitializer>
      </PersistGate>
    </Provider>
  )
}
