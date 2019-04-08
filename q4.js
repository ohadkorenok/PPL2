"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
Purpose: To convert the L2 ast to python code.
Signature: l2ToPython(exp)
Type: [exp: Parsed | Error => string | Error]
*/
exports.l2ToPython = function (exp) {
    return error_1.isError(exp) ? exp.message :
        L3_ast_1.isProgram(exp) ? ramda_1.map(exports.l2ToPython, exp.exps).join("\n") :
            L3_ast_1.isBoolExp(exp) ? (exp.val ? 'True' : 'False') :
                L3_ast_1.isNumExp(exp) ? exp.val.toString() :
                    L3_ast_1.isVarRef(exp) ? exp.var :
                        L3_ast_1.isPrimOp(exp) ? exp.op :
                            L3_ast_1.isDefineExp(exp) ? exp.var.var + " = " +
                                exports.l2ToPython(exp.val) :
                                L3_ast_1.isProcExp(exp) ? "(" + "lambda " +
                                    ramda_1.map(function (p) { return p.var; }, exp.args).join(", ") + ": " +
                                    ramda_1.map(exports.l2ToPython, exp.body).join(" ") +
                                    ")" :
                                    L3_ast_1.isIfExp(exp) ? "("
                                        + exports.l2ToPython(exp.then) + " " +
                                        "if " +
                                        exports.l2ToPython(exp.test) + " " +
                                        "else " +
                                        exports.l2ToPython(exp.alt) +
                                        ")" :
                                        L3_ast_1.isAppExp(exp) ?
                                            L3_ast_1.isPrimOp(exp.rator) ?
                                                exp.rands.length > 1 ?
                                                    "(" +
                                                        ramda_1.map(exports.l2ToPython, exp.rands).join(" " + exports.l2ToPython(exp.rator) + " ") +
                                                        ")" :
                                                    "(" + exports.l2ToPython(exp.rator) + " " +
                                                        ramda_1.map(exports.l2ToPython, exp.rands).join(" " + exports.l2ToPython(exp.rator) + " ") +
                                                        ")" :
                                                exports.l2ToPython(exp.rator) + "(" + ramda_1.map(exports.l2ToPython, exp.rands).join(" )") + ")" :
                                            Error("Unknown expression: " + exp.tag);
};
var ramda_1 = require("ramda");
var L3_ast_1 = require("./imp/L3-ast");
var error_1 = require("./imp/error");
