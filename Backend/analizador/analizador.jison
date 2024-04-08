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

<<EOF>> return 'EOF';

. {console.log(yylloc.first_line, yylloc.first_column,'Lexico',yytext);}

/lex

// SINTACTICO

%start inicio

%%

inicio : EOF {return 0};