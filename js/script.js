class Address  {
    constructor(addAddress, showForm , changeCheckboxes, fieldInput, reloadButton, buttonEditLineId, lineAddressId, addedAddress, name, allAddresses, buttonDeleteLineId, cityInput, regionInput, streetInput) {
        this.addAddress = document.querySelector(addAddress);
        this.showForm = document.querySelectorAll(showForm);
        this.changeCheckboxes = document.querySelectorAll(changeCheckboxes);
        this.fieldInput = document.querySelectorAll(fieldInput);
        this.reloadButton = document.querySelector(reloadButton);
        this.buttonEditLineId = document.querySelectorAll(buttonEditLineId);
        this.lineAddressId = document.querySelector(lineAddressId);
        this.addedAddress = document.querySelector(addedAddress);
        this.name = document.querySelector(name);
        this.allAddresses = document.querySelector(allAddresses);
        this.buttonDeleteLineId = document.querySelectorAll(buttonDeleteLineId);
        this.cityInput = document.getElementById(cityInput);
        this.regionInput = document.getElementById(regionInput);
        this.streetInput = document.getElementById(streetInput);
    }

    init() {
        if(this.name && this.allAddresses && this.name.textContent != '' && this.allAddresses.textContent != '') 
            this.addedAddress.classList.add('block');
    }

    clickAddAddress() {
        this.addAddress.addEventListener('click', e => {
            e.target.remove();
            this.showForm.forEach(form => {
                form.classList.add('active');
                this.addedAddress.remove();
            });
        });
    }

   clickButtonEdit() {
        if(this.buttonEditLineId) {
            this.buttonEditLineId.forEach(button => {
                button.addEventListener('click', e => {
                    const id = e.target.dataset.form_id;
                    this.addedAddress.classList.add('not-active');
                    this.showForm[0].classList.add('active');
                    this.showForm[0].id = id;
                    this.addAddress.remove();
                })
            })
        }
   }

   clickButtonDelete() {
        let popupModal = document.querySelector('.page-address__modal');
        this.buttonDeleteLineId.forEach((button, i) => {
            button.id = `this_modal__${i}`;
            button.classList.add('js-modal');
            button.dataset.modal = `#this_modal__${i}`;
            button.addEventListener('click', e => {
            popupModal.id = e.currentTarget.id;
            popupModal.classList.add('show');
            });
        });
   }
    
    checkboxes() {
        if(this?.changeCheckboxes) {
            this.changeCheckboxes.forEach((checkbox, i) => {
                checkbox.querySelector('input[type="checkbox"]').id = `checked_${i}`;
                checkbox.querySelector('label:last-child').setAttribute('for', `checked_${i}`);
                checkbox.querySelector('input[type="checkbox"]').addEventListener('change', e => {
                    if(e.target?.checked) {
                        checkbox.nextElementSibling.style.display = 'none';
                        checkbox.nextElementSibling.querySelectorAll('input').forEach(input => {
                            input.type = 'hidden';
                        });
                    }else {
                        checkbox.nextElementSibling.style.display = 'flex';
                        checkbox.nextElementSibling.querySelectorAll('input').forEach(input => {
                            input.type = 'text';
                        });
                    }
                });
            });
        }
    }

    maskedInput() {
        let phone = document.querySelector('[data-mobile]');
        if(phone) {
            let phoneMask = IMask(
                phone, {
                    mask: '+{7}(000)000-00-00'
                });
        }
    }

    reloadPage() {
        if(this?.reloadButton) {
            this.reloadButton.onclick = () => {location.reload();}
        }
    }

    fieldsValid() {
        if(this?.fieldInput) {
            // let check = document.querySelector('.page-address-wrapper__list-address--checkbox');
            this.fieldInput.forEach(input => {
                // console.log(input);
                input.addEventListener('input', () => {
                    let city = document.querySelector('[data-control-valid] [data-city]').value,
                        area = document.querySelector('[data-control-valid] [data-area]').value,
                        streetHouse = document.querySelector('[data-control-valid] [data-street-house]').value,
                        lastName = document.querySelector('[data-control-valid] [data-lastname]').value,
                        mobile = document.querySelector('[data-control-valid] [data-mobile]').value,
                        // office = document.querySelector('[data-control-valid] [data-office]'),
                        // entrance = document.querySelector('[data-control-valid] [data-entrance]'),
                        // story = document.querySelector('[data-control-valid] [data-story]'),
                        buttonSave = document.querySelector('.page-address-wrapper__list-address--save');

                    if(city.length != 0 && area.length != 0 && mobile.length === 16
                        && streetHouse.length != 0 && lastName.length != 0 
                        ) {
                        buttonSave.classList.add('active');
                    } else {
                        buttonSave.classList.remove('active');
                    }

                });
            });
        }
    }  

    yandexApiMap() {
        // Получаем значения полей формы
		const cityInput = document.getElementById('city');
		const regionInput = document.getElementById('region');
		const streetInput = document.getElementById('street');
	  
		// Создаем карту и метку
		let myMap, myPlacemark;
	  
		function init() {
		  myMap = new ymaps.Map("map", {
			center: [43.2567, 76.9286], // координаты центра карты
			zoom: 16, // масштаб карты
            controls: []
		  });
	  
		  myPlacemark = new ymaps.Placemark(
			[55.76, 37.64], // координаты метки
			{ hintContent: '' }, // текст подсказки
			{ preset: 'islands#redDotIcon' } // иконка метки
		  );
	  
		  myMap.geoObjects.add(myPlacemark);
	  
		  // Обрабатываем изменения значений в полях формы
		  cityInput.addEventListener('input', updateMap);
		  regionInput.addEventListener('input', updateMap);
		  streetInput.addEventListener('input', updateMap);
		}
	  
		function updateMap() {
		  const city = cityInput.value;
		  const region = regionInput.value;
		  const street = streetInput.value;
	  
		  const address = `${city}, ${region}, ${street}`;
	  
		  // Получаем координаты адреса и обновляем карту
		  ymaps.geocode(address).then((res) => {
			const firstGeoObject = res.geoObjects.get(0);
	  
			const coords = firstGeoObject.geometry.getCoordinates();
			myPlacemark.geometry.setCoordinates(coords);
			myPlacemark.properties.set('hintContent', address);
	  
			myMap.setCenter(coords);
		  });
		}
	  
		ymaps.ready(init);
    }

    popupModal() {
        const backdrop = document.querySelector('#modal-backdrop');
        document.addEventListener('click', modalHandler);
    
        function modalHandler(evt) {
          const modalBtnOpen = evt.target.closest('.js-modal');
          if (modalBtnOpen) {
            const modalSelector = modalBtnOpen.dataset.modal;
            showModal(document.querySelector(modalSelector));
          }
    
          const modalBtnClose = evt.target.closest('.modal-close');
          if (modalBtnClose) {
            hideModal(modalBtnClose.closest('.page-address__modal'));
          }
    
          if (evt.target.matches('#modal-backdrop')) { 
            hideModal(document.querySelector('.page-address__modal.show'));
          }
        }
    
        function showModal(modalElem) {
          modalElem.classList.add('show');
          backdrop.classList.remove('hidden-modal-popup');
        }
    
        function hideModal(modalElem) {
          modalElem.classList.remove('show');
          backdrop.classList.add('hidden-modal-popup');
        }
    
      }
}


const extendAddress = new Address(
    '.page-address-wrapper__add-address',
    '.page-address-wrapper__list-address--created',
    '.page-address-wrapper__list-address--checkbox-wrp',
    '[data-control-valid] input',
    '.page-address-wrapper__list-address--cancel',
    '.page-address__added-addresses--edit',
    '.page-address__added-addresses--address',
    '.page-address__added-addresses',
    '.page-address__added-addresses--name',
    '.page-address__added-addresses--all-addresses',
    '.page-address__added-addresses--delete',
    'city',
    'region',
    'street'
);


const initAddress = () => {
    extendAddress.init();
    extendAddress.clickAddAddress();
    extendAddress.checkboxes();
    extendAddress.maskedInput();
    extendAddress.fieldsValid();
    extendAddress.reloadPage();
    extendAddress.clickButtonEdit();
    extendAddress.clickButtonDelete();
    extendAddress.yandexApiMap();
}

// ---------------------check and initialize the class -----------------------------
const classInitAddress = document.getElementById('page-address__init');
if(classInitAddress) initAddress();

