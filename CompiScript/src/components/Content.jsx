import React, { useRef, useState } from 'react';
import Editor from '@monaco-editor/react'
import ArrowDown from './ArrowDown';
import ArrowUp from './ArrowUp';
import { saveAs } from 'file-saver';

const Content = ({archivos, setArchivos, cantidad, setCantidad, actual, setActual, editorRef, consolaRef}) => {

    // let data = fs.readFileSync(filesList) 
    // let archivos = JSON.parse(data)

    // const [ archivos, setArchivos ] = useState([])
    // const [ cantArchivos, setCantArchivos ] = useState(1)
    const inputRef = useRef()
    const [ archivoSeleccionado, setArchivoSeleccionado ] = useState(null)
    const [abierto, setAbierto] = useState(false)
    // const editorRef = useRef(null)
    // const consolaRef = useRef(null)

    const nuevoArchivo = (nombre, content) => {
        var file = {
            "id": cantidad,
            "name": nombre,
            "ruta": "src/",
            "content": content
        }
        console.log("aqui")
        archivos.push(file)
        setAbierto(abierto => !abierto)
        setCantidad()
        editorRef.current.setValue(content)
        setActual(file)
        // setCantidad(cantArchivos + 1)
    }

    const handleOnChange = (event) => {
        if(event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0]
            const fileReader = new FileReader()

            fileReader.readAsText(file)

            fileReader.onload = () => {
                nuevoArchivo(file.name, fileReader.result)
            }

            fileReader.onerror = () => {
                console.log(fileReader.error)
            }
        }
    }

    const onChooseFile = () => {
        inputRef.current.click()
    }


    const guardarArchivo = () => {
        const blob = new Blob([editorRef.current.getValue()], { type: 'text/plain;charset=utf-8' })
        const newArchivos = archivos.map(archivo => {
            if(archivo.name == actual.name) {
                return {
                    ...archivo,
                    content: editorRef.current.getValue(),

                }
            }else{
                return archivo
            }
        })
        setArchivos(newArchivos)
        setAbierto(abierto => !abierto)
    }

    const handleEditor = (editor, id) => {
        if(id == "editor" ) {
            editorRef.current = editor
        }else if(id == "consola") {
            consolaRef.current = editor
        }
    }

    const interpretar = () => {
        var entrada = editorRef.current.getValue()
        fetch('http://localhost:4000/analizar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ entrada: entrada }),
        }).then(response => response.json())
        .then(data => {
            consolaRef.current.setValue(data.respuesta)
        })
        .catch((error) => {
            alert("No sale compi")
            console.error('Error:', error)
        })
    }
    
    return (
        <>
            <div className='w-full bg-gris h-10'>
                <section className='flex flex-row justify-around divide-x h-full align-middle text-white content-center items-center'>
                        <p className='flex flex-col cursor-pointer text-lg text-center w-full h-full hover:bg-gris-50 align-middle justify-center'
                            onClick={() => setAbierto((prev) => !prev)}
                        >Archivo</p>
                        <p className='flex flex-col cursor-pointer text-lg text-center w-full h-full hover:bg-gris-50 align-middle justify-center'>Reportes</p>
                        <p className='flex flex-col cursor-pointer text-lg text-center w-full h-full hover:bg-gris-50 align-middle justify-center'
                            onClick={() => interpretar()}
                        >Ejecutar</p>
                </section>
                {
                    abierto && (
                        <div className='bg-gris-50 absolute z-50 w-1/4 flex flex-col text-white'>
                            <button className='hover:bg-gris h-8'
                                onClick={() => nuevoArchivo("Nuevo archivo "+cantidad, "")}
                            >Nuevo archivo</button>
                            <button className='hover:bg-gris h-8' onClick={() => onChooseFile()}>Abrir archivo</button>
                            <input type='file' className='hover:bg-gris h-8' ref={inputRef} style={{ display: "none" }} onChange={handleOnChange} multiple={false}/>
                            <button className='hover:bg-gris h-8'>Guardar archivo</button>
                                {/* // onClick={() => guardarArchivo()} */}
                            {/* // >Guardar</input> */}
                        </div>
                    )
                }
            </div>
            <div className='w-full bg-white flex flex-col h-5/6'>
                <section className='w-full'>
                    <Editor 
                        height="63vh" 
                        width="100%"
                        theme='vs-dark'
                        defaultLanguage='cpp'
                        defaultValue=''
                        onMount={(editor) => handleEditor(editor, "editor")}
                    />
                </section>
                
                <section className='w-full'>
                    <p className='bg-gris text-white font-bold text-center h-7 align-middle'>Consola</p>
                    <Editor 
                            height="30vh" 
                            width="100%"
                            theme='vs-dark'
                            defaultLanguage='cpp'
                            defaultValue=''
                            options={{readOnly: true}}
                            onMount={(editor) => handleEditor(editor, "consola")}
                    />
                </section>
            </div>
        </>
    )
    
}
    
export default Content;