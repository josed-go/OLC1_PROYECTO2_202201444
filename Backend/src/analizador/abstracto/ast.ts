export default class AST {
    private lista_hijos: Array<AST>
    private valor: string

    constructor(valor: string) {
        this.lista_hijos = new Array<AST>
        this.valor = valor
    }

    public addHijo(valor: string, amb?: string, op?: number): void {

        if(amb != undefined) {
            switch(amb) {
                case 'arit':
                    switch (op) {
                        case 0:
                            valor = '+'
                            break;
                        case 1:
                            valor = '-'
                            break;
                        case 2:
                            valor = '-'
                            break;
                        case 3:
                            valor = '*'
                            break;
                        case 4:
                            valor = '/'
                            break;
                        case 6:
                            valor = '%'
                            break;
                    }
                break

                case 'logic':
                    switch (op) {
                        case 0:
                            valor = '||'
                            break;
                        case 1:
                            valor = '&&'
                            break;
                        case 2:
                            valor = '!'
                            break;
                    }
                break
                case 'relaci':
                    switch (op) {
                        case 0:
                            valor = '<'
                            break;
                        case 1:
                            valor = '>'
                            break;
                        case 2:
                            valor = '=='
                            break;
                        case 3:
                            valor = '!='
                            break;
                        case 4:
                            valor = '<='
                            break;
                        case 5:
                            valor = '>='
                            break;
                    }
                break
            }
            this.lista_hijos.push(new AST(valor))
        }

        this.lista_hijos.push(new AST(valor))
    }

    public agregarHijosAST(hijo: AST | undefined): void {
        if(hijo != undefined) this.lista_hijos.push(hijo)
    }

    public getValor(): string{
        return this.valor
    }

    public getHijos(): Array<AST> {
        return this.lista_hijos
    }
}