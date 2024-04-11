%{
    var string = ''
%}

// LEXICO

%lex

%options case-insensitive
%x string

%%

\s+ // OMITE ESPACIOS

/* COMENTARIOS */

\/\/.* {}  // COMENTARIO UNA LINEA
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/] {} // COMENTARIO VARIAS LINEAS

/* PALABRAS RESERVADAS */
"new" return "NEW";
"if" return "IF";
"else" return "ELSE";
"switch" return "SWITCH";
"case" return "CASE";
"default" return "DEFAULT";
"while" return "WHILE";
"for" return "FOR";
"do" return "DO";
"break" return "BREAK";
"continue" return "CONTINUE";
"return" return "RETURN";
"void" return "VOID";
"cout" return "COUT";
"endl" return "ENDL";
"tolower" return "TOLOWER";
"toupper" return "TOUPPER";
"ROUND" return "ROUND";
"length" return "LENGTH";
"typeof" return "TYPEOF";
"tostring" return "TOSTRING";
"c_str" return "CSTR";
"execute" return "EXECUTE";

/* TIPOS DE DATOS */
"double" return "TIPO";
"string" return "TIPO";
"int" return "TIPO";
"bool" return "TIPO";
"char" return "TIPO";
"string" return "TIPO";


/* OTROS */
"<<" return"DMENOR";
"std" return "STD";

/* OPERADORES ARITMETICOS */
"+" return "MAS";
"-" return "MENOS";
"*" return "MUL";
"/" return "DIV";
"pow" return "POT";
"%" return "MOD";

/* OPERADORES RELACIONALES */
"==" return "IGUALIGUAL";
"!=" return "DIF";
"=" return "IGUAL";
"!" return "NOT";
"<=" return "MENORIGUAL";
">=" return "MAYORIGUAL";
"<" return "MENOR";
">" return "MAYOR";

/* OPERADOR TERNARIO */
"?" return "INTERR";
":" return "DOSPUNTOS";

/* OPERADORES LOGICOS */
"||" return "OR";
"&&" return "AND";
// NOT

/* SIMBOLOS */

"(" return "PARIN";
")" return "PARFIN";
"{" return "LLAVEIN";
"}" return "LLAVEFIN";
";" return "PYC";
"[" return "CORCHIN";
"]" return "CORCHFIN";
"," return "COMA";
"\"" return "COMILLADOBLE";
"'" return "COMILLASIMPLE";

