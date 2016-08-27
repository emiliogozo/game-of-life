class ArrayHelper {
  static flatten(arr) {
    return [].concat(...arr);
  }
  static unique(arr) {
    return [...new Set(arr)];
  }
}

export default ArrayHelper;
