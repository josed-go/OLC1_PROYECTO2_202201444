import { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import SideBar from './components/SideBar'
import Content from './components/Content'
import Menu from './components/Menu'

const App = ()=> {
  return (
    <>
    <div className='flex flex-row h-screen'>
      <SideBar />
      <div className="flex flex-col h-screen w-screen">
        {/* <Menu/> */}
        <Content />
      </div>
    </div>
    </>
  )
}

export default App
