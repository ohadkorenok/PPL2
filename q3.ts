import {map, zipWith} from "ramda";
import {
    CExp,
    Parsed,
    PrimOp,
    AppExp,
    LitExp,
    isBoolean,
    isNumExp,
    isStrExp,
    isVarRef,
    isCompoundExp, CompoundExp, Binding
} from "./imp/L3-ast";
import {
    makeAppExp,
    makeDefineExp,
    makeIfExp,
    makeProcExp,
    makeProgram,
    makePrimOp,
    makeLetExp,
    makeBinding,
    makeLitExp
} from "./imp/L3-ast";
import {
    isAppExp,
    isAtomicExp,
    isCExp,
    isDefineExp,
    isIfExp,
    isLetExp,
    isLitExp,
    isPrimOp,
    isProcExp,
    isProgram
} from "./imp/L3-ast";
import {isError} from './imp/error';
import {makeEmptySExp, isEmptySExp, isCompoundSExp, SExp, isSExp, isClosure, isSymbolSExp} from "./imp/L3-value";
import {first, second, rest} from './imp/list';

/*
Purpose: @TODO
Signature: @TODO
Type: @TODO
*/
export const l3ToL30 = (exp: Parsed | Error): Parsed | Error =>
    isProgram(exp) ? map(l3ToL30, exp.exps) :
        isDefineExp(exp) ? makeDefineExp(exp.var, workWithCexpressions(exp.val)) :
            isError(exp) ? exp :
                isCExp(exp) ? workWithCexpressions(exp)
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

const workWithLit = (exp: LitExp): AppExp | LitExp => {
    return isCompoundSExp(exp.val) ? makeAppExp(makePrimOp('cons'), [makeLitExp(exp.val.val1), workWithLit(makeLitExp(exp.val.val2))]) :
        isSymbolSExp(exp.val) ? makeAppExp(makePrimOp('cons'), [makeLitExp(exp.val), makeLitExp(makeEmptySExp())]) :
            exp;
};

const workWithCexpressions = (exp: CExp): CExp => {
    return isAtomicExp(exp) ? exp :
        isIfExp(exp) ? makeIfExp(workWithCexpressions(exp.test), workWithCexpressions(exp.then), workWithCexpressions(exp.alt)) :
            isProcExp(exp) ? makeProcExp(map(workWithCexpressions, exp.args), map(workWithCexpressions, exp.body)) :
                isLitExp(exp) ? workWithLit(exp) :
                    isAppExp(exp) ?
                        isPrimOp(exp.rator) && exp.rator.op === 'list' ? // Check if the value is list
                            makeAppExp(makePrimOp('cons'), [
                                isCompoundExp(first(exp.rands)) ? workWithCexpressions(first(exp.rands)) :
                                    first(exp.rands),
                                rest(exp.rands).length === 0 ? makeLitExp(makeEmptySExp()) :
                                    workWithCexpressions(makeAppExp(makePrimOp('list'), rest(exp.rands)))]) :

                            isPrimOp(exp.rator) && exp.rator.op === 'cons' ?
                                makeAppExp(makePrimOp('cons'), [isCompoundExp(first(exp.rands)) ? workWithCexpressions(first(exp.rands)) : first(exp.rands),
                                    isCompoundExp(second(exp.rands)) ? workWithCexpressions(second(exp.rands)) : second(exp.rands)]) :
                                isProcExp(exp.rator) ? makeAppExp(makeProcExp(exp.rator.args, map(workWithCexpressions, exp.rator.body)), map(workWithCexpressions, exp.rands )): exp:
                        isLetExp(exp)? makeLetExp(map(workWithBind, exp.bindings), map(workWithCexpressions, exp.body)) : exp;


};

const workWithBind = (bindObject: Binding ) : Binding =>
{
    return makeBinding(bindObject.var.var, workWithCexpressions(bindObject.val));
};