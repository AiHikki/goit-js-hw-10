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
  resetBtn = document.querySelector('button[data-reset]'),
  datePicker = document.querySelector('#datetime-picker');

const daysHTML = document.querySelector('span[data-days]'),
  hoursHTML = document.querySelector('span[data-hours]'),
  minutesHTML = document.querySelector('span[data-minutes]'),
  secondsHTML = document.querySelector('span[data-seconds]');

const TIMER_STORAGE_KEY = 'userSelectedDate';

let userSelectedDate, invervalId;
let isRunning = false;

startBtn.disabled = true;
resetBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    localStorage.setItem(TIMER_STORAGE_KEY, selectedDates[0]);
    handleTimer(selectedDates);
  },
};

flatpickr(datePicker, options);

const savedDate = new Date(localStorage.getItem(TIMER_STORAGE_KEY)).getTime();

if (
  savedDate &&
  savedDate > Date.now() &&
  JSON.parse(localStorage.getItem('isRunning'))
) {
  userSelectedDate = savedDate;
  startTimer();
}

function handleTimer(selectedDates) {
  userSelectedDate = selectedDates[0].getTime();

  if (userSelectedDate <= Date.now()) {
    startBtn.disabled = true;
    iziToast.show();
  } else {
    startBtn.disabled = false;
    startBtn.addEventListener('click', startTimer);
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

function startTimer() {
  isRunning = true;
  localStorage.setItem('isRunning', isRunning);

  datePicker.disabled = true;
  startBtn.disabled = true;
  resetBtn.disabled = false;

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

  resetBtn.addEventListener('click', resetTimer);
}

function resetTimer() {
  clearInterval(invervalId);
  localStorage.removeItem(TIMER_STORAGE_KEY);
  localStorage.removeItem('isRunning');

  daysHTML.textContent = '00';
  hoursHTML.textContent = '00';
  minutesHTML.textContent = '00';
  secondsHTML.textContent = '00';

  resetBtn.disabled = true;
  datePicker.disabled = false;
}
