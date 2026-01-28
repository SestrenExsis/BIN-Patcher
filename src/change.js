
// A CHANGE file describes an ordered list of operations intended to alter a given PATCH file, the possible operations are:
//  - MERGE: Directly overwrite one or more mapped values in the PATCH file, in accordance with the mappings already provided
//  - EXTEND: Defines a new mapping and provides its own data and metadata to facilitate it
//  - EVALUATE: An operation that reads from and writes to the PATCH file via a set of simple instructions
// One or more CHANGE files can be applied to a given PATCH file in succession to alter it

// CHANGE file
//  - authors
//  - description
//  - changes (MERGE | EXTEND | EVALUATE)[]

// MERGE
// changeType: merge
// merge: ... data

// EXTEND
// changeType: extend
// extend: ... data + metadata

// EVALUATE
// changeType: evaluate
// evaluate:
//   evaluationOrder: ...
//   evaluations: ...

export function parsePropertyPath(propertyPath, patchInfo, aliasInfo) {
    const parsedPath = {
        parent: null,
        propertyName: null,
        node: patchInfo,
    }
    let aliasElement = aliasInfo
    propertyPath.split('.').forEach((propertyName) => {
        console.log(propertyName)
        parsedPath.propertyname = propertyName
        if (aliasElement.hasOwnProperty(propertyName)) {
            aliasElement = aliasElement[propertyName]
        }
        if (parsedPath.node.hasOwnProperty(propertyName)) {
            parsedPath.parent = parsedPath.node
            parsedPath.node = parsedPath.node[propertyName]
        }
        else if (parsedPath.node.hasOwnProperty(aliasElement[propertyName])) {
            parsedPath.parent = parsedPath.node
            parsedPath.node = parsedPath.node[aliasElement[propertyName]]
        }
        else if (Array.isArray(parsedPath.node) && parsedPath.node.length >= aliasElement) {
            parsedPath.parent = parsedPath.node
            parsedPath.node = parsedPath.node.at(aliasElement)
        }
        else {
            console.log(propertyPath, propertyName)
            throw new Error('Property not found:', propertyPath)
        }
    })
    const result = parsedPath
    return result
}

export function applyChange(patchInfo, changeInfo, aliasesInfo) {
    switch (changeInfo.changeType) {
        case 'merge':
            break
        case 'extend':
            break
        case 'evaluate':
            changeInfo.evaluate.evaluationOrder.forEach((evaluateKey) => {
                console.log(evaluateKey)
                const evaluateInfo = changeInfo.evaluate.evaluations[evaluateKey]
                applyEvaluate(patchInfo, evaluateInfo, aliasesInfo)
            })
            break
    }
}

export function applyEvaluate(patchInfo, evaluateInfo, aliasesInfo) {
    let currentValue;
    evaluateInfo.forEach((actionInfo) => {
        console.log(actionInfo)
        switch (actionInfo.action) {
            case 'get':
                currentValue = parsePropertyPath(actionInfo.property, patchInfo, aliasesInfo).node
                break
            case 'set':
                if (actionInfo.type == 'property') {
                    const parsedPath = parsePropertyPath(actionInfo.property, patchInfo, aliasesInfo)
                    parsedPath.parent[parsedPath.propertyName] = currentValue
                }
                else if (actionInfo.type == 'address') {
                    // currentValue += actionInfo.constant
                }
                break
            case 'add':
                if (actionInfo.type == 'property') {
                    currentValue += parsePropertyPath(actionInfo.property, patchInfo, aliasesInfo).node
                }
                else {
                    currentValue += actionInfo.constant
                }
                break
            case 'subtract':
                if (actionInfo.type == 'property') {
                    currentValue -= parsePropertyPath(actionInfo.property, patchInfo, aliasesInfo).node
                }
                else {
                    currentValue -= actionInfo.constant
                }
                break
            case 'multiply':
                if (actionInfo.type == 'property') {
                    currentValue *= parsePropertyPath(actionInfo.property, patchInfo, aliasesInfo).node
                }
                else {
                    currentValue *= actionInfo.constant
                }
                break
            }
        console.log(currentValue)
    })
    // console.log(evaluateInfo.length)
}