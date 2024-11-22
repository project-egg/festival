import festivalDatas from "./festival.js";
import { setCalendarDate } from "./calendar.js";

const $searchBtn = document.getElementById("searchBtn");
const $startDay = document.getElementById("start-calendar");
const $endDay = document.getElementById("end-calendar");
const $infoSection = document.querySelector(".info-section");
const $festivalGrid = document.querySelector(".festival-grid");
const $festivalCard = document.querySelector(".festival-card");

setCalendarDate();

// 특수문자 변환
function unescapeHtml(str) {
  const doc = new DOMParser().parseFromString(str, "text/html");
  return doc.body.textContent || "";
}

// 데이터 필터하고 리스트업하는 함수
function rendData(datas) {
  const startDay = $startDay.value;
  const endDay = $endDay.value;

  console.log(datas);

  // 날짜 조건에 맞게 필터
  const filterData = datas.filter(
    (data) => startDay <= data.fstvlEndDate && data.fstvlEndDate <= endDay
  );

  console.log("filter", filterData);

  //리스트 초기화
  $festivalGrid.innerHTML = "";

  filterData.forEach((data) => {
    const transText = unescapeHtml(data.fstvlNm);
    let address = null;
    if (
      data.rdnmadr ||
      (typeof data.rdnmadr === "object" && data.rdnmadr !== null)
    ) {
      address = data.rdnmadr;
    } else if (data.lnmadr) {
      address = data.lnmadr;
    } else {
      address = "주소없음";
    }

    const $newFestivalCard = document.createElement("div");
    $newFestivalCard.classList.add("festival-card");
    $newFestivalCard.setAttribute("id", data.insttCode);
    $newFestivalCard.innerHTML = `              <h3>${transText}</h3>
      <p>${data.fstvlStartDate} ~ ${data.fstvlEndDate}</p>
      <p>${address}</p>`;
    $festivalGrid.append($newFestivalCard);
  });
}

$searchBtn.addEventListener("click", (e) => {
  rendData(festivalDatas);
});
