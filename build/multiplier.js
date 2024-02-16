"use strict";
// type Operation = 'add' | 'subtract' | 'multiply';
// const multiplier = (a: number, b: number, op: Operation) => {
//     if(op === 'add')
//     {
//         return a+b;
//     }
//     else if(op === 'subtract')
//     {
//         return a-b;
//     }
//     else
//     {
//         return a*b;
//     }
// };
// console.log(multiplier(4, 2, 'add'));
const multiplicator = (a, b, printText) => {
    console.log(printText, a * b);
};
const a = Number(process.argv[2]);
const b = Number(process.argv[3]);
console.log(multiplicator(a, b, `Multiplication of ${a} and ${b} is:`));
