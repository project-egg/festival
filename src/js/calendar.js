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

console.log(today);

// 축제 시작날짜 캘린더
const pickerStart = new Pikaday({
  field: document.getElementById("start-calendar"),
  onSelect: function (date) {
    const option = "start";
    selectedDate = formatDate(date);
    setCalendarDate(selectedDate, option);
    document.getElementById("searchBtn").click();
  },
  firstDay: 1,
  minDate: new Date(), // 2024년 11월 1일부터
  maxDate: new Date(2025, 12, 31), // 2024년 12월 31일까지
  yearRange: [2024, 2025],
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
  onSelect: function (date) {
    const option = "end";
    selectedDate = formatDate(date);
    setCalendarDate(selectedDate, option);
    document.getElementById("searchBtn").click();
  },
  firstDay: 1,
  minDate: new Date(), // 2024년 11월 1일부터
  maxDate: new Date(2025, 12, 31), // 2024년 12월 31일까지
  yearRange: [2024, 2025],
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

  console.log(subSevenDays(inputDate), "input");
  console.log(addSevenDays(today), "777");

  // 검색가능한 날짜는 당일~
  if (option === "end" && today > subSevenDays(inputDate)) {
    $startDay.value = today;
  }

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


function addSevenDays(beforeDate) {
  const date2 = new Date(beforeDate);
  const date = new Date();
  date.setDate(date2.getDate() + 7);
  const afterDate = `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  return afterDate;
}

function subSevenDays(beforeDate) {
  const date2 = new Date(beforeDate);
  const date = new Date();
  date.setDate(date2.getDate() - 7);
  const afterDate = `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  return afterDate;
}
export { setCalendarDate };
