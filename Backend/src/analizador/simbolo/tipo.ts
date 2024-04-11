export default class Tipo {
    private tipo: tipoD

    constructor(tipo: tipoD) {
        this.tipo = tipo
    }

    public setTipo(tipo: tipoD) {
        this.tipo = tipo
    }

    public getTipo() {
        return this.tipo
    }

    public getTipoD(tipo: string): any {
        switch (tipo.toLocaleLowerCase()) {
            case 'int':
                
                return tipoD.INT
            case 'double':
            
                return tipoD.DOUBLE
            case 'string':
            
                return tipoD.CADENA
            case 'bool':
            
                return tipoD.BOOL

            case 'char':
            
                return tipoD.CHAR
        
            default:
                break;
        }
    }
}

export enum tipoD {
    INT,
    DOUBLE,
    BOOL,
    CHAR,
    CADENA,
    VOID
}