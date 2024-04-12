import React from 'react';
import Content from './Content';
    
const Menu = ({interpretar}) => {
    
    // const ejecutar = () => {
    //     Content.interpretar()
    // }
    
    return (
        <div className='w-full bg-gris h-10'>
            <section className='flex flex-row justify-around divide-x h-full align-middle text-white content-center items-center'>
                    <p className='flex flex-col cursor-pointer text-lg text-center w-full h-full hover:bg-gris-50 align-middle justify-center'>Archivo</p>
                    <p className='flex flex-col cursor-pointer text-lg text-center w-full h-full hover:bg-gris-50 align-middle justify-center'>Reportes</p>
                    <p className='flex flex-col cursor-pointer text-lg text-center w-full h-full hover:bg-gris-50 align-middle justify-center'
                        onClick={() => interpretar()}
                    >Ejecutar</p>
            </section>
        </div>
    )
    
}
    
export default Menu;