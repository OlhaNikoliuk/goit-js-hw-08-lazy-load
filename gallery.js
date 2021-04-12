import imagesGallery from './gallery-items.js';



const refs = {
  galleryContainer: document.querySelector('.js-gallery'),
  // images: document.querySelectorAll('.gallery__image'),
  modal: document.querySelector('.lightbox'),
  modalImgEl: document.querySelector('.lightbox__image'),
  modalCloseBtn: document.querySelector('[data-action="close-lightbox"]'),
  modalOverlay: document.querySelector('.lightbox__overlay'),

}

let currentIndex = null;


const galleryMarkup = createImageCardMarkup(imagesGallery);
refs.galleryContainer.insertAdjacentHTML('beforeend', galleryMarkup);

refs.galleryContainer.addEventListener('click', onImageClick);


function createImageCardMarkup(images) {

  return images.map(({ preview, original, description }) => {
    return `<li class="gallery__item">
  <a
    class="gallery__link"
    href="${original}"
  >
    <img
      loading = "lazy"
      class="gallery__image lazyload"
      data-src="${preview}"
      data-source="${original}"
      alt="${description}"
    />
  </a>
</li>`
  }).join('');
}


if ('loading' in HTMLImageElement.prototype) {
  const lazyImages = document.querySelectorAll('img[loading = "lazy"]');
  lazyImages.forEach(img => {
    img.src = img.dataset.src;
  })
} else {
  const script = document.createElement('script');
  script.src = "https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js";
  script.integrity = "sha512-q583ppKrCRc7N5O0n2nzUiJ+suUv7Et1JGels4bXOaMFQcamPk9HjdUknZuuFjBNs7tsMuadge5k9RzdmO+1GQ==";
  script.crossOrigin = "anonymous"

  document.body.appendChild(script);
}

const lazyImages = document.querySelectorAll('img[data-src]');

lazyImages.forEach(image => {
  image.addEventListener('load', onImageLoaded, { once: true }); // для каждой картинки добавлен слуш.событ, он будет вызван только, когда картинка ЗАГРУЗИТСЯ// once: true - слушатель сработает только 1 раз, а потом удалится
})

function onImageLoaded() {
  console.log('Картинка загрузилась');

}


function onImageClick(evt) {
  evt.preventDefault();

  refs.modalCloseBtn.addEventListener('click', onCloseBtnClick);
  refs.modalOverlay.addEventListener('click', onCloseBtnClick);
  window.addEventListener('keydown', onEscKeyPress);
  window.addEventListener('keydown', onArrowKeyPress);

  const currImage = evt.target;

  const isGalleryImage = evt.target.classList.contains('gallery__image');
  console.log(isGalleryImage);

  if (!isGalleryImage) {
    return;
  }

  imagesGallery.forEach((el, ind) => {

    if (el.original.includes(evt.target.dataset.source)) {
      currentIndex = ind;
    }
  });

  refs.modal.classList.add('is-open');
  refs.modalImgEl.src = currImage.dataset.source;
  refs.modalImgEl.alt = currImage.alt;
}

function onCloseBtnClick() {
  refs.modalCloseBtn.removeEventListener('click', onCloseBtnClick);
  refs.modalOverlay.removeEventListener('click', onCloseBtnClick);
  window.removeEventListener('keydown', onEscKeyPress);
  window.removeEventListener('keydown', onArrowKeyPress);

  refs.modal.classList.remove('is-open');
  refs.modalImgEl.src = '';
}

function onEscKeyPress(evt) {
  const ESC_KEY_CODE = 'Escape';
  if (evt.code === ESC_KEY_CODE) {
    onCloseBtnClick()
  }

}

function onRightChange() {

  if (currentIndex === imagesGallery.length - 1) {
    currentIndex = -1;
  }
  currentIndex += 1;
  changeCurrentIngex()
}

function onLeftChange() {

  if (currentIndex === 0) {
    currentIndex = imagesGallery.length;
  }
  currentIndex -= 1;
  changeCurrentIngex()
}


function changeCurrentIngex() {
  refs.modalImgEl.src = imagesGallery[currentIndex].original;
  refs.modalImgEl.alt = imagesGallery[currentIndex].description;
}


function onArrowKeyPress(evt) {
  const ARROW_RIGHT_KEY = 'ArrowRight';
  const ARROW_LEFT_KEY = 'ArrowLeft';
  if (evt.code === ARROW_RIGHT_KEY) {
    onRightChange();
  }
  if (evt.code === ARROW_LEFT_KEY) {
    onLeftChange();
  }
}