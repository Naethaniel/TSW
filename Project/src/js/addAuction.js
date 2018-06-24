$(() => {
  let dtToday = new Date();

  let month = dtToday.getMonth() + 1;
  let day = dtToday.getDate() + 1;
  let year = dtToday.getFullYear();
  let hour = dtToday.getHours();
  let minutes = dtToday.getMinutes();
  let seconds = dtToday.getSeconds();

  if(month < 10)
    month = '0' + month.toString();
  if(day < 10)
    day = '0' + day.toString();

  let minDate = year + '-' + month + '-' + day + 'T' + hour + ':' + minutes + ':' + seconds;

  $('#datePicker').attr('min', minDate);
});