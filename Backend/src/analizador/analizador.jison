%{
    const Tipo = require('./simbolo/tipo')
    const Datos = require('./expresiones/nativo')
    const Aritmeticas = require('./expresiones/aritmeticas')
    const Cout = require('./instrucciones/cout')
    const Declaracion = require('./instrucciones/declaracion')
    const AccesoVar = require('./expresiones/acceso.var')
    const Asignacion = require('./instrucciones/asignacion')
    const Creacion = require('./instrucciones/creacion.var')
    const IncreDecre = require('./instrucciones/incre.decre')
    const FuncionesN = require('./instrucciones/funciones.nativas')
    const If = require('./instrucciones/if')
    const Relacionales = require('./expresiones/relacionales')
    const While = require('./instrucciones/while')
    const Break = require('./instrucciones/break')
    const Continue = require('./instrucciones/continue')
    const Ternario = require('./instrucciones/if.ternario')
    const Logicas = require('./expresiones/logicas')
    const DoWhile = require('./instrucciones/do.while')
    const For = require('./instrucciones/for')
    const Casteo = require('./instrucciones/casteo')
    const Switch = require('./instrucciones/switch')
    const Case = require('./instrucciones/switch.case')
    const Default = require('./instrucciones/switch.default')
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
"double" return "r_DOUBLE";
"string" return "r_STRING";
"int" return "r_INT";
"bool" return "r_BOOL";
"char" return "r_CHAR";


/* OTROS */
"<<" return"DMENOR";
"std" return "STD";
"++" return "INCRE";
"--" return "DECRE";

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
"." return "PUNTO";
// "\"" return "COMILLADOBLE";
// "'" return "COMILLASIMPLE";

/* TIPOS DE DATOS */
([0-9]+)([0-9]+)*\.([0-9]+)([0-9]+)* return "DOUBLE";
([0-9]+)([0-9]+)* return "NUM";
"true" return "TRUE";
"false" return "FALSE";
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
%left 'INTERR'
%left 'OR'
%left 'AND'
%right 'NOT'
// %left if_t_s
%left longitud
%left 'IGUALIGUAL' 'DIF' 'MENORIGUAL' 'MAYORIGUAL' 'MENOR' 'MAYOR'
%left 'MAS' 'MENOS'
%left 'DIV' 'MUL' 'MOD'
%left 'INCRE' 'DECRE'
%right 'UMENOS'
%left 'PUNTO'
%left PARIN

%start inicio

%%

inicio : instrucciones EOF { return $1 }
;

instrucciones : instrucciones sentencias { $1.push($2); $$ = $1 }
                | sentencias { $$ = [$1] }
;

sentencias : declaracion { $$ = $1 }
            | imprimir { $$ = $1 }
            | asignacion PYC { $$ = $1 }
            | incre_decre PYC { $$ = $1 }
            | if_s { $$ = $1 }
            | while_s { $$ = $1 }
            | break_s { $$ = $1 }
            | continue_s { $$ = $1 }
            | do_while_s { $$ = $1 }
            | for_s { $$ = $1 }
            | switch_s { $$ = $1 }
;

declaracion : tipos l_id fin_declaracion { 
        if($3 == false) {
            $$ = new Creacion.default($1, @1.first_line, @1.first_column, $2) 
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

asignacion : ID IGUAL expresion { $$ = new Asignacion.default($1, $3, @1.first_line, @1.first_column) }
;

if_s : IF PARIN expresion PARFIN bloque_ins   { $$ = new If.default($3, $5, @1.first_line, @1.first_column, undefined, undefined) }
    | IF PARIN expresion PARFIN bloque_ins ELSE bloque_ins { $$ = new If.default($3, $5, @1.first_line, @1.first_column, undefined, $7) }
    | IF PARIN expresion PARFIN bloque_ins ELSE if_s { $$ = new If.default($3, $5, @1.first_line, @1.first_column, $7, undefined) }
;

bloque_ins : LLAVEIN instrucciones LLAVEFIN { $$ = $2 }
            | LLAVEIN  LLAVEFIN { $$ = [] }
;

// switch_s : SWITCH PARIN expresion PARFIN LLAVEIN casos_list LLAVEFIN { $$ = new Switch.default($3, $6, @1.first_line, @1.first_column) }
// ;
// switch_s : SWITCH PARIN expresion PARFIN LLAVEIN cases_list LLAVEFIN { $$ = new Switch.default($3, $6, @1.first_line, @1.first_column) }
//             | SWITCH PARIN expresion PARFIN LLAVEIN cases_list default_c LLAVEFIN { $$ = new Switch.default($3, $6, @1.first_line, @1.first_column) }
// ;

// casos_list : casos_list caso { $1.push($2); $$ = $1 }
//             | default_c { $$ = [$1] }
// ;

switch_s: SWITCH PARIN expresion PARFIN LLAVEIN cases_list default_c LLAVEFIN { $$ = new Switch.default($3, @1.first_line, @1.first_column, $6, $7) }
        | SWITCH PARIN expresion PARFIN LLAVEIN cases_list LLAVEFIN { $$ = new Switch.default($3, @1.first_line, @1.first_column, $6, undefined) }
        | SWITCH PARIN expresion PARFIN LLAVEIN default_c LLAVEFIN { $$ = new Switch.default($3, @1.first_line, @1.first_column, undefined, $6) }
;

cases_list : cases_list caso { if($2 != false) $1.push($2); $$ = $1 }
            | caso { $$ = ($1 != false) ? [$1] : [] }
;

caso : CASE expresion DOSPUNTOS instrucciones { $$ = new Case.default($2, $4, @1.first_line, @1.first_column) }
;

default_c : DEFAULT DOSPUNTOS instrucciones { $$ = new Default.default($3, @1.first_line, @1.first_column) }
;

// elseif : LLAVEFIN { $$ = null }
//         | LLAVEFIN ELSE LLAVEFIN instrucciones LLAVEFIN elseif { $$ = $3 }
//         | LLAVEFIN if_s { $$ = $2 }
// ;

if_t_s : expresion INTERR expresion DOSPUNTOS expresion { $$ = new Ternario.default($1, $3, $5, @1.first_line, @1.first_column) }
;

while_s : WHILE PARIN expresion PARFIN LLAVEIN instrucciones LLAVEFIN { $$ = new While.default($3, $6, @1.first_line, @1.first_column) }
;

do_while_s : DO LLAVEIN instrucciones LLAVEFIN WHILE  PARIN expresion PARFIN PYC { $$ = new DoWhile.default($7, $3, @1.first_line, @1.first_column) }
;

for_s : FOR PARIN for_pri expresion PYC actualizacion PARFIN LLAVEIN instrucciones LLAVEFIN { $$ = new For.default($4, $9, $6, $3, @1.first_line, @1.first_column) }
;

for_pri : asignacion PYC { $$ = $1 }
        | declaracion { $$ = $1 }
;

actualizacion : asignacion { $$ = $1 }
                | incre_decre { $$ = $1 }
;

break_s : BREAK PYC { $$ = new Break.default(@1.first_line, @1.first_column) }
;

continue_s : CONTINUE PYC { $$ = new Continue.default(@1.first_line, @1.first_column) }
;

incre_decre : ID accion { $$ = new IncreDecre.default($1, @1.first_line, @1.first_column, $2) }
;

accion : INCRE { $$ = "mas" }
        | DECRE { $$ = "menos" }
;

lower_upper : TOLOWER PARIN expresion PARFIN { $$ = new FuncionesN.default(FuncionesN.Operadores.LOWER, @1.first_line, @1.first_column, $3) }
            | TOUPPER PARIN expresion PARFIN { $$ = new FuncionesN.default(FuncionesN.Operadores.UPPER, @1.first_line, @1.first_column, $3) }
;

round : ROUND PARIN expresion PARFIN { $$ = new FuncionesN.default(FuncionesN.Operadores.ROUND, @1.first_line, @1.first_column, $3) }
;

longitud : PUNTO LENGTH PARIN PARFIN {  }
;

typeof : TYPEOF PARIN expresion PARFIN { $$ = new FuncionesN.default(FuncionesN.Operadores.TYPEOF, @1.first_line, @1.first_column, $3) }
;

astring : STD DOSPUNTOS DOSPUNTOS TOSTRING PARIN expresion PARFIN { $$ = new FuncionesN.default(FuncionesN.Operadores.TOSTRING, @1.first_line, @1.first_column, $6) }
;

// inicia_par : PARIN producciones { $$ = $2 }
// ;

// producciones: expresion PARFIN { $$ = $1 }
//             | tipos PARFIN expresion { $$ = new Casteo.default($3, $1,  @1.first_line, @1.first_column) }
// ;


casteo : PARIN tipos PARFIN expresion { $$ = new Casteo.default($4, $2,  @1.first_line, @1.first_column) }
;

expresion : expresion MAS expresion { $$ = new Aritmeticas.default(Aritmeticas.Operadores.SUMA, @1.first_line, @1.first_column, $1, $3) }
        | expresion MENOS expresion { $$ = new Aritmeticas.default(Aritmeticas.Operadores.RESTA, @1.first_line, @1.first_column, $1, $3) }
        | expresion MUL expresion { $$ = new Aritmeticas.default(Aritmeticas.Operadores.MUL, @1.first_line, @1.first_column, $1, $3) }
        | expresion DIV expresion { $$ = new Aritmeticas.default(Aritmeticas.Operadores.DIV, @1.first_line, @1.first_column, $1, $3) }
        | expresion MOD expresion { $$ = new Aritmeticas.default(Aritmeticas.Operadores.MOD, @1.first_line, @1.first_column, $1, $3) }
        | expresion MENOR expresion { $$ = new Relacionales.default(Relacionales.Relacional.MENOR, $1, $3, @1.first_line, @1.first_column) }
        | expresion MAYOR expresion { $$ = new Relacionales.default(Relacionales.Relacional.MAYOR, $1, $3, @1.first_line, @1.first_column) }
        | expresion IGUALIGUAL expresion { $$ = new Relacionales.default(Relacionales.Relacional.IGUAL, $1, $3, @1.first_line, @1.first_column) }
        | expresion DIF expresion { $$ = new Relacionales.default(Relacionales.Relacional.DIF, $1, $3, @1.first_line, @1.first_column) }
        | expresion MENORIGUAL expresion { $$ = new Relacionales.default(Relacionales.Relacional.MENORI, $1, $3, @1.first_line, @1.first_column) }
        | expresion MAYORIGUAL expresion { $$ = new Relacionales.default(Relacionales.Relacional.MAYORI, $1, $3, @1.first_line, @1.first_column) }
        | expresion OR expresion { $$ = new Logicas.default(Logicas.Logico.OR, @1.first_line, @1.first_column, $1, $3) }
        | expresion AND expresion { $$ = new Logicas.default(Logicas.Logico.AND, @1.first_line, @1.first_column, $1, $3) }
        | NOT expresion { $$ = new Logicas.default(Logicas.Logico.NOT, @1.first_line, @1.first_column, $2) }
        | POT PARIN expresion COMA expresion PARFIN { $$ = new Aritmeticas.default(Aritmeticas.Operadores.POW, @1.first_line, @1.first_column, $3, $5)  }
        | PARIN expresion PARFIN { $$ = $2 }
        | MENOS expresion %prec UMENOS { $$ = new Aritmeticas.default(Aritmeticas.Operadores.NEGACION, @1.first_line, @1.first_column, $2) }
        | expresion longitud { $$ = new FuncionesN.default(FuncionesN.Operadores.LENGTH, @1.first_line, @1.first_column, $1) }
        | NUM { $$ = new Datos.default(new Tipo.default(Tipo.tipoD.INT), $1, @1.first_line, @1.first_column) }
        | DOUBLE { $$ = new Datos.default(new Tipo.default(Tipo.tipoD.DOUBLE), $1, @1.first_line, @1.first_column) }
        | CADENA { $$ = new Datos.default(new Tipo.default(Tipo.tipoD.CADENA), $1, @1.first_line, @1.first_column) }
        | CARACTER { $$ = new Datos.default(new Tipo.default(Tipo.tipoD.CHAR), $1, @1.first_line, @1.first_column) }
        | TRUE { $$ = new Datos.default(new Tipo.default(Tipo.tipoD.BOOL), true, @1.first_line, @1.first_column) }
        | FALSE { $$ = new Datos.default(new Tipo.default(Tipo.tipoD.BOOL), false, @1.first_line, @1.first_column) }
        | ID { $$ = new AccesoVar.default($1, @1.first_line, @1.first_column) }
        | lower_upper { $$ = $1 }
        | round { $$ = $1 }
        | typeof { $$ = $1 }
        | astring { $$ = $1 }
        | if_t_s { $$ = $1 }
        | casteo { $$ = $1 }
        // | inicia_par { $$ = $1 }
;

tipos : STD DOSPUNTOS DOSPUNTOS r_STRING { $$ = new Tipo.default(Tipo.tipoD.CADENA) } 
        | r_INT { $$ = new Tipo.default(Tipo.tipoD.INT) } 
        | r_DOUBLE { $$ = new Tipo.default(Tipo.tipoD.DOUBLE) } 
        | r_BOOL { $$ = new Tipo.default(Tipo.tipoD.BOOL) } 
        | r_CHAR { $$ = new Tipo.default(Tipo.tipoD.CHAR) } 
;

// tipos_relacionales : MENOR { $$ = Relacionales.Relacional.MENOR  }
// ;

// expresion : NUM
//             | DOUBLE
//             | ID
//             | CADENA
// ;