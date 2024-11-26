const $startDay = document.getElementById("start-calendar");
const $endDay = document.getElementById("end-calendar");

const date = new Date();
const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
  2,
  "0"
)}-${String(date.getDate()).padStart(2, "0")}`;
let selectedDate = null;

const inputElementStart = document.getElementById("start-calendar");
const inputElementEnd = document.getElementById("start-calendar");


// pikaday 라이브러리 사용
// 축제 시작날짜 캘린더
const pickerStart = new Pikaday({
  field: document.getElementById("start-calendar"),

  // 캘린더에 날짜를 선택했을 때 
  onSelect: function (date) {
    const option = "start";
    selectedDate = formatDate(date);
    setCalendarDate(selectedDate, option);
    document.getElementById("searchBtn").click();
  },
  firstDay: 1,
  minDate: new Date(), // 2024년 11월 1일부터
  maxDate: new Date(2025, 12, 31), // 2024년 12월 31일까지
  yearRange: [2024, 2025], // 년도 드롭다운
  format: "D MMM YYYY",

  //한국어 설정
  i18n: {
    previousMonth: "Previous Month",
    nextMonth: "Next Month",
    months: [
      "1월",
      "2월",
      "3월",
      "4월",
      "5월",
      "6월",
      "7월",
      "8월",
      "9월",
      "10월",
      "11월",
      "12월",
    ],
    weekdays: [
      "일요일",
      "월요일",
      "화요일",
      "수요일",
      "목요일",
      "금요일",
      "토요일",
    ],
    weekdaysShort: ["일", "월", "화", "수", "목", "금", "토"],
  },

  toString(date, format) {
    // yyyy-mm-dd 형식 (2024-01-01)
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  },
  parse(dateString, format) {
    // dateString is the result of `toString` method
    const parts = dateString.split("-");
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  },
});

// 축제 종료일 선택 캘린더
const pickerEnd = new Pikaday({
  field: document.getElementById("end-calendar"),

    // 캘린더에 날짜를 선택했을 때 
  onSelect: function (date) {
    const option = "end";
    selectedDate = formatDate(date);
    setCalendarDate(selectedDate, option);
    document.getElementById("searchBtn").click();
  },
  firstDay: 1,
  minDate: new Date(), // 2024년 11월 1일부터
  maxDate: new Date(2025, 12, 31), // 2024년 12월 31일까지
  yearRange: [2024, 2025], // 년도 드롭다운 
  format: "D MMM YYYY",

  // 한국어 설정
  i18n: {
    previousMonth: "Previous Month",
    nextMonth: "Next Month",
    months: [
      "1월",
      "2월",
      "3월",
      "4월",
      "5월",
      "6월",
      "7월",
      "8월",
      "9월",
      "10월",
      "11월",
      "12월",
    ],
    weekdays: [
      "일요일",
      "월요일",
      "화요일",
      "수요일",
      "목요일",
      "금요일",
      "토요일",
    ],
    weekdaysShort: ["일", "월", "화", "수", "목", "금", "토"],
  },

  toString(date, format) {
    // yyyy-mm-dd 형식 (2024-01-01)
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  },
  parse(dateString, format) {
    // dateString is the result of `toString` method
    const parts = dateString.split("-");
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  },
});

// 날짜 선택 시 input박스에 그려지는 텍스트 설정
function setCalendarDate(inputDate, option) {
  const date = new Date();

  const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;

  // 초기 날짜 세팅
  if (!$startDay.value) {
    console.log("false");
    $startDay.value = today;
    $endDay.value = addSevenDays(today);
    return;
  }

  // 검색가능한 날짜는 당일~ 2025년
  if (option === "end" && today > subSevenDays(inputDate)) {
    $startDay.value = today;
  }

  // 시작일~종료일 에 모순이 생길 경우엔 7일기간으로 날짜 변경되도록

  // 1. 종료일이 시작일보다 이전일 경우
  // 20일~인데 ~1일을 하려고함
  if ($startDay.value > inputDate) {
    if (inputDate < subSevenDays(today)) {
      $startDay.value = today;
    }

    $startDay.value = subSevenDays(inputDate);

    // 2. 시작일이 종료일보다 이후일 경우
    // ~20일 인데 21일~을 하려고함
  } else if (inputDate > $endDay.value) {
    $endDay.value = addSevenDays(inputDate);
  }
}

function formatDate(date) {
  // 로컬 시간대에 맞게 날짜를 yyyy-mm-dd 형식으로 변환
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
}


// 날짜에 7일을 더해서 yyyy-mm-dd 형식으로 반환해주는 함수
function addSevenDays(beforeDate) {
  const beforeDateObj = new Date(beforeDate);
  const todayObj = new Date();
  todayObj.setDate(beforeDateObj.getDate() + 7);
  const afterDate = `${todayObj.getFullYear()}-${String(
    todayObj.getMonth() + 1
  ).padStart(2, "0")}-${String(todayObj.getDate()).padStart(2, "0")}`;
  return afterDate;
}

// 날짜에 7일을 빼서 yyyy-mm-dd 형식으로 반환해주는 함수
function subSevenDays(beforeDate) {
  const beforeDateObj = new Date(beforeDate);
  const todayObj = new Date();
  todayObj.setDate(beforeDateObj.getDate() - 7);
  const afterDate = `${todayObj.getFullYear()}-${String(
    todayObj.getMonth() + 1
  ).padStart(2, "0")}-${String(todayObj.getDate()).padStart(2, "0")}`;
  return afterDate;
}

export { setCalendarDate };
