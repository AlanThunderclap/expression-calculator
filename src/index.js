function eval() {
    // Do not use eval!!!
    return;
}

function* lexemeGenerator(expr) {
    let length = expr.length;
    let lastInt = "";

    for (let i = 0; i < length; i++) {
        let char = expr[i];

        if (char === " ")
            continue;
        
        if (char >= "0" && char <= "9")
            lastInt += char;
        else {
            if (lastInt !== "") {
                yield parseInt(lastInt);
                lastInt = "";
            }
                
            yield char;
        }
    }

    if (lastInt !== "")
        yield parseInt(lastInt);
}

function topOf(array) {
    return array[array.length - 1];
}

let operatorsPriority = {
    "*"     : 2,
    "/"     : 2,
    "+"     : 1,
    "-"     : 1,
    "empty" : 0
};

function priority(op1, op2) {
    return operatorsPriority[op1] - operatorsPriority[op2];
}

function execLastExpression(operands, operators) {
    let op2 = operands.pop();
    let op1 = operands.pop();
    let operator = operators.pop();
    let result = calc (operator, op1, op2);
    operands.push(result);
}

function calc(operator, op1, op2) {
    switch (operator) {
        case "+":
            return op1 + op2;
        case "-" : 
            return op1 - op2;
        case "*":
            return op1 * op2;
        case "/":
            if (op2 === 0)
                throw "TypeError: Division by zero.";
            return op1 / op2;
        case "empty":
        case "(":
            throw "ExpressionError: Brackets must be paired";
    }
}

function expressionCalculator(expr) {
    let lexemes = lexemeGenerator(expr);
    let operands = [];
    let operators = ["empty"];

    for (let lexeme of lexemes) {
        if (Number.isInteger(lexeme))
            operands.push(lexeme);
        else 
            switch (lexeme) {
                case "(":
                    operators.push(lexeme);
                    break;
                case ")":
                    while (topOf(operators) !== "(")
                        execLastExpression(operands, operators);
                    operators.pop();
                    break;
                default:
                    while (priority(topOf(operators), lexeme) >= 0)
                        execLastExpression(operands, operators);
                    
                    operators.push(lexeme);
                }
    }

    while (topOf(operators) !== "empty")
        execLastExpression(operands, operators);
    
    return topOf(operands);
}

module.exports = {
    expressionCalculator
}