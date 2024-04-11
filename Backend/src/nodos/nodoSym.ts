class nodoSym {
    public nombre : string;
    public rol : string;
    public entorno : string;
    public tipo : string;
    public valor : string;
    public linea : number;
    public columna : number;

    constructor(nombre: string, rol: string, entorno: string, tipo: string, valor:string, linea:number, columna:number) {
        this.nombre = nombre
        this.rol = rol
        this.entorno = entorno
        this.tipo = tipo
        this.valor = valor
        this.linea = linea
        this.columna = columna
    }

}