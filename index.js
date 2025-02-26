function calculateCollatzSequence(startNumber) {
    let fullSequence = [startNumber];
    let currentValue = startNumber;

    while (currentValue !== 1) {
        currentValue = (currentValue % 2 === 0) ? currentValue / 2 : 3 * currentValue + 1;
        fullSequence.push(currentValue);
    }
    return fullSequence;
}

function findLongestCollatzSequence(upperLimit) {
    let maxChainLength = 0;
    let winnerNumber = 0;
    let sequenceLengths = {};


    for (let i = 1; i < upperLimit; i++) {
        let stepCount = 0;
        let currentValue = i;

        while (currentValue !== 1 && !sequenceLengths[currentValue]) {
            currentValue = (currentValue % 2 === 0) ? currentValue / 2 : 3 * currentValue + 1;
            stepCount++;
        }

        sequenceLengths[i] = stepCount + (sequenceLengths[currentValue] || 0);

        if (sequenceLengths[i] > maxChainLength) {
            maxChainLength = sequenceLengths[i];
            winnerNumber = i;
        }
    }

    return {
        startNumber: winnerNumber,
        sequenceLength: maxChainLength + 1,
        sequence: calculateCollatzSequence(winnerNumber)
    };
}

const result = findLongestCollatzSequence(1000000);
console.log(`En uzun Collatz dizisini üreten başlangıç sayısı: ${result.startNumber}`);
console.log(`Dizinin uzunluğu: ${result.sequenceLength}`);
console.log(`Dizinin ilk 10 elemanı: ${result.sequence.slice(0, 10).join(' -> ')}`);