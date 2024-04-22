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

    public getTipoD(tipo: any): any {
        switch (tipo) {
            case tipoD.INT:
                
                return 'int'
            case tipoD.DOUBLE:
            
                return 'double'
            case tipoD.CADENA:
            
                return 'std::string'
            case tipoD.BOOL:
            
                return 'bool'

            case tipoD.CHAR:
            
                return 'char'
        
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