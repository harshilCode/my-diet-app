import React from 'react'
import SidebarComponent from './Sidebar';

function Dashboard() {
  // const navigate = useNavigate();
  // const handle = () => {
  //   logout();
  //   navigate("/");
  // }
  return (
    <div>
      <SidebarComponent />

      {/* <button onClick={handle}>Sign out</button> */}
    </div>
  )
}

export default Dashboard