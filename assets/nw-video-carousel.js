class NwVideoCarousel extends HTMLElement {
  connectedCallback() {
    this.swiperEl = this.querySelector('.swiper');
    if (!this.swiperEl) return;

    this.loop = this.dataset.loop === 'true';
    this.autoplay = this.dataset.autoplay === 'true';
    this.delay = (Number(this.dataset.delay) || 3) * 1000;

    this.onClick = this.handleClick.bind(this);
    this.onEnded = this.handleEnded.bind(this);
    this.addEventListener('click', this.onClick);
    this.addEventListener('ended', this.onEnded, true);

    window.nwWhenSwiperReady(() => {
      if (!this.isConnected) return;

      const autoplayConfig = window.nwAutoplayEnabled(this.autoplay)
        ? { delay: this.delay, disableOnInteraction: false }
        : false;

      this.swiper = new Swiper(this.swiperEl, {
        slidesPerView: 'auto',
        spaceBetween: 16,
        centeredSlides: true,
        loop: true,
        autoplay: autoplayConfig,
        breakpoints: {
          750: {
            centeredSlides: false,
            spaceBetween: 24,
          },
        },
      });
    });
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.onClick);
    this.removeEventListener('ended', this.onEnded, true);
    if (this.swiper) {
      this.swiper.destroy(true, true);
      this.swiper = null;
    }
  }

  handleClick(event) {
    const slide = event.target.closest('.nw-video-carousel__slide');
    if (!slide) return;

    const video = slide.querySelector('video');
    if (!video) return;

    if (video.paused) {
      this.querySelectorAll('video').forEach((other) => {
        if (other !== video && !other.paused) {
          other.pause();
          other.closest('.nw-video-carousel__slide')?.classList.remove('is-playing');
        }
      });

      video.play();
      slide.classList.add('is-playing');
      this.swiper?.autoplay?.stop();
    } else {
      video.pause();
      slide.classList.remove('is-playing');
    }
  }

  handleEnded(event) {
    const slide = event.target.closest('.nw-video-carousel__slide');
    if (slide) {
      slide.classList.remove('is-playing');
    }
  }
}

if (!customElements.get('nw-video-carousel')) {
  customElements.define('nw-video-carousel', NwVideoCarousel);
}
