function reverse(str) {
    const chars = str.split("");
    chars.reverse();
    return chars.join("");
}

module.exports = {
    reverse
}