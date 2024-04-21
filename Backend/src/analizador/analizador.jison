%{
    const index = require('../controllers/index.controller')
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
    const Errores = require('./errores/errores')

    const Vector1D = require('./instrucciones/vectores.ud')
    const AccesoVector1D = require('./expresiones/acceso.vectorud')
    const ModificarVector1D = require('./instrucciones/modificar.vectorud')
    const Vector2D = require('./instrucciones/vector.dd')
    const AccesoVector2D = require('./expresiones/acceso.vectordd')
    const ModificarVector2D = require('./instrucciones/modificar.vectordd')

    const Metodo = require('./instrucciones/metodo')
    const Funcion = require('./instrucciones/funcion')
    const Execute = require('./instrucciones/execute')
    const Llamada = require('./instrucciones/llamada')
    const Return = require('./instrucciones/return')
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
// "void" return "VOID";
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
"void" return "r_VOID"


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

. {console.log('Error lexico: '+yytext+' | Linea: '+yylloc.first_line+' | Columna: '+yylloc.first_column);
    index.lista_errores.push(new Errores.default("Lexico", "Simbolo \""+yytext+"\" no pertenece al lenguaje",yylloc.first_line,yylloc.first_column ))}

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

instrucciones : instrucciones sentencias { if($2 != false) $1.push($2); $$ = $1 }
                | sentencias { $$ = ($1!= false) ? [$1] : []}
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
            | vector_ud { $$ = $1 }
            | modificar_vud { $$ = $1 }
            | vector_dd { $$ = $1 }
            | modificar_vdd { $$ = $1 }
            | funcion { $$ = $1 }
            | metodo_fun { $$ = $1 }
            | execute_s { $$ = $1 }
            | llamada_s PYC { $$ = $1 }
            | return_s { $$ = $1 }
            | error PYC { index.lista_errores.push(new Errores.default("Sintactico", "Se esperaba \"" + yytext + "\" y se obtuvo otra cosa",this._$.first_line, this._$.first_column )); $$ = false}
            // | error LLAVEIN { index.lista_errores.push(new Errores.default("Sintactico", "Se esperaba \"" + yytext + "\" y se obtuvo otra cosa",this._$.first_line, this._$.first_column )); $$ = false}
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

f_cstr : expresion PUNTO CSTR PARIN PARFIN { $$ = new FuncionesN.default(FuncionesN.Operadores.CSTR, @1.first_line, @1.first_column, $1) }
;

// inicia_par : PARIN producciones { $$ = $2 }
// ;

// producciones: expresion PARFIN { $$ = $1 }
//             | tipos PARFIN expresion { $$ = new Casteo.default($3, $1,  @1.first_line, @1.first_column) }
// ;


casteo : PARIN tipos PARFIN expresion { $$ = new Casteo.default($4, $2,  @1.first_line, @1.first_column) }
;

vector_ud : tipos ID CORCHIN CORCHFIN IGUAL NEW tipos CORCHIN expresion CORCHFIN PYC { $$ = new Vector1D.default(@1.first_line, @1.first_column, $1, $2, $9, false, $7, true) }
            | tipos ID CORCHIN CORCHFIN IGUAL lista PYC { $$ = new Vector1D.default(@1.first_line, @1.first_column, $1, $2, $6, false, null, false) }
            | tipos ID CORCHIN CORCHFIN IGUAL f_cstr PYC { $$ = new Vector1D.default(@1.first_line, @1.first_column, $1, $2, $6, true, null, false) }
;

vector_dd : tipos ID CORCHIN CORCHFIN CORCHIN CORCHFIN IGUAL NEW tipos CORCHIN expresion CORCHFIN CORCHIN expresion CORCHFIN PYC { $$ = new Vector2D.default(@1.first_line, @1.first_column, $1, $2,$11,$14, [],$9, true) }
            | tipos ID CORCHIN CORCHFIN CORCHIN CORCHFIN IGUAL CORCHIN lista_valores CORCHFIN PYC { $$ = new Vector2D.default(@1.first_line, @1.first_column, $1, $2,[],[],$9, null, true) }
;

lista_valores : lista_valores COMA lista { $1.push($3); $$ = $1 }
                | lista { $$ = [$1] }
;

lista : CORCHIN lista_expresion CORCHFIN { $$ = $2 }
;

lista_expresion : lista_expresion COMA expresion { $1.push($3); $$ = $1 }
                    | expresion { $$ = [$1] }
;

acceso_vud : ID CORCHIN expresion CORCHFIN { $$ = new AccesoVector1D.default($1, $3, @1.first_line, @1.first_column) }
;

modificar_vud : ID CORCHIN expresion CORCHFIN IGUAL expresion PYC { $$ = new ModificarVector1D.default($1, $3, $6, @1.first_line, @1.first_column ) }
;

acceso_vdd : ID CORCHIN expresion CORCHFIN CORCHIN expresion CORCHFIN{ $$ = new AccesoVector2D.default($1, $3, $6, @1.first_line, @1.first_column) }
;

modificar_vdd : ID CORCHIN expresion CORCHFIN CORCHIN expresion CORCHFIN IGUAL expresion PYC { $$ = new ModificarVector2D.default($1, $3, $6, $9, @1.first_line, @1.first_column ) }
;

// metodo_fun : tipos ID PARIN params LLAVEIN instrucciones LLAVEFIN { $$ = new MetodoFuncion.default($2, $1, $6, @1.first_line, @1.first_column, $4) }    
// ;
metodo_fun : r_VOID ID PARIN params LLAVEIN instrucciones LLAVEFIN { $$ = new Metodo.default($2, new Tipo.default(Tipo.tipoD.VOID), $6, @1.first_line, @1.first_column, $4) }    
;

funcion : tipos ID PARIN params LLAVEIN instrucciones LLAVEFIN { $$ = new Funcion.default($2, $1, $6, @1.first_line, @1.first_column, $4) }
;

params : lista_params PARFIN { $$ = $1 }
        | PARFIN { $$ = [] }
;

lista_params : lista_params COMA parametros { $1.push($3); $$ = $1 }
                | parametros { $$ = [$1] }
;

parametros : tipos ID { $$ = {tipo: $1, id: [$2], accion: 1} }
            | tipos ID CORCHIN CORCHFIN { $$ = {tipo: $1, id: [$2], accion: 2} }
            // | tipos ID CORCHIN CORCHFIN CORCHIN CORCHFIN { $$ = {tipo: $1, id: [$2], vdd: true} }
;

execute_s : EXECUTE ID PARIN params_call PYC { $$ = new Execute.default($2, @1.first_line, @1.first_column, $4) }
;

llamada_s : ID PARIN params_call { $$ = new Llamada.default($1, @1.first_line, @1.first_column, $3) }
;

params_call : lista_paramsC PARFIN { $$ = $1 }
                | PARFIN { $$ = [] }
;

lista_paramsC : lista_paramsC COMA expresion { $1.push($3); $$ = $1 }
                | expresion { $$ = [$1] }
;

return_s : RETURN PYC { $$ = new Return.default(@1.first_line, @1.first_column) }
        | RETURN expresion PYC { $$ = new Return.default(@1.first_line, @1.first_column, $2) }
;

// fin_return : expresion PYC { $$ = $1 }
//             | PYC { $$ = undefined }
// ;

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
        | acceso_vud { $$ = $1 }
        | acceso_vdd { $$ = $1 }
        | llamada_s { $$ = $1 }
        // | inicia_par { $$ = $1 }
;

tipos : STD DOSPUNTOS DOSPUNTOS r_STRING { $$ = new Tipo.default(Tipo.tipoD.CADENA) } 
        | r_INT { $$ = new Tipo.default(Tipo.tipoD.INT) } 
        | r_DOUBLE { $$ = new Tipo.default(Tipo.tipoD.DOUBLE) } 
        | r_BOOL { $$ = new Tipo.default(Tipo.tipoD.BOOL) } 
        | r_CHAR { $$ = new Tipo.default(Tipo.tipoD.CHAR) } 
        // | r_VOID { $$ = new Tipo.default(Tipo.tipoD.VOID) } 
;

// tipos_relacionales : MENOR { $$ = Relacionales.Relacional.MENOR  }
// ;

// expresion : NUM
//             | DOUBLE
//             | ID
//             | CADENA
// ;