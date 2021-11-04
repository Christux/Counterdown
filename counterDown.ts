import { Chart } from './chart';

export class CounterDown {

  private chart: Chart;

  private started = false;
  private paused = false;
  private interval: any;
  private endTime: number;
  private pauseTime: number;
  private frameDelay = 50; // ms

  constructor(
    private canvas: HTMLCanvasElement,
    private hourInput: HTMLInputElement,
    private minuteInput: HTMLInputElement,
    private secondInput: HTMLInputElement,
    private startButton: HTMLButtonElement,
    private resetButton: HTMLButtonElement
  ) {
    this.chart = new Chart(this.canvas);

    this.initChart();
    this.registerEvents();
  }

  private initChart() {
    
    if(this.valid()) {
      this.enableButtons()
      this.render(1);
    }
    else {
      this.disableButtons();
    }    
  }

  private run() {

    if (!this.paused) {

      if (Date.now() > this.endTime) {
        this.render(0);
        this.reset();
      }
      else {
        this.render((this.endTime - Date.now()) / this.getDuration());
      }
    }
  }

  private getMaxDigit(): number {

    const duration = this.getDuration() / 1000; // in s

    if (duration / 3600 > 2) {
      return Math.round(duration / 3600);
    }
    if (duration / 60 > 2) {
      return Math.round(duration / 60);
    }
    else {
      return duration;
    }
  }

  private render(ratio: number) {
    this.chart.set(ratio, this.getMaxDigit());
    this.chart.render();
  }

  private getDuration(): number {

    const hours = parseInt(this.hourInput.value) || 0;
    const minutes = parseInt(this.minuteInput.value) || 0;
    const seconds = parseInt(this.secondInput.value) || 0;

    return (seconds + ( minutes + ( hours * 60)) * 60) * 1000;
  }

  private valid(): boolean {

    const hours = parseInt(this.hourInput.value) || 0;
    const minutes = parseInt(this.minuteInput.value) || 0;
    const seconds = parseInt(this.secondInput.value) || 0;

    const validHours = hours >=0 && hours < 24;
    if(validHours) {
      this.hourInput.className = "valid";
    }
    else {
      this.hourInput.className = "invalid";
    }

    const validMinutes = minutes >=0 && minutes < 60;
    if(validMinutes) {
      this.minuteInput.className = "valid";
    }
    else {
      this.minuteInput.className = "invalid";
    }

    const validSeconds = seconds >=0 && seconds < 60;
    if(validSeconds) {
      this.secondInput.className = "valid";
    }
    else {
      this.secondInput.className = "invalid";
    }

    return validHours && validMinutes && validSeconds && this.getDuration() > 0;
  }

  private disableInputs() {
    this.hourInput.disabled = true;
    this.minuteInput.disabled = true;
    this.secondInput.disabled = true;
  }

  private enableInputs() {
    this.hourInput.disabled = false;
    this.minuteInput.disabled = false;
    this.secondInput.disabled = false;
  }

  private disableButtons() {
    this.startButton.disabled = true;
    this.resetButton.disabled = true;
  }

  private enableButtons() {
    this.startButton.disabled = false;
    this.resetButton.disabled = false;
  }

  start() {
    this.started = true;
    this.paused = false;
    this.startButton.innerText = 'Pause';
    this.disableInputs();

    this.endTime = Date.now() + this.getDuration();

    this.interval = setInterval(() => {
      this.run();
    }, this.frameDelay);
  }

  pause() {
    this.paused = true;
    this.startButton.innerText = 'Resume';
    this.pauseTime = Date.now();
  }

  resume() {
    this.paused = false;
    this.startButton.innerText = 'Pause';

    const pauseDuration = Date.now() - this.pauseTime;
    this.endTime += pauseDuration;
  }

  reset() {
    clearInterval(this.interval);
    this.started = false;
    this.paused = false;
    this.interval = null;
    this.startButton.innerText = 'Start';
    this.enableInputs();
  }

  private registerEvents() {

    this.startButton.addEventListener('click', () => {

      if (!this.started) {
          this.start();
      }
      else {
        if (this.paused) {
          this.resume();
        }
        else {
          this.pause();
        }
      }
    });

    this.resetButton.addEventListener('click', () => {

      if (this.started) {
        this.reset();
        this.initChart();
      }
    });

    this.hourInput.addEventListener('keyup', () => {
      this.initChart();
    });

    this.hourInput.addEventListener('change', () => {
      this.initChart();
    });

    this.minuteInput.addEventListener('keyup', () => {
      this.initChart();
    });

    this.minuteInput.addEventListener('change', () => {
      this.initChart();
    });

    this.secondInput.addEventListener('keyup', () => {
      this.initChart();
    });

    this.secondInput.addEventListener('change', () => {
      this.initChart();
    });
  }
}
