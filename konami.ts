export class Konami {

  private handlers: (() => void)[]
  private sequence: string[];
  private konamiCode: string[];

  constructor() {

    this.handlers = [];
    this.sequence = [];
    this.konamiCode = ['38', '38', '40', '40', '37', '39', '37', '39', '66', '65'];

    document.addEventListener('keydown', event => this.handleKeyboardEvent(event));
  }

  public registerHandler(handler: () => void) {
    this.handlers.push(handler);
  }

  private activate() {
    console.log('Konami activated');
    this.handlers.forEach(handler => handler());
  }

  private handleKeyboardEvent(event) {
    
    if (event.keyCode) {
      this.sequence.push(event.keyCode.toString());
      
      if (this.sequence.length > this.konamiCode.length) {
        this.sequence.shift();
      }
      if (this.isKonamiCode()) {
        this.activate();
      }
    }
  };

  private isKonamiCode = function () {
    return this.konamiCode.every((code, index) => code === this.sequence[index]);
  };
}
