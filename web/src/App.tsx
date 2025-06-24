import { BrowserRouter } from 'react-router-dom'

import { NavigationNotificationCountProvider } from './contexts/NavigationNotificationCountContext'
import { RequireAuthRedirectProvider } from './contexts/RequireAuthRedirect'
import { AppRoutes } from './router'

const App = () => {
  return (
    <BrowserRouter>
      <RequireAuthRedirectProvider>
        <NavigationNotificationCountProvider>
          <AppRoutes />
        </NavigationNotificationCountProvider>
      </RequireAuthRedirectProvider>
    </BrowserRouter>
  )
}

export default App
