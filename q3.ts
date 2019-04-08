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
Purpose: Converting the AST from l3 to l30
Signature: l3ToL30(exp)
Type: [exp: Parsed | Error => Parsed | Error]
*/
export const l3ToL30 = (exp: Parsed | Error): Parsed | Error =>
    isProgram(exp) ? map(l3ToL30, exp.exps) :
        isDefineExp(exp) ? makeDefineExp(exp.var, workWithCexpressions(exp.val)) :
            isError(exp) ? exp :
                isCExp(exp) ? workWithCexpressions(exp)
                    : exp;


export const workWithLit = (exp: LitExp): AppExp | LitExp => {
    return isCompoundSExp(exp.val) ? makeAppExp(makePrimOp('cons'), [makeLitExp(exp.val.val1), workWithLit(makeLitExp(exp.val.val2))]) :
        isSymbolSExp(exp.val) ? makeAppExp(makePrimOp('cons'), [makeLitExp(exp.val), makeLitExp(makeEmptySExp())]) :
            exp;
};

export const workWithCexpressions = (exp: CExp): CExp => {
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

export const workWithBind = (bindObject: Binding ) : Binding =>
{
    return makeBinding(bindObject.var.var, workWithCexpressions(bindObject.val));
};