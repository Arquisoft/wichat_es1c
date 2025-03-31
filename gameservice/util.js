/**
 * Generate a certain amount random IDs from a range to choose from.
 * @param {int} length Length of the original array 
 * @param {int} count Number of random IDs to generate
 * @returns {Array} Array containing the random IDs
 */
export function genRandomIDs(length, count)
{
    let arr = Array.from({ length: length }, (v, k) => k);

    for (let i = arr.length - 1; i > 0; i--)
    {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr.slice(0, count);
}

/**
 * Given an array, shuffle it and return it.
 * @param {Array} array Array to shuffle 
 * @returns {Array} Shuffled array
 */
export function shuffleArray(array)
{
    for (let i = array.length - 1; i > 0; i--)
    {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}