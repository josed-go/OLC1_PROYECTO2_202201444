%{
    const Tipo = require('./simbolo/tipo')
    const Datos = require('./expresiones/nativo')
    const Aritmeticas = require('./expresiones/aritmeticas')
    const Cout = require('./instrucciones/cout')
    const Declaracion = require('./instrucciones/declaracion')
    const AccesoVar = require('./expresiones/acceso.var')
    const Asignacion = require('./instrucciones/asignacion')
    var texto = ''

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
"double" return "DOUBLE";
"string" return "r_STRING";
"int" return "INT";
"bool" return "BOOL";
"char" return "CHAR";


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
// "\"" return "COMILLADOBLE";
// "'" return "COMILLASIMPLE";

/* TIPOS DE DATOS */
([0-9]+)([0-9]+)*\.([0-9]+)([0-9]+)* return "DOUBLE";
([0-9]+)([0-9]+)* return "NUM";
"true" return "BOOLEANO";
"false" return "BOOLEANO";
\'[^'\r\n]*\' return "CARACTER";
// \"[^\"]*\" return "STRING";
["]						{ texto = ''; this.begin("string"); }
<string>[^"\\]+			{ texto += yytext; }
<string>"\\\""			{ texto += "\""; }
<string>"\\n"			{ texto += "\n"; }
<string>\s				{ texto += " ";  }
<string>"\\t"			{ texto += "\t"; }
<string>"\\\\"			{ texto += "\\"; }
<string>"\\\'"			{ texto += "\'"; }
<string>"\\r"			{ texto += "\r"; }
<string>["]				{ yytext = texto; this.popState(); return 'CADENA'; }

([a-zA-Z])[a-zA-Z0-9_]* return 'ID';

[\ \f\t\n\r] {}

<<EOF>> return 'EOF';

. {console.log('Error lexico: '+yytext+' | Linea: '+yylloc.first_line+' | Columna: '+yylloc.first_column); }

/lex

// SINTACTICO

%left 'IGUALIGUAL' 'DIF' 'MENORIGUAL' 'MAYORIGUAL' 'MENOR' 'MAYOR'
%left 'OR' 'AND'
%left 'MAS' 'MENOS'
%left 'DIV' 'MUL'
%right 'UMENOS'

%start inicio

%%

inicio : instrucciones EOF { return $1 }
;

instrucciones : instrucciones sentencias { $1.push($2); $$ = $1 }
                | sentencias { $$ = [$1] }
;

sentencias : declaracion { $$ = $1 }
            | imprimir { $$ = $1 }
            | asignacion { $$ = $1 }
;

declaracion : tipos l_id fin_declaracion { 
        if($3 == false) {
            
        }else {
            
            $$ = new Declaracion.default($1, @1.first_line, @1.first_column, $2, $3) 
        }
    }
;

l_id : l_id COMA ID { $1.push($3); $$ = $1 }
    | ID { $$ = [$1] }
;

fin_declaracion : PYC { $$ = false }
                | IGUAL expresion PYC{ $$ = $2 }
;

imprimir : COUT DMENOR expresion final_imp { 
    if($4 == 0) {
        $$ = new Cout.default($3, @1.first_line, @1.first_column, "")
    }else if($4 == 1) {
        $$ = new Cout.default($3, @1.first_line, @1.first_column, "\n")
    }
    }
;

final_imp : DMENOR ENDL PYC { $$ = 1 }
            | PYC { $$ = 0 }
;

asignacion : ID IGUAL expresion PYC { $$ = new Asignacion.default($1, $3, @1.first_line, @1.first_column) }
;

expresion : expresion MAS expresion { $$ = new Aritmeticas.default(Aritmeticas.Operadores.SUMA, @1.first_line, @1.first_column, $1, $3) }
        | expresion MENOS expresion { $$ = new Aritmeticas.default(Aritmeticas.Operadores.RESTA, @1.first_line, @1.first_column, $1, $3) }
        | expresion MUL expresion { $$ = new Aritmeticas.default(Aritmeticas.Operadores.MUL, @1.first_line, @1.first_column, $1, $3) }
        | expresion DIV expresion {  }
        | PARIN expresion PARFIN { $$ = $2 }
        | MENOS expresion %prec UMENOS { $$ = new Aritmeticas.default(Aritmeticas.Operadores.NEGACION, @1.first_line, @1.first_column, $2) }
        | NUM { $$ = new Datos.default(new Tipo.default(Tipo.tipoD.INT), $1, @1.first_line, @1.first_column) }
        | DOUBLE { $$ = new Datos.default(new Tipo.default(Tipo.tipoD.DOUBLE), $1, @1.first_line, @1.first_column) }
        | CADENA { $$ = new Datos.default(new Tipo.default(Tipo.tipoD.CADENA), $1, @1.first_line, @1.first_column) }
        | CARACTER { $$ = new Datos.default(new Tipo.default(Tipo.tipoD.CHAR), $1, @1.first_line, @1.first_column) }
        | BOOLEANO { $$ = new Datos.default(new Tipo.default(Tipo.tipoD.BOOL), $1, @1.first_line, @1.first_column) }
        | ID { $$ = new AccesoVar.default($1, @1.first_line, @1.first_column) }
;

tipos : STD DOSPUNTOS DOSPUNTOS r_STRING { $$ = new Tipo.default(Tipo.tipoD.CADENA) } 
        | INT { $$ = new Tipo.default(Tipo.tipoD.INT) } 
        | DOUBLE { $$ = new Tipo.default(Tipo.tipoD.DOUBLE) } 
        | BOOL { $$ = new Tipo.default(Tipo.tipoD.BOOL) } 
        | CHAR { $$ = new Tipo.default(Tipo.tipoD.CHAR) } 
;

// expresion : NUM
//             | DOUBLE
//             | ID
//             | CADENA
// ;