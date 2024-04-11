class Interprete {

    constructor() {

    }

    analizar(raiz:any) {
        return this.interpretar(raiz)
    }

    interpretar(raiz:any) {
        let op
        let res
        let simbolo 
        let codigo = ""

        if(raiz == undefined || raiz == null) return
        switch(raiz.tag) {
            case 'RAIZ':
                raiz.hijos.forEach((hijo: any) => {
                    codigo += this.interpretar(hijo)
                })
                return codigo
            case 'Sentencias':
                raiz.hijos.forEach((hijo: any) => {
                    codigo += this.interpretar(hijo)
                })
                return codigo
            case 'declaracion':
                raiz.hijos.forEach((hijo: any) => {
                    codigo += this.interpretar(hijo)
                });
            
        }
    }

    // run(raiz:any) {
    //     raiz.hijos.forEach((hijo:any) => {
    //         this.run(hijo)
    //     });

    //     if(raiz.value == "Sentencias") {
    //         raiz.result = raiz.hijos.
    //     }
    // }
}