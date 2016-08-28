class ArrayHelper {
  static flatten(arr) {
    return [].concat(...arr);
  }
  static unique(arr) {
    return Array.from(new Set(arr));
  }
}

export default ArrayHelper;
