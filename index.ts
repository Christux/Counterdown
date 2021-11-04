// Import stylesheets
import './style.css';
import { CounterDown } from './counterDown';
import { Konami } from './konami';
import { Stars } from './stars';

// Write TypeScript code!
const pieChartElement: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('pieChart');
const hours: HTMLInputElement = <HTMLInputElement>document.getElementById('hours');
const minutes: HTMLInputElement = <HTMLInputElement>document.getElementById('minutes');
const seconds: HTMLInputElement = <HTMLInputElement>document.getElementById('seconds');
const start: HTMLButtonElement = <HTMLButtonElement>document.getElementById('go');
const reset: HTMLButtonElement = <HTMLButtonElement>document.getElementById('reset');

const size = Math.min(window.innerWidth, window.innerHeight);

pieChartElement.width = size * 0.8;
pieChartElement.height =  size * 0.8;

new CounterDown(pieChartElement, hours, minutes, seconds, start, reset);

let i = 0;
new Konami().registerHandler((): void => {

  if(i == 0) {
    new Stars().start();
  }

  i++;
});
