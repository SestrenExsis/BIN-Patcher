
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

export function parsePropertyPath(propertyPath, patchInfo) {
    let parentNode = null
    let node = patchInfo
    let propertyName = null
    for (const pathSegment of propertyPath.split('.')) {
        propertyName = pathSegment
        if (node.hasOwnProperty(propertyName)) {
            parentNode = node
            node = node[propertyName]
        }
        else if (node.hasOwnProperty('aliases') && node.aliases.hasOwnProperty(propertyName)) {
            const elementIndex = node.aliases[propertyName]
            parentNode = node
            node = node.data[elementIndex]
        }
        else {
            console.log(propertyPath, pathSegment)
            node[propertyName] = {}
            parentNode = node
            node = node[propertyName]
            // console.log(node)
            // throw new Error('Property not found:', propertyPath)
        }
    }
    const result = {
        parentNode: parentNode,
        node: node,
        propertyName: propertyName,
    }
    return result
}

export function applyChange(patchInfo, changeInfo) {
    switch (changeInfo.changeType) {
        case 'merge':
            applyMerge(patchInfo, changeInfo.merge)
            break
        case 'extend':
            // TODO(sestren): Implement extend (goes to _writes?)
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
        const parsedPatch = parsePropertyPath(propertyPath, patchInfo)
        if (parsedPatch.propertyName == 'data' || parsedPatch.propertyName == 'metadata')  {
            parsedPatch.parentNode[parsedPatch.propertyName] = mergeNode
        }
        else if (typeof mergeNode === 'object')  {
            applyMerge(parsedPatch.node, mergeNode)
        }
        else {
            parsedPatch.parentNode[parsedPatch.propertyName] = mergeNode
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