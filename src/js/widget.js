export default class Widget {
  constructor() {
    this.listBtn = document.querySelector('[data-id=list__btn]');
    this.dropDownList__main = document.querySelector('[data-id=drop-down-list__main]');
    this.dropDownList__holder = document.querySelector('[data-id=drop-down-list__holder]');
    this.listTitle = document.querySelector('[data-id=list__title]');
  }

  create() {
    this.addListener();
  }

  // eslint-disable-next-line class-methods-use-this
  listSeparator(gettetList) {
    const elementsArr = gettetList.split('|');
    let listArr = '';

    for (let i = 0; i < elementsArr.length; i += 1) {
      listArr += `<li class="drop-down-list__el">
            <input class="checkbox" type="checkbox" name="vacancy" value="vacancy_0${i}" data-id="vacancy_0${i}" data-vacancy="${elementsArr[i]}" id="vacancy_0${i}">
            <label class="checklist__label" for="vacancy_0${i}">${elementsArr[i]}</label>
          </li>`;
    }

    return listArr;
  }

  createDropList() {
    const ulEl = document.createElement('ul');

    ulEl.classList = 'drop-down-list drop-down-list--hidden';
    ulEl.setAttribute('data-id', 'drop-down-list');

    ulEl.innerHTML = this.listSeparator(this.dropDownList__holder.dataset.list);

    this.dropDownList__holder.appendChild(ulEl);
    setTimeout(() => {
      ulEl.classList.remove('drop-down-list--hidden');
    }, 50);
  }

  addListener() {
    this.dropDownList__main.addEventListener('click', () => {
      if (this.listBtn.classList.length === 2) {
        this.listBtn.classList.remove('list__btn--active');
        document.querySelector('[data-id=drop-down-list]').classList.add('drop-down-list--hidden');

        // Удалим список
        setTimeout(() => {
          this.addCheckboxListener();

          document.querySelector('[data-id=drop-down-list]').remove();
        }, 500);
      } else {
        this.listBtn.classList.add('list__btn--active');
        this.createDropList();

        // Если уже есть выбранные вакансии, то тогда вернём галочки на них
        if (this.dropDownList__holder.getAttribute('data-listchecked')) {
          this.createCheckingVacancy();
        }
      }
    });
  }

  addCheckboxListener() {
    const checkboxes = document.querySelectorAll('input[name="vacancy"]:checked');

    if (checkboxes.length !== 0) {
      const vacancyArr = [];
      this.vacancyArrContent = [];
      this.vacancyArrId = [];

      checkboxes.forEach((element) => {
        vacancyArr.push(this.dropDownList__holder.querySelector(`[data-id=${element.value}]`));
        this.vacancyArrContent.push(`${element.getAttribute('data-vacancy')},`);
        this.vacancyArrId.push(element.getAttribute('data-id'));
      });

      // Чтобы не потерять галочки
      this.dropDownList__holder.setAttribute('data-listchecked', `${this.vacancyArrId}`);

      this.createListTitle();
    } else {
      // Значит, что не выбрали вакансий никаких
      // Чтобы при повторном снятии очистить все галочки
      this.dropDownList__holder.removeAttribute('data-listchecked');
      this.listTitle.textContent = 'Выберите интересующие вакансии';
    }
  }

  createCheckingVacancy() {
    for (let i = 0; i < this.vacancyArrId.length; i += 1) {
      const element = this.vacancyArrId[i];

      console.info(this.dropDownList__holder.querySelector(`[data-id=${element}]`));
      this.dropDownList__holder.querySelector(`[data-id=${element}]`).checked = true;
    }
  }

  createListTitle() {
    console.log(`Ширина текстового поля равна: ${this.listTitle.offsetWidth}`);
    console.log(`Число символов в первой вакансии: ${this.vacancyArrContent[0].length}`);

    if (this.vacancyArrContent.length > 3) {
      this.listTitle.textContent = 'Выбрано больше 3-х вакансий';
    } else {
      let titleVacancyArr = '';
      console.info('vacancyArrContent=');

      // Добавляем пробел после запятой и удаляем запятую, если это последнее слово в строке
      this.vacancyArrContent.forEach((element) => {
        for (let i = 0; i < element.length && i < 52 && titleVacancyArr.length < 52; i += 1) {
          let el = element[i];

          if (el === ',' && this.vacancyArrContent.indexOf(element) !== this.vacancyArrContent.length - 1) {
            el = `${el} `;
          } else if (el === ',') {
            el = '';
          }

          titleVacancyArr += el;
        }
      });

      // Если в строку не помещается весь текст,
      // добавить многоточие (52 - макс кол-во символов с строке)
      if (titleVacancyArr.length >= 52) {
        titleVacancyArr = `${titleVacancyArr}...`;
      }

      this.listTitle.textContent = titleVacancyArr;
    }
  }
}
