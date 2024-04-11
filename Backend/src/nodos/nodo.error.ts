class Error_N {
    public tipo : string
    public descripcion : string
    public fila : number
    public columna : number
    public siguiente : any
    public anterior : any
    constructor(tipo:string, descripcion:string, fila:number, columna:number) {
        this.tipo = tipo
        this.descripcion = descripcion
        this.fila = fila
        this.columna = columna
        this.siguiente = null
        this.anterior = null
    }
}