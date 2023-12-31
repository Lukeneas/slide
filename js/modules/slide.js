export default class Slide {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);

    this.dist = {finalPosition: 0, startX:0,movement:0}
  }

  moveSlide(distX) {
    this.dist.movePosition = distX;
    this.slide.style.transform = `translate3d(${distX}px, 0, 0)`;
  }

  uptadePosition(clientX) {
    this.dist.movement = (this.dist.startX - clientX) * 1.6;
    return this.dist.finalPosition - this.dist.movement;
  }

  onStart(event) {
    let mousetype;
    if (event.type === 'mousedown') {
      event.preventDefault();
      this.dist.startX = event.clientX;
      mousetype = 'mousemove'
    } else {
      this.dist.startX = event.changedTouches[0].clientX;
      mousetype = 'touchmove';
    }
    
    this.wrapper.addEventListener(mousetype, this.onMove);
  }

  onMove(event) {
    const pointerPosition = (event.type === 'mousemove') ? event.clientX : event.changedTouches[0].clientX;
    const finalPosition = this.uptadePosition(pointerPosition);
    this.moveSlide(finalPosition);
  }

  onEnd(event) {
    const moveType = (event.type === 'mouseup') ? 'mousemove' : 'touchmove';
    this.wrapper.removeEventListener(moveType, this.onMove);
    this.dist.finalPosition = this.dist.movePosition;
  }

  addSlideEvents() {
    this.wrapper.addEventListener('mousedown', this.onStart);
    this.wrapper.addEventListener('touchstart', this.onStart);
    this.wrapper.addEventListener('mouseup', this.onEnd);
    this.wrapper.addEventListener('touchend', this.onEnd);
  }
  
  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
  }

  slidePosition(slide) {
    const margin = (this.wrapper.offsetWidth - slide.offsetWidth)/2;
    return -(slide.offsetLeft - margin);
  }

  slidesConfig() {
    this.slideArray = [...this.slide.children].map((element)=> {
      const position = this.slidePosition(element);
      console.log(position);
      return {
        position,
        element
      }
    });
  }

  slidesIndexNav(index) {
    const last = this.slideArray.length;
    this.index = {
      prev : index ? index - 1 : undefined,
      active : index,
      next : index === last ? undefined : index + 1,
    }
  }

  changeSlide(index) {
    this.activeSlide = this.slideArray[index]
    this.moveSlide(this.activeSlide.position);
    this.slidesIndexNav(index);
    this.finalPosition = this.activeSlide.position;
  }

  init() {
    if(this.wrapper){
      this.bindEvents();
      this.addSlideEvents();
      this.slidesConfig();
      return this;
    }
  }
}