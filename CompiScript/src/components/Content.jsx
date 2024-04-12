import React, { useRef, useState } from 'react';
import Editor from '@monaco-editor/react'
    
const Content = () => {

    
    const editorRef = useRef(null)
    const consolaRef = useRef(null)

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
                        <p className='flex flex-col cursor-pointer text-lg text-center w-full h-full hover:bg-gris-50 align-middle justify-center'>Archivo</p>
                        <p className='flex flex-col cursor-pointer text-lg text-center w-full h-full hover:bg-gris-50 align-middle justify-center'>Reportes</p>
                        <p className='flex flex-col cursor-pointer text-lg text-center w-full h-full hover:bg-gris-50 align-middle justify-center'
                            onClick={() => interpretar()}
                        >Ejecutar</p>
                </section>
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