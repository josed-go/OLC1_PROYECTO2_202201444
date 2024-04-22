export class Reporte {
    private id: string
    private valor: string
    private tipo: string
    private entorno: string
    private linea: string
    private columna: string
    private tipoS: string

    constructor(id: string, valor: string, tipo: string, entorno: string, linea: string, columna: string, tipoS: string) {
        this.id = id.toLocaleLowerCase()
        this.valor = valor
        this.tipo = tipo
        this.entorno = entorno
        this.linea = linea
        this.columna = columna
        this.tipoS = tipoS
    }

    public getId():string{
        return this.id
    }

    public getTipoS():string{
        return this.tipoS
    }

    public getEntorno():string{
        return this.entorno
    }

    public getTipo():string{
        return this.tipo
    }

    public getValor():string{
        return this.valor
    }

    public getLinea():string{
        return this.linea
    }

    public getColumna():string{
        return this.columna
    }

    public setLinea(linea: string){
        this.linea = linea
    }
    
    public setColumna(columna: string){
        this.columna = columna
    }

    public setEntorno(entorno: string){
        this.entorno = entorno
    }

    public setValor(valor: string){
        this.valor = valor
    }
    
}