import React, { useState } from 'react';
import Button from './Button';
import ArrowIcon from './Icon';
import DropdownFile from './DropdownFile';
    
const SideBar = ({getArchivos, archivos, actual, setActual, editorRef, consolaRef}) => {

    const [rotar, setRotar] = useState({transform: "rotate(-90deg)"})
    const [bandera, setBandera] = useState(true)

    const handleActionButton = () => {
        if(bandera) {
            setBandera(false)
            setRotar({transform: "rotate(90deg)", paddingTop: "0.7rem"})
            console.log("aqui")
        }else{
            console.log("aqui2")
            setBandera(true)
            setRotar({transform: "rotate(-90deg)"})
        }
    }

    const handleCurrentFile = (archivo) => {
        setActual(archivo)
        editorRef.current.setValue(archivo.content)
    }

    return (
        <>
            <div className='bg-gris w-2/12 h-full text-white'>
                <h1 className='text-center text-2xl font-bold m-1 border-b pb-1'>CompiScript+</h1>
                <div 
                    className='flex flex-row align-middle gap-0 text-gray-100 hover:text-white hover:bg-gris-50 w-full pl-4 cursor-pointer' 
                    onClick={() => {handleActionButton()}}
                    >
                    <ArrowIcon style={rotar} />
                    <button className='text-left pl-2 font-semibold h-full'>Archivos</button>
                </div>
                {
                    !bandera && 
                        <div>
                            {
                                getArchivos.map((item, i) => (

                                    <div className='flex flex-row hover:bg-gris-50 cursor-pointer h-8 align-middle pl-8' key={i}
                                        onClick={() => handleCurrentFile(item)}
                                    >
                                        {/* {console.log(item.name, item.content)} */}
                                        <p className='text-white text-base h-full'>{item.name}</p>
                                    </div>
                                    )
                                )
                            }
                        </div>
                    
                }
            </div>
            
        </>
    )
    
}
    
export default SideBar;