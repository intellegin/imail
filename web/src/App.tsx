import { BrowserRouter } from 'react-router-dom'

import { RequireAuthRedirectProvider } from './contexts/RequireAuthRedirect'
import { AppRoutes } from './router'

const App = () => {
  return (
    <BrowserRouter>
      <RequireAuthRedirectProvider>
        <AppRoutes />
      </RequireAuthRedirectProvider>
    </BrowserRouter>
  )
}

export default App
