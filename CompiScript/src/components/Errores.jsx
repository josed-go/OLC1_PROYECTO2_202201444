import React from 'react';
    
const Errores = ({ errores, setView }) => {
    
    return (
        <>
            <div className='w-full h-full max-h-full overflow-y-scroll'>
                <button className='ml-2 border '
                    onClick={() => setView("editor")}
                >Regresar</button>
                <table className='table-auto border-collapse border-2 border-slate-800 w-2/4 mx-auto text-center mt-14'>
                    <thead>

                    <tr className='bg-yellow-100'>
                        <th colSpan="5" className='font-bold text-2xl border p-4 border-slate-800'>Reporte de errores</th>
                    </tr>
                    <tr className='bg-gris-50 text-white'>
                        <th className='font-bold text-xl border-2 p-2 border-slate-800'>No.</th>
                        <th className='font-bold text-xl border-2 p-2 border-slate-800'>Tipo</th>
                        <th className='font-bold text-xl border-2 p-2 border-slate-800'>Descripción</th>
                        <th className='font-bold text-xl border-2 p-2 border-slate-800'>Linea</th>
                        <th className='font-bold text-xl border-2 p-2 border-slate-800'>Columna</th>
                    </tr>
                    </thead>
                    <tbody>

                        
                        {
                            errores.map((error, i) => (
                                <tr key={i}>
                                    <td className='border-2 font-semibold py-4 border-slate-800'>{i+1}</td>
                                    <td className='border-2 font-semibold py-4 border-slate-800'>{error.tipo}</td>
                                    <td className='border-2 font-semibold py-4 border-slate-800'>{error.descripcion}</td>
                                    <td className='border-2 font-semibold py-4 border-slate-800'>{error.fila}</td>
                                    <td className='border-2 font-semibold py-4 border-slate-800'>{error.columna}</td>
                                </tr>
                            ))
                        }
                    </tbody>

                </table>
            </div>
        </>
    )
    
}
    
export default Errores;