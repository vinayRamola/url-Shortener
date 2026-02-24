const characters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function encodeBase62(num) {
    let result = "";
    while (num > 0) {
        result = characters[num % 62] + result;
        num = Math.floor(num / 62);
    }
    return result || "0";
}

module.exports = { encodeBase62 };