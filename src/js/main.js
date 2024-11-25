import festivalDatas from "./festival.js";
import { setCalendarDate } from "./calendar.js";
import { rendMap, highlightOverlay } from "./map.js";

const $infoSection = document.querySelector(".info-section");

// 드랍다운 DOM
const $dropdown = document.querySelector(".dropdown-menu");
const $dropdownToggle = document.querySelector(".dropdown-toggle");
const $dropdownMenu = document.querySelector(".dropdown-menu");

const $searchInput = document.querySelector(".search-bar>input");
const $searchBtn = document.getElementById("searchBtn");
const $startDay = document.getElementById("start-calendar");

const $endDay = document.getElementById("end-calendar");

// 리스트 DOM
const $festivalGrid = document.querySelector(".festival-grid");
const $festivalCard = document.querySelector(".festival-card");


// 요소 선택
const closeWindowButton = document.getElementById("close-window");
const newWindow = document.getElementById("new-window");
const overlay = document.querySelector("#overlay");

// 모달 DOM
const $newWindowBody = document.querySelector('.new-window-body');

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
  const searchTerm = $searchInput.value.toLowerCase(); // 검색어를 소문자로 변환

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
    })
    .filter((data) => {
      const festivalName = unescapeHtml(data.fstvlNm).toLowerCase().replace(/\s+/g, ''); // 공백 제거
      return festivalName.includes(searchTerm);
    });    

    rendMap(filterData);
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

$searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    $searchBtn.click();
  }
});

$searchBtn.addEventListener("click", (e) => {
  rendData(festivalDatas);
});

// 새로운 창 닫기
closeWindowButton.addEventListener("click", closeNewWindow);
overlay.addEventListener("click", closeNewWindow);

// 닫기 함수
function closeNewWindow() {
  newWindow.classList.add("hidden");
  overlay.classList.add("hidden");
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeNewWindow();
});


$festivalGrid.addEventListener('click',e=>{
const target = e.target;
const itemNode = target.closest('.festival-card');
if (itemNode) {    
  highlightOverlay(itemNode.id);
}

console.log(`==================`);

newWindow.classList.remove("hidden");
overlay.classList.remove("hidden");

let name;
let festival;
let period;
let deadline;
let institutionalname;
let numbers;
let address;
festivalDatas.forEach((data)=>{
  if (String(data.id) === itemNode.id) {
    name = data.fstvlNm;
    festival = data.fstvlCo;
    numbers = data.phoneNumber;
    period = data.fstvlStartDate;
    deadline = data.fstvlEndDate;
    institutionalname = data.mnnstNm;
    address = data.homepageUrl;
    console.log(numbers);
  }else{
  
  }

});

//모달에 데이터 뿌리기
$newWindowBody.innerHTML = 
`<p>축제이름:${name}</p>
<p>축제내용:${festival}</p>
<p>소재지도로명주소:</p>
<p>축제기간:${period} ~ ${deadline}</p>
<p>주최기관명:${institutionalname}</p> 
<p>전화번호:${numbers}</p>
<p>홈페이지주소:${address}</p>`;
});

$dropdown.addEventListener("click", (e) => {
  $dropdownToggle.textContent = e.target.innerText;
});

$dropdownMenu.addEventListener("click", (e) => {
  console.log("click");

  rendData(festivalDatas);
});