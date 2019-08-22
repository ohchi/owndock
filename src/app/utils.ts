
export default class Utils {
    
  static getObjectHash(obj: object): string {

    return Utils.checksum(JSON.stringify(obj));
    // return stringHash(JSON.stringify(obj));
  }

  static collectEnvVarNames(composeEntity: object): Array<string> {

    let names = Utils
                .parseList(Utils.collectStringProperties(composeEntity))
                .filter((e,i,self) => self.findIndex(_e => _e == e) === i);

    return names
  }

  static splitIntoColumns(maxColCount: number, minColSize: number, arr: Array<any>): Array<Array<any>> {

    let colCount = maxColCount;
    let totalSize = arr.length;

    let colSize = Utils.calcColumns(colCount, totalSize);

    if (colSize.main < minColSize) {

      colCount = Math.ceil(totalSize / minColSize);
      colSize = Utils.calcColumns(colCount, totalSize);
    }

    let columns = [];
    let i = 0;

    for (let j = 0; j < colCount - 1; j++) {

      let col = [];
      columns.push(col);

      for (let k = 0; k < colSize.main; k++) {

        col.push(arr[i++]);
      }
    }

    let col = [];
    columns.push(col);

    for (let k = 0; k < colSize.last; k++) {

      col.push(arr[i++]);
    }

    return columns;
  }

  private static calcColumns(colCount: number, totalSize: number) {

    let mainColSize;
    let lastColSize;

    if (colCount == 1) {

      mainColSize = 0;
      lastColSize = totalSize;

    } else {

      mainColSize = Math.round(totalSize / colCount);
      lastColSize = totalSize - mainColSize * (colCount - 1)
    }

    return {
      main: mainColSize,
      last: lastColSize
    };
  }

  private static parseList(assignments: Array<string>): Array<string> {

    let list: Array<string> = [];

    for (const a of assignments) {
      
      let names = Utils.parseAssignmentExpression(a);

      if (names) list = list.concat(names);
    }

    return list;
  }

  private static collectStringProperties(service: Object|Array<any>, props: Array<string> = []): Array<string> {

    for (let key in service) {

      let value = service[key];

      if (Utils.isObjectLiteral(value) || value instanceof Array) {

        Utils.collectStringProperties(value, props);

      } else if (typeof value == 'string') {

        props.push(service[key]);
      }
    }

    return props;
  }

  private static isObjectLiteral(value: any): boolean {
    return Object.prototype.toString.call( value ) === '[object Object]';
  }

  private static parseAssignmentExpression(str: string): Array<string> {

    let arr = str.match(/\$\{\w+\}/g);
    
    if (!arr) return null;

    return arr.map(e => e.match(/\${(\w+)}/)[1]);
  }

  private static checksum(s: string): string {

    var chk = 0x12345678;
    var len = s.length;

    for (var i = 0; i < len; i++) {
      chk += (s.charCodeAt(i) * (i + 1));
    }

    return (chk & 0xffffffff).toString(16);
  }

}