import { useRef, useState } from 'react'
import logo from './logo.svg'
import './App.css'
import SideBar from './components/SideBar'
import Content from './components/Content'
import Menu from './components/Menu'

const App = ()=> {

  const editorRef = useRef(null)
  const consolaRef = useRef(null)
  const [ archivoActual, setArchivoActual ] = useState({})
  const [ archivos, setArchivos ] = useState([])
  const [ cantArchivos, setCantArchivos ] = useState(1)

  const otroArchivo = () => {
    setCantArchivos(cantArchivos + 1)
  }
  
  return (
    <>
    <div className='flex flex-row h-screen'>
      <SideBar getArchivos={archivos} archivos={setArchivos} actual={archivoActual} setActual={setArchivoActual}
        editorRef={editorRef} consolaRef={consolaRef}
      />
      <div className="flex flex-col h-screen w-screen">
        {/* <Menu/> */}
        <Content archivos={archivos} setArchivos={setArchivos} cantidad={cantArchivos} setCantidad={otroArchivo} actual={archivoActual} setActual={setArchivoActual}
            editorRef={editorRef} consolaRef={consolaRef}
        />
      </div>
    </div>
    </>
  )
}

export default App
