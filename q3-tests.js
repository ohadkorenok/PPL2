"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var L3_ast_1 = require("./imp/L3-ast");
var L3_unparse_1 = require("./imp/L3-unparse");
var q3_1 = require("./q3");
var consObject = L3_ast_1.parseL3("(cons 1 (cons 2 (cons 3 '())))");
var listObject = L3_ast_1.parseL3("(list 1)");
var consObject1 = L3_ast_1.parseL3("(cons 1 '())");
var consObject2 = L3_ast_1.parseL3("(cons 1 '(1 2))");
var consObject3 = L3_ast_1.parseL3("(cons 1 2)");
var lambdaObject = L3_ast_1.parseL3("((lambda (x) (list x x)) 3)");



var listObjectBig = L3_ast_1.parseL3("(list 1 2 3 4 5)");
var letObjectList = L3_ast_1.parseL3("(let ((x '(1 2)) (y (list 3 4))) (list x y))");
var letObjectCons = L3_ast_1.parseL3("(let ((x (cons 1 (cons 2 '()))) (y (cons 3 (cons 4 '())))) (cons x (cons y '())))");

var listObjectLiteral = L3_ast_1.parseL3("'(1 2 3)");
var symbol = L3_ast_1.parseL3("1");




// console.log(nitzan);
// console.log("DIFFERENCE FROM HERE ::: \n");
//
// console.log(nitzan2);
var nitzan1 = L3_ast_1.parseL3("(list 1)");
var nitzan2 = q3_1.l3ToL30(nitzan1);
var nitzan3 = L3_unparse_1.unparseL3(consObject);

// assert.deepEqual(L3_unparse_1.unparseL3(q3_1.l3ToL30(L3_ast_1.parseL3("'()"))), "'()");
assert.deepEqual(L3_unparse_1.unparseL3(q3_1.l3ToL30(L3_ast_1.parseL3("(list 1)"))), "(cons 1 '())");
assert.deepEqual(L3_unparse_1.unparseL3(q3_1.l3ToL30(L3_ast_1.parseL3("(list 1 2)"))), "(cons 1 (cons 2 '()))");
assert.deepEqual(L3_unparse_1.unparseL3(q3_1.l3ToL30(L3_ast_1.parseL3("(list (list 1 2) (list 3 4))"))), "(cons (cons 1 (cons 2 '())) (cons (cons 3 (cons 4 '())) '()))");
assert.deepEqual(L3_unparse_1.unparseL3(q3_1.l3ToL30(L3_ast_1.parseL3("(list (cons 1 2) (cons 3 4))"))), "(cons (cons 1 2) (cons (cons 3 4) '()))");
assert.deepEqual(L3_unparse_1.unparseL3(q3_1.l3ToL30(L3_ast_1.parseL3("'(1 2 3)"))), "(cons 1 (cons 2 (cons 3 '())))");
assert.deepEqual(L3_unparse_1.unparseL3(q3_1.l3ToL30(L3_ast_1.parseL3("(list (cons (* 5  6) '(1 2 3)))"))), "(cons (cons (* 5 6) (cons 1 (cons 2 (cons 3 '())))) '())");
assert.deepEqual(L3_unparse_1.unparseL3(q3_1.l3ToL30(L3_ast_1.parseL3("(lambda (x) (list x 3))"))), "(lambda (x) (cons x (cons 3 '())))");
assert.deepEqual(L3_unparse_1.unparseL3(q3_1.l3ToL30(L3_ast_1.parseL3("(if (> x y) (list 1 2) '(3 4))"))), "(if (> x y) (cons 1 (cons 2 '())) (cons 3 (cons 4 '())))");
assert.deepEqual(L3_unparse_1.unparseL3(q3_1.l3ToL30(L3_ast_1.parseL3("(+ 3 4)"))), "(+ 3 4)");
assert.deepEqual(L3_unparse_1.unparseL3(q3_1.l3ToL30(L3_ast_1.parseL3("x"))), "x");
assert.deepEqual(L3_unparse_1.unparseL3(q3_1.l3ToL30(L3_ast_1.parseL3("((lambda (x) (* x x)) 3)"))), "((lambda (x) (* x x)) 3)");
assert.deepEqual(L3_unparse_1.unparseL3(q3_1.l3ToL30(L3_ast_1.parseL3("((lambda (x) (list x x)) 3)"))), "((lambda (x) (cons x (cons x '()))) 3)");
assert.deepEqual(L3_unparse_1.unparseL3(q3_1.l3ToL30(L3_ast_1.parseL3("((lambda (x) (list x x)) '(5 6))"))), "((lambda (x) (cons x (cons x '()))) (cons 5 (cons 6 '())))");
assert.deepEqual(L3_unparse_1.unparseL3(q3_1.l3ToL30(L3_ast_1.parseL3("(let ((x 5)) x)"))), "(let ((x 5)) x)");
assert.deepEqual(L3_unparse_1.unparseL3(q3_1.l3ToL30(L3_ast_1.parseL3("(let ((x '(1 2)) (y (list 3 4))) (list x y))"))), "(let ((x (cons 1 (cons 2 '()))) (y (cons 3 (cons 4 '())))) (cons x (cons y '())))");
