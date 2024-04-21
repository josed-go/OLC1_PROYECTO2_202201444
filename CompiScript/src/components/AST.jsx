import React from 'react';
import { Graphviz } from 'graphviz-react'
    
const AST = ({dot, setView}) => {
    
    return (
        <>
            <div className='w-full h-full max-h-full overflow-y-scroll m-auto'>
                    <button className='ml-2 border '
                    onClick={() => setView("editor")}
                >Regresar</button>
                <Graphviz className='w-full'
                    dot={dot}
                    options={{zoom:true, height: 1000, width: 1600}}
                />
            </div>
        </>
    )
    
}
    
export default AST;