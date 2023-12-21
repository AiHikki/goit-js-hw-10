import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

iziToast.settings({
  timeout: 3000,

  transitionIn: 'flipInX',
  transitionOut: 'flipOutX',
  position: 'topRight',
  message: 'Please choose a date in the future',
  messageColor: 'white',
  backgroundColor: 'red',
  progressBar: false,
});

const startBtn = document.querySelector('button[data-start]'),
  datePicker = document.querySelector('#datetime-picker');

const daysHTML = document.querySelector('span[data-days]'),
  hoursHTML = document.querySelector('span[data-hours]'),
  minutesHTML = document.querySelector('span[data-minutes]'),
  secondsHTML = document.querySelector('span[data-seconds]');

let userSelectedDate, invervalId;

startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    handleTimer(selectedDates);
  },
};

flatpickr(datePicker, options);

function handleTimer(selectedDates) {
  userSelectedDate = selectedDates[0].getTime();

  if (userSelectedDate <= Date.now()) {
    startBtn.disabled = true;
    iziToast.show();
  } else {
    startBtn.disabled = false;

    startBtn.addEventListener('click', () => {
      datePicker.disabled = true;
      startBtn.disabled = true;

      invervalId = setInterval(() => {
        const countDown = userSelectedDate - Date.now();
        if (countDown <= 0) {
          clearInterval(invervalId);
          datePicker.disabled = false;
          return;
        }
        let { days, hours, minutes, seconds } = convertMs(countDown);
        daysHTML.textContent = addZero(days);
        hoursHTML.textContent = addZero(hours);
        minutesHTML.textContent = addZero(minutes);
        secondsHTML.textContent = addZero(seconds);
      }, 1000);
    });
  }
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  let days = Math.floor(ms / day);
  let hours = Math.floor((ms % day) / hour);
  let minutes = Math.floor(((ms % day) % hour) / minute);
  let seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addZero(unit) {
  return unit.toString().padStart(2, '0');
}
