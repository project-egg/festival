import festivalDatas from "./festival.js";
import { setCalendarDate } from "./calendar.js";

const $infoSection = document.querySelector(".info-section");

// 드랍다운 DOM
const $dropdown = document.querySelector(".dropdown-menu");
const $dropdownToggle = document.querySelector(".dropdown-toggle");
const $dropdownMenu = document.querySelector(".dropdown-menu");

const $searchBtn = document.getElementById("searchBtn");
const $startDay = document.getElementById("start-calendar");

const $endDay = document.getElementById("end-calendar");

// 리스트 DOM
const $festivalGrid = document.querySelector(".festival-grid");
const $festivalCard = document.querySelector(".festival-card");

setCalendarDate();
rendData(festivalDatas);

// 특수문자 변환
function unescapeHtml(str) {
  const doc = new DOMParser().parseFromString(str, "text/html");
  return doc.body.textContent || "";
}

// 데이터 필터하고 리스트업하는 함수
function rendData(datas) {
  const startDay = $startDay.value;
  const endDay = $endDay.value;

  const selectedDropdown = $dropdownToggle.innerText;

  console.log(datas);

  // 날짜 조건에 맞게 필터
  const filterData = datas
    .filter(
      (data) => startDay <= data.fstvlEndDate && data.fstvlEndDate <= endDay
    )
    // 지역 조건에 맞게 필터
    .filter((data) => {
      let address = null; 
      
      // 도로명주소 우선 
      if (data.rdnmadr !== null && typeof data.rdnmadr === "object") {
        address = data.lnmadr;
      } else {
        address = data.rdnmadr;
      }

      // 전체는 모든 데이터 반환
      if (selectedDropdown.includes("전체")) {
        return data;
      }
      return address.includes(selectedDropdown);
    });

  console.log("filter", filterData);

  //리스트 초기화
  $festivalGrid.innerHTML = "";

  filterData.forEach((data) => {
    const transText = unescapeHtml(data.fstvlNm);
    let address = null;

    // 주소 도로명 주소 우선 표시
    if (data.rdnmadr !== null && typeof data.rdnmadr === "object") {
      address = data.lnmadr;
    } else {
      address = data.rdnmadr;
    }
    if (!address) {
      address = "주소없음";
    }

    const $newFestivalCard = document.createElement("div");
    $newFestivalCard.classList.add("festival-card");
    $newFestivalCard.setAttribute("id", data.id);
    $newFestivalCard.innerHTML = `              <h3>${transText}</h3>
      <p>${data.fstvlStartDate} ~ ${data.fstvlEndDate}</p>
      <p>${address}</p>`;
    $festivalGrid.append($newFestivalCard);
  });
}

$searchBtn.addEventListener("click", (e) => {
  rendData(festivalDatas);
});

$dropdown.addEventListener("click", (e) => {
  $dropdownToggle.textContent = e.target.innerText;
});
$dropdownMenu.addEventListener("click", (e) => {
  console.log('click');
  
  rendData(festivalDatas);
});
