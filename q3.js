"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ramda_1 = require("ramda");
var L3_ast_1 = require("./imp/L3-ast");
var L3_ast_2 = require("./imp/L3-ast");
var L3_ast_3 = require("./imp/L3-ast");
var error_1 = require("./imp/error");
var L3_value_1 = require("./imp/L3-value");
var list_1 = require("./imp/list");
/*
Purpose: @TODO
Signature: @TODO
Type: @TODO
*/
exports.l3ToL30 = function (exp) {
    return L3_ast_3.isProgram(exp) ? ramda_1.map(exports.l3ToL30, exp.exps) :
        L3_ast_3.isDefineExp(exp) ? L3_ast_2.makeDefineExp(exp.var, workWithCexpressions(exp.val)) :
            error_1.isError(exp) ? exp :
                L3_ast_3.isCExp(exp) ? workWithCexpressions(exp)
                    // isIfExp(exp)? makeIfExp(l3ToL30(exp.test), l3ToL30(exp.then), l3ToL30(exp.alt)):
                    // isProcExp(exp)? makeProcExp(map(l3ToL30, exp.args), map(l3ToL30, exp.body)):
                    // isAtomicExp(exp) ? exp :
                    //     isLitExp(exp) ? workWithLit(exp):
                    //
                    //         //     isCompoundSExp(exp.val) ? makeAppExp(makePrimOp('cons'), [
                    //         //         isCompoundExp(exp.val.val1) ? l3ToL30(exp.val.val1) : l3ToL30(makeLitExp(exp.val.val1)),
                    //         //
                    //         //         isEmptySExp(exp.val.val2) ? makeLitExp(makeEmptySExp()): l3ToL30(makeLitExp(exp.val.val2))]):
                    //         isAppExp(exp) ?
                    //             isPrimOp(exp.rator) && exp.rator.op === 'list' ? // Check if the value is list
                    //                 isDefineExp(l3ToL30(first(exp.rands))) ? Error("Cannot define inside list") : //Check if we have define expression inside the list
                    //                     makeAppExp(makePrimOp('cons'), [
                    //                         isCompoundExp(first(exp.rands)) ? l3ToL30(first(exp.rands)) :
                    //                             first(exp.rands),
                    //                         rest(exp.rands).length === 0 ? makeLitExp(makeEmptySExp()) :
                    //                             l3ToL30(makeAppExp(makePrimOp('list'), rest(exp.rands)))]) :
                    //
                    //                 isPrimOp(exp.rator) && exp.rator.op === 'cons' ?
                    //                     isDefineExp(l3ToL30(first(exp.rands))) ? Error("Cannot define inside cons") :
                    //                         makeAppExp(makePrimOp('cons'), [isCompoundExp(first(exp.rands)) ? l3ToL30(first(exp.rands)) : first(exp.rands),
                    //                             isCompoundExp(second(exp.rands)) ? l3ToL30(second(exp.rands)) : second(exp.rands)])
                    //                     : exp
                    : exp;
};
//Else not cons
//
//
// : Error("Not AppExp") : Error("Not Cexp");
// isSExp(exp)?
// isCompoundSExp(exp)? makeAppExp(makePrimOp('cons'), [exp.val1, ]) :
// isLitExp(exp)? makeAppExp(makePrimOp('cons'), [exp.val])
// isAppExp(exp)?
// isLitExp(exp)? exp:
// isPrimOp(exp)? exp.op==='list'? exp.op = '' :  Error("Unknown expression: ") : Error("");
//
// const isList = (exp: Parsed | Error) : boolean =>
//     isCompoundSExp(exp)? isDefineExp(exp)? exp.
//     isLitExp(exp)? isCompoundExp(exp.val)? isList(exp.val) : isEmptySExp(exp.val)? true : false
var workWithLit = function (exp) {
    return L3_value_1.isCompoundSExp(exp.val) ? L3_ast_2.makeAppExp(L3_ast_2.makePrimOp('cons'), [L3_ast_2.makeLitExp(exp.val.val1), workWithLit(L3_ast_2.makeLitExp(exp.val.val2))]) :
        L3_value_1.isSymbolSExp(exp.val) ? L3_ast_2.makeAppExp(L3_ast_2.makePrimOp('cons'), [L3_ast_2.makeLitExp(exp.val), L3_ast_2.makeLitExp(L3_value_1.makeEmptySExp())]) :
            exp;
};
var workWithCexpressions = function (exp) {
    return L3_ast_3.isAtomicExp(exp) ? exp :
        L3_ast_3.isIfExp(exp) ? L3_ast_2.makeIfExp(workWithCexpressions(exp.test), workWithCexpressions(exp.then), workWithCexpressions(exp.alt)) :
            L3_ast_3.isProcExp(exp) ? L3_ast_2.makeProcExp(ramda_1.map(workWithCexpressions, exp.args), ramda_1.map(workWithCexpressions, exp.body)) :
                L3_ast_3.isLitExp(exp) ? workWithLit(exp) :
                    L3_ast_3.isAppExp(exp) ?
                        L3_ast_3.isPrimOp(exp.rator) && exp.rator.op === 'list' ? // Check if the value is list
                            L3_ast_2.makeAppExp(L3_ast_2.makePrimOp('cons'), [
                                L3_ast_1.isCompoundExp(list_1.first(exp.rands)) ? workWithCexpressions(list_1.first(exp.rands)) :
                                    list_1.first(exp.rands),
                                list_1.rest(exp.rands).length === 0 ? L3_ast_2.makeLitExp(L3_value_1.makeEmptySExp()) :
                                    workWithCexpressions(L3_ast_2.makeAppExp(L3_ast_2.makePrimOp('list'), list_1.rest(exp.rands)))
                            ]) :
                            L3_ast_3.isPrimOp(exp.rator) && exp.rator.op === 'cons' ?
                                L3_ast_2.makeAppExp(L3_ast_2.makePrimOp('cons'), [L3_ast_1.isCompoundExp(list_1.first(exp.rands)) ? workWithCexpressions(list_1.first(exp.rands)) : list_1.first(exp.rands),
                                    L3_ast_1.isCompoundExp(list_1.second(exp.rands)) ? workWithCexpressions(list_1.second(exp.rands)) : list_1.second(exp.rands)]) :
                                L3_ast_3.isProcExp(exp.rator) ? L3_ast_2.makeAppExp(L3_ast_2.makeProcExp(exp.rator.args, ramda_1.map(workWithCexpressions, exp.rator.body)), ramda_1.map(workWithCexpressions, exp.rands)) : exp :
                        L3_ast_3.isLetExp(exp) ? L3_ast_2.makeLetExp(ramda_1.map(workWithBind, exp.bindings), ramda_1.map(workWithCexpressions, exp.body)) : exp;
};
var workWithBind = function (bindObject) {
    return L3_ast_2.makeBinding(bindObject.var.var, workWithCexpressions(bindObject.val));
};
