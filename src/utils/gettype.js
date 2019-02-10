function gettype(value) {
    return {}.toString
        .call(value)
        .match(/\s([a-zA-Z]+)/)[1]
        .toLowerCase();
}
export default gettype;
