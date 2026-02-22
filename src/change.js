
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

export function getCanonicalPath(nonNormalPath, startingNode) {
    let canonicalPath = []
    let currentNode = startingNode
    for (let pathToken of nonNormalPath.split('.')) {
        const assignmentInd = pathToken.at(-1) === '='
        if (assignmentInd) {
            pathToken = pathToken.slice(0, -1)
        }
        const segmentsToPush = []
        if (currentNode?.hasOwnProperty(pathToken)) {
            currentNode = currentNode[pathToken]
            segmentsToPush.push(pathToken)
        }
        else if (currentNode?.hasOwnProperty('aliases') && currentNode?.aliases.hasOwnProperty(pathToken)) {
            const elementIndex = currentNode.aliases[pathToken]
            currentNode = currentNode.data[elementIndex]
            segmentsToPush.push('data')
            segmentsToPush.push(elementIndex)
        }
        else {
            currentNode = null
            segmentsToPush.push(pathToken)
        }
        canonicalPath = canonicalPath.concat(segmentsToPush)
        if (assignmentInd) {
            canonicalPath.push('=')
        }
    }
    const result = canonicalPath
    return result
}

export function traverseCanonicalPath(canonicalPath, startingNode) {
    let currentNode = startingNode
    for (const pathToken of canonicalPath) {
        if (typeof currentNode === 'object' && !currentNode.hasOwnProperty(pathToken)) {
            currentNode[pathToken] = {}
        }
        currentNode = currentNode[pathToken]
    }
    const result = currentNode
    return result
}

export function applyChange(patchInfo, changeInfo) {
    switch (changeInfo.changeType) {
        case 'merge':
            applyMerge(patchInfo, changeInfo.merge)
            break
        case 'evaluate':
            for (const evaluateKey of changeInfo.evaluate.evaluationOrder) {
                const evaluateInfo = changeInfo.evaluate.evaluations[evaluateKey]
                applyEvaluate(patchInfo, evaluateInfo)
            }
            break
    }
}

export function applyMerge(patchInfo, mergeInfo) {
    Object.entries(mergeInfo).forEach(([propertyPath, mergeNode]) => {
        const canonicalPath = getCanonicalPath(propertyPath, patchInfo)
        if (canonicalPath.at(-1) === '=') {
            const assignmentInd = canonicalPath.pop()
            const propertyName = canonicalPath.pop()
            const patchNode = traverseCanonicalPath(canonicalPath, patchInfo)
            patchNode[propertyName] = mergeNode
        }
        else {
            const patchNode = traverseCanonicalPath(canonicalPath, patchInfo)
            applyMerge(patchNode, mergeNode)
        }
    })
}

export function applyEvaluate(patchInfo, evaluateInfo) {
    let currentValue;
    for (const actionInfo of evaluateInfo) {
        switch (actionInfo.action) {
            case 'get':
                // TODO(sestren): Implement getting address
                // TODO(sestren): Implement getting constant
                currentValue = parsePropertyPath(actionInfo.property, patchInfo).node
                break
            case 'set':
                if (actionInfo.type == 'property') {
                    const parsedPath = parsePropertyPath(actionInfo.property, patchInfo)
                    parsedPath.parentNode[parsedPath.propertyName] = currentValue
                }
                else if (actionInfo.type == 'address') {
                    if (!patchInfo.hasOwnProperty('_writes')) {
                        patchInfo['_writes'] = {}
                    }
                    const write = {
                        data: currentValue,
                        metadata: {
                            address: actionInfo.address,
                            element: actionInfo.element,
                        },
                    }
                    patchInfo['_writes'][actionInfo.name] =write
                }
                break
            case 'add':
                if (actionInfo.type == 'property') {
                    currentValue += parsePropertyPath(actionInfo.property, patchInfo).node
                }
                else {
                    currentValue += actionInfo.constant
                }
                break
            case 'subtract':
                if (actionInfo.type == 'property') {
                    currentValue -= parsePropertyPath(actionInfo.property, patchInfo).node
                }
                else {
                    currentValue -= actionInfo.constant
                }
                break
            case 'multiply':
                if (actionInfo.type == 'property') {
                    currentValue *= parsePropertyPath(actionInfo.property, patchInfo).node
                }
                else {
                    currentValue *= actionInfo.constant
                }
                break
            }
        console.log(currentValue)
    }
}