
/**
 * returns the normal of a vector between two points
 * @param p1 start of the vector
 * @param p2 end of the vector
 * @param length adjust the length of the normal
 * @returns the normal of the vector, with length = length
 */
export const normal = (p1:{x:number,y:number}, p2: {x:number,y:number}, length : number = 2) => {
    let dx = p2.x - p1.x;
    let dy = p2.y - p1.y;

    let dLength = Math.sqrt(dx ** 2 + dy**2);
    
    return {x : -dy/dLength * length, y : dx/dLength * length};
}

/**
 * the average of two numbers
 * @param a first number
 * @param b second number
 * @returns the average of a and b
 */
export const average = (a:number, b: number) => {
    return (a + b) / 2
}

/**
 * contain a value between two other values
 * @param value the value to contain
 * @param min if the value is smaller than min, return min
 * @param max if the value is greater than max, return max
 * @returns 
 */
export const contain = (value:number, min: number, max: number) => {
    return Math.min(Math.max(value,min),max);
}

/**
 * Get the position in percentage of a value in a range of a given length starting in min.
 * @param value the value to find the position of
 * @param min the start of the range
 * @param length the length of the range
 * @returns some value between 0 and 100
 */
export const relPos = (value:number, min: number, length:number) => {
    return  contain((value - min) * 100/length,0,100);
}