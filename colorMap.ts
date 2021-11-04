export class ColorMap {

  constructor(
    private min: number,
    private max: number
  ) { }

  private _hsv(offset: number, cursor: number): number {

    const position = (cursor + offset);
    const teta = (position >= 1 ? position -1 : position) * 360;
    let value = 0;

    if(teta <= 60) {
      value = teta / 60;
    }
    else if(teta > 60 && teta <= 180) {
      value = 1;
    }
    else if(teta > 180 && teta <= 240) {
      value = 1 - (teta - 180) / 60;
    }

    return Math.round(255 * value);
  }

  private _jet(offset: number, cursor: number): number {

    const position = (cursor + offset);
    const teta = (position >= 1 ? position -1 : position) * 5;

    let value = 0;

    if(teta <= 1) {
      value = teta;
    }
    else if(teta > 1 && teta <= 2) {
      value = 1;
    }
    else if(teta > 2 && teta <= 3) {
      value = 1 - (teta - 2);
    }

    return Math.round(255 * value);
  }

  hsv(value: number): number[] {

    let cursor = .5;
    
    if(Math.abs(this.min - this.max) > 1e-12) {
      cursor = (value- this.min) / (this.max - this.min);
    }

    return [
      this._hsv(2 / 3, 2/3 * cursor),
      this._hsv(0, 2/3 * cursor),
      this._hsv(1 / 3, 2/3 * cursor)
    ];
  }

  jet(value: number): number[] {

    let cursor = .5;
    
    if(Math.abs(this.min - this.max) > 1e-12) {
      cursor = (value- this.min) / (this.max - this.min);
    }

    return [
      this._jet(7/10, 4/5 * cursor),
      this._jet(9/10, 4/5 * cursor),
      this._jet(1/10, 4/5 * cursor)
    ];
  }
}