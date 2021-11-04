import { ColorMap } from './colorMap';


interface IPie {
  x0: number;
  y0: number;
  radius: number;
};

interface IParts {
  startAngle: number;
  endAngle: number;
  color: number[];
  scale: number;
};

export class Chart {

  private readonly grey = [128, 128, 128];
  private context: CanvasRenderingContext2D;
  private data: IParts[];
  private pie: IPie;
  private colorMap = new ColorMap(0, 1);
  private duration: number;
  private n: number;

  constructor(private canvas: HTMLCanvasElement) {
    this.context = canvas.getContext('2d');

    this.pie = {
      x0: this.canvas.width / 2,
      y0: this.canvas.height / 2,
      radius: Math.min(this.canvas.width, this.canvas.height) / 2 * .9
    };
  }

  set(ratio: number, duration: number) {

    const offset = 3 / 2 * Math.PI;

    this.data = [
      {
        startAngle: offset,
        endAngle: (1 - ratio) * 2 * Math.PI + offset,
        color: this.colorMap.jet(this.scale(1 - ratio, 30)),
        scale: 1
      },
      {
        startAngle: (1 - ratio) * 2 * Math.PI + offset,
        endAngle: 2 * Math.PI + offset,
        color: this.grey,
        scale: 0.95
      }
    ];

    if (this.duration !== duration) {
      this.duration = duration;

      const decomp = this.decomp(this.duration).sort((a,b)=>b-a);

      let n = 1;
      for(let i = 0, l = decomp.length; i < l; i++) {

        const m = n * decomp[i];

        if(m <= 9) {
          n = m;
        }
      }

      this.n = Math.max(n, 4);
    }
  }

  private clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private sum(array: number[]): number {
    let sum = 0;
    array.forEach(value => sum += value);
    return sum;
  }

  render() {
    this.drawPie();
  }

  private drawPie() {

    const ctx = this.context;
    const pie = this.pie;
    this.clear();

    // Draws digits
    const rt = pie.radius;
    const fontSize = Math.round(this.canvas.width * 0.05);

    ctx.fillStyle = this.colorToRgb(this.grey);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `bold ${fontSize}px sans-serif`;

    for (let i = 0; i < this.n; i++) {

      let angle = i / this.n * (2 * Math.PI) - Math.PI / 2;
      let x = pie.x0 + rt * Math.cos(angle);
      let y = pie.y0 + rt * Math.sin(angle);

      const digit = `${Math.round(i * this.duration / this.n)}`

      if (i === 0) {
        ctx.fillText(`${this.duration}`, x, y);
      } else {
        ctx.fillText(digit, x, y);
      }
    }

    // Draws parts
    this.data.forEach((part, idx) => {

      // Set style
      ctx.fillStyle = this.colorToRgb(part.color);
      ctx.strokeStyle = 'grey';

      ctx.beginPath();
      ctx.moveTo(pie.x0, pie.y0);

      ctx.arc(pie.x0, pie.y0, pie.radius * part.scale - fontSize, part.startAngle, part.endAngle);

      ctx.fill();
      ctx.closePath();
    });
  }

  private colorToRgb(color: number[]) {
    return `rgb(${color[0]},${color[1]},${color[2]})`
  }

  private scale(x: number, factor: number = 50): number {
    return 1 - Math.log(1 + factor * (1 - x)) / Math.log(1 + factor);
  }

  private decomp(x: number): number[] {

    if (x === 1) {
      return [1];
    }

    const result = [];
    let remaining = x;

    while (remaining !== 1) {

      if (remaining % 2 === 0) {
        result.push(2);
        remaining = remaining / 2;
      }
      else {
        let i = 3;
        while (remaining % i !== 0) {
          i = i + 2;
        }

        result.push(i);
        remaining = remaining / i;
      }
    }

    return result;
  }
}
