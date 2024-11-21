const  picker = new Pikaday({
  field: document.getElementById("calendar"),
  i18n: {
      previousMonth : 'Previous Month',
      nextMonth     : 'Next Month',
      months        : ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
      weekdays      : ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'],
      weekdaysShort : ['일','월','화','수','목','금','토'],
  }
  ,    toString(date, format) {
 
    // yyyy-mm-dd 형식 (2024-01-01)
  const day = String(date.getDate()).padStart(2, '0');
  const month =  String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
},
parse(dateString, format) {
  // dateString is the result of `toString` method
  const parts = dateString.split('/');
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);
  return new Date(year, month, day);
}
}
);

{/* <input type="text" id="calendar">    
    
<script src="https://cdn.jsdelivr.net/npm/pikaday/pikaday.js"></script>
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/pikaday/css/pikaday.css">
<script src="./src/js/calendar.js"></script> */}