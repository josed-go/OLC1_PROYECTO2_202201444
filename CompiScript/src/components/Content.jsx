import React, { useRef, useState } from 'react';
import Editor from '@monaco-editor/react'
import ArrowDown from './ArrowDown';
import ArrowUp from './ArrowUp';
import { saveAs } from 'file-saver';
import ModalG from './ModalG'
import Errores from './Errores';
import AST from './AST';

const Content = ({archivos, setArchivos, cantidad, setCantidad, actual, setActual, editorRef, consolaRef}) => {

    // let data = fs.readFileSync(filesList) 
    // let archivos = JSON.parse(data)

    // const [ archivos, setArchivos ] = useState([])
    // const [ cantArchivos, setCantArchivos ] = useState(1)
    const inputRef = useRef()
    const [ archivoSeleccionado, setArchivoSeleccionado ] = useState(null)
    const [abierto, setAbierto] = useState(false)
    const [reportes, setReportes] = useState(false)
    const [open, setOpen] = useState(false)
    const [ nombre, setNombre ] = useState("")
    const [ dot, setDot ] = useState("")
    const [ errores, setErrores ] = useState([])
    const [ contenido, setContenido ] = useState("editor")
    const [ isEditor, setIsEditor ] = useState(true)
    const [ isErrores, setIsErrores ] = useState(false)
    const [ isAST, setIsAST ] = useState(false)
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
        if(nombre !== ""){

            const blob = new Blob([editorRef.current.getValue()], { type: 'text/plain;charset=utf-8' })
            const newArchivos = archivos.map(archivo => {
                if(archivo.name == actual.name) {
                    return {
                        ...archivo,
                        name: nombre,
                        content: editorRef.current.getValue(),
                    }
                }else{
                    return archivo
                }
            })
            setArchivos(newArchivos)
            setAbierto(abierto => !abierto)
            saveAs(blob, nombre+".sc")
            setOpen(false)
        }
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
            setDot(data.ast)
            console.log(data.ast)
            // setErrores(data.lista_errores)
        })
        .catch((error) => {
            alert("No sale compi")
            console.error('Error:', error)
        })
    }

    const getErrores = () => {
        fetch('http://localhost:4000/obtenerErrores', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => response.json())
        .then(data => {
            setErrores(data.lista_errores)
        })
        .catch((error) => {
            alert("Error al obtener errores")
            console.error('Error:', error)
        })
    }

    const getAST = () => {
        fetch('http://localhost:4000/getAST', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => response.json())
        .then(data => {
            setDot(data.ast)
            console.log(data.ast)
        })
        .catch((error) => {
            alert("Error al obtener ast")
            console.error('Error:', error)
        })
    }

    const changeView = (view) => {
        if(view == "editor"){
            setIsEditor(true)
            setIsErrores(false)
            setIsAST(false)
        } else if(view == "errores") {
            setIsEditor(false)
            setIsErrores(true)
            setIsAST(false)

        }else if(view == "ast") {
            setIsAST(true)
            setIsEditor(false)
            setIsErrores(false)
        }
    }
    
    return (
        <>
            <div className='w-full bg-gris h-10'>
                <section className='flex flex-row justify-around divide-x h-full align-middle text-white content-center items-center'>
                        <p className='flex flex-col cursor-pointer text-lg text-center w-full h-full hover:bg-gris-50 align-middle justify-center'
                            onClick={() => setAbierto((prev) => !prev)}
                        >Archivo</p>
                        <p className='flex flex-col cursor-pointer text-lg text-center w-full h-full hover:bg-gris-50 align-middle justify-center'
                            onClick={() => setReportes((prev) => !prev)}
                        >Reportes</p>
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
                            <button className='hover:bg-gris h-8' onClick={() => setOpen(true)}>Guardar archivo</button>
                                {/* // onClick={() => guardarArchivo()} */}
                            {/* // >Guardar</input> */}
                        </div>
                    )
                }
                {
                    reportes && (
                        <div className='bg-gris-50 absolute z-50 w-1/4 flex flex-col text-white ml-[538px]'>
                            <button className='hover:bg-gris h-8'
                                onClick={() => {changeView("errores"); setReportes(false); getErrores()}}
                            >Tabla de errores</button>
                            <button className='hover:bg-gris h-8'>Tabla de símbolos</button>
                            <button className='hover:bg-gris h-8'
                                onClick={() => {changeView("ast"); setReportes(false) }}
                            >AST</button>
                        </div>
                    )
                }
            </div>
            <div className='w-full bg-white flex flex-col h-5/6'>
                {
                    isEditor && (
                        <>
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
                        </>
                    )
                }
                {
                    isErrores && (
                        <Errores errores={errores} setView={changeView} />
                    )
                }

                {
                    isAST && (
                        <AST dot={dot} setView={changeView} />
                    )
                }
            </div>

            <ModalG open={open} onClose={() => setOpen(false)}>
                <div className="text-center w-56">
                    <div className="mx-auto my-4 w-48">
                    <h3 className="text-lg font-black text-gray-800">Guardar archivo</h3>
                    <p className="text-sm text-gray-700">
                        Escribe el nombre del archivo
                    </p>
                    <input type='text' name='Nombre archivo' className='bg-gray-400'
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-4">
                    <button className="btn btn-danger w-full"
                        onClick={() => guardarArchivo()}
                    >Guardar</button>
                    <button
                        className="btn btn-light w-full"
                        onClick={() => setOpen(false)}
                    >
                        Cancelar
                    </button>
                    </div>
                </div>
            </ModalG>
        </>
    )
    
}
    
export default Content;