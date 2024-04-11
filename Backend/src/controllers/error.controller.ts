var Error_L = () => {
    var instancia: any

    class Lista {
        public principio: any
        public fin: any
        constructor() {
            this.principio = null
            this.fin = null
        }

        insertar(Error: Error_N) {
            if (this.principio == null) {
                this.principio = Error;
                this.fin = Error
                return
            }

            this.fin.siguiente = Error;
            Error.anterior=this.fin;
            this.fin=Error;
            console.log(this.fin);
        }

        getErrores(){
            var texto="";

            var aux=this.principio;

            while(aux!=null){
                texto+="ERROR: Tipo:"+aux.tipo
                +" Descripcion: "+aux.descripcion
                +" Fila: "+aux.fila
                +" Columna: "+aux.columna+" \n";
                aux=aux.siguiente;
            }

            return texto;

        }    

        reiniciar() {
            this.principio=null;
            this.fin=null;
        }
    }

    function crearInstancia(){
        return new Lista();
    }

    return {
        getInstance:function(){
            if(!instancia){
                instancia=crearInstancia()
            }
            return instancia;
        }
    }
}