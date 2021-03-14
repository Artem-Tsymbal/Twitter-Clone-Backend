const handlerId = {
  getLocationOf(array: string[], item: string, start: number, end: number): number {
    if (array.length === 0) return -1;

    const middle = Math.floor((end + start) / 2);

    if (array[middle] === item) return middle;

    if (array.length === 1) {
      if (item < array[start]) return -1;
      return 0;
    }

    if (end - start <= 1) {
      if (item < array[start]) return middle - 1;
      return middle;
    }

    if (array[middle] < item) return this.getLocationOf(array, item, middle, end);

    return this.getLocationOf(array, item, start, middle);
  },

  searchId(array: string[], item: string): number {
    let start = 0;
    let end = array.length - 1;

    while (start <= end) {
      const middle = Math.floor((start + end) / 2);

      if (array[middle].toString() === item) {
        return middle;
      } if (array[middle] < item) {
        start = middle + 1;
      } else {
        end = middle - 1;
      }
    }

    return -1;
  },

  insertId(item: string, array: string[]): string[] {
    array.splice(this.getLocationOf(array, item, 0, array.length) + 1, 0, item);

    return array;
  },
};

export default handlerId;
