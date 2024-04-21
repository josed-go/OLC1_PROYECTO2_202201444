export default class Cont {
    private static instance: Cont
    private contador : number

    private constructor(){
        this.contador = 0
    }

    public static getInstancia(): Cont {
        if(!Cont.instance) {
            Cont.instance = new Cont()
        }
        return Cont.instance
    }

    get() {
        this.contador ++

        return this.contador
    }
}