/* TIPOS DE DATOS */
"-"?([0-9]+)([0-9]+)*\.([0-9]+)([0-9]+)* return "DOUBLE";
"-"?([0-9]+)([0-9]+)* return "NUM";
"true" return "BOOLEANO";
"false" return "BOOLEANO";
\'[^'\r\n]*\' return "CARACTER";
// \"[^\"]*\" return "STRING";
["]						{ string = ''; this.begin("string"); }
<string>[^"\\]+			{ string += yytext; }
<string>"\\\""			{ string += "\""; }
<string>"\\n"			{ string += "\n"; }
<string>\s				{ string += " ";  }
<string>"\\t"			{ string += "\t"; }
<string>"\\\\"			{ string += "\\"; }
<string>"\\\'"			{ string += "\'"; }
<string>"\\r"			{ string += "\r"; }
<string>["]				{ yytext = string; this.popState(); return 'STRING'; }

([a-zA-Z])[a-zA-Z0-9_]* return 'ID';

[\ \f\t\n\r] {}

<<EOF>> return 'EOF';

. {console.log('Error lexico: '+yytext+' | Linea: '+yylloc.first_line+' | Columna: '+yylloc.first_column);
    // Error_L.getInstance().insertar(new Error_N("Lexico", "El caracter \""+yytext+"\" no pertenece al lenguaje"), yylloc.first_line, yylloc.first_column );
    indexController.lista_errores.push(new Error_N("Lexico", "El caracter \""+yytext+"\" no pertenece al lenguaje"), yylloc.first_line, yylloc.first_column );
    return null;}

/lex

// SINTACTICO

%{
    const nodoAST = (etiqueta, valor, fila, columna) => {
        this.etiqueta = etiqueta
        this.valor = valor
        this.fila = fila
        this.columna = columna
        this.hijos = []

        this.addHijos = addHijos
        this.getHijo = getHijo

        const addHijos = () =>  {
            for (var i = 0; i < arguments.length; i++) {
                this.hijos.push(arguments[i]);
                if (arguments[i]!== null){
                    arguments[i].padre = this;
                }
            }
        }

        const getHijos = (pos) => {
            if(pos > this.hijos.length - 1 ) return null
            return this.hijos[pos]
        }
    };

%}

%left 'IGUALIGUAL' 'DIF' 'MENORIGUAL' 'MAYORIGUAL' 'MENOR' 'MAYOR'
%left 'OR' 'AND'
%left 'MAS' 'MENOS'
%left 'DIV' 'MUL'

%start inicio

%%

inicio : instrucciones EOF { $$ = new nodoAST("RAIZ", "RAIZ", this.$first_line, @1.last_column);
                            $$.addHijos($1);
                            return $$ }
;

instrucciones : instrucciones sentencias { $1.addHijos($2);
                                            $$ = $1 }
                | sentencias { $$ = new nodoAST("Sentencias", "Sentencias", this._$.first_line, @1.last_column);
                                $$.addHijos($1); }
;

sentencias : declaracion { $$ = $1 }
            | imprimir { $$ = $1 }
;

declaracion : TIPO l_id fin_declaracion { $$ = new nodoAST("declaracion", "declaracion", this._$.first_line, @1.last_column) ;
                        $$.addHijos(new nodoAST("TIPO", $1, this._$.first_line, @1.last_column), $2, $3) }
;

l_id : l_id COMA ID { $1.addHijos($2, new nodoAST("COMA", $2, this._$.first_line, @2.last_column), new nodoAST("ID", $3, this._$.first_line, @3.last_column)); $$ = $1 }
    | ID { $$ = new nodoAST("l_id", "l_id", this._$.first_line, @1.last_column); 
        $$.addHijos(new nodoAST("ID", $1, this._$.first_line, @1.last_column))  }
;

fin_declaracion : PYC { $$ = new nodoAST("fin_declaracion", "fin_declaracion", this._$.first_line, @1.last_column) ;
                        $$.addHijos(new nodoAST("PYC", $1, this._$.first_line, @1.last_column)) }
                | IGUAL expresion { $$ = new nodoAST("fin_declaracion", "fin_declaracion", this._$.first_line, @1.last_column) ;
                        $$.addHijos(new nodoAST("IGUAL", $1, this._$.first_line, @1.last_column), $2) }
;

expresion : expresion MAS expresion { $$ = new nodoAST("expresion", "expresion", this._$.first_line, @2.last_column);
                                        $$.addHijos($1, new nodoAST("Operador", $2, this._$.first_line, @2.last_column), $3) }
        | expresion MENOS expresion { $$ = new nodoAST("expresion", "expresion", this._$.first_line, @2.last_column);
                                        $$.addHijos($1, new nodoAST("Operador", $2, this._$.first_line, @2.last_column), $3) }
        | expresion MUL expresion { $$ = new nodoAST("expresion", "expresion", this._$.first_line, @2.last_column);
                                        $$.addHijos($1, new nodoAST("Operador", $2, this._$.first_line, @2.last_column), $3) }
        | expresion DIV expresion { $$ = new nodoAST("expresion", "expresion", this._$.first_line, @2.last_column);
                                        $$.addHijos($1, new nodoAST("Operador", $2, this._$.first_line, @2.last_column), $3) }
        | PARIN expresion PARFIN { $$ = $2 }
        | NUM { $$ = new nodoAST("expresion", "expresion", this._$.first_line, @1.last_column);
                                        $$.addHijos(new nodoAST("NUM", $1, this._$.first_line, @1.last_column)) }
        | DOUBLE { $$ = new nodoAST("expresion", "expresion", this._$.first_line, @1.last_column);
                                        $$.addHijos(new nodoAST("DOUBLE", $1, this._$.first_line, @1.last_column)) }
        | CADENA { $$ = new nodoAST("expresion", "expresion", this._$.first_line, @1.last_column);
                                        $$.addHijos(new nodoAST("CADENA", $1, this._$.first_line, @1.last_column)) }
        | CARACTER { $$ = new nodoAST("expresion", "expresion", this._$.first_line, @1.last_column);
                                        $$.addHijos(new nodoAST("CARACTER", $1, this._$.first_line, @1.last_column)) }
        | BOOLEANO { $$ = new nodoAST("expresion", "expresion", this._$.first_line, @1.last_column);
                                        $$.addHijos(new nodoAST("BOOLEANO", $1, this._$.first_line, @1.last_column)) }
        | ID { $$ = new nodoAST("expresion", "expresion", this._$.first_line, @1.last_column);
                                        $$.addHijos(new nodoAST("ID", $1, this._$.first_line, @1.last_column)) }
;
imprimir : COUT DMENOR expresion final_imp
;

final_imp : DMENOR ENDL PYC
            | PYC
;

// expresion : NUM
//             | DOUBLE
//             | ID
//             | CADENA
// ;