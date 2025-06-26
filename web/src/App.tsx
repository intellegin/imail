import { BrowserRouter } from 'react-router-dom'

import { AuthProvider } from './contexts/AuthContext'
import { NavigationNotificationCountProvider } from './contexts/NavigationNotificationCountContext'
import { AppRoutes } from './router'

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavigationNotificationCountProvider>
          <AppRoutes />
        </NavigationNotificationCountProvider>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
