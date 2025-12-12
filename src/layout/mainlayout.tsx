import { Outlet } from 'react-router-dom'
import Appbar from './Appbar'
import Drawers from './drawer'

export default function MainLayout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Appbar />

      <div style={{ display: 'flex', flex: 1 , marginTop: '70px'}}>
        <Drawers />
        <div style={{ flex: 1, padding: '16px' }}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
