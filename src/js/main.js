import festivalDatas from "./festival.js";
import { setCalendarDate } from "./calendar.js";
import { rendMap, highlightOverlay, deselectOverlay } from "./map.js";

let latitude;
let longitude;

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
const $newWindowBody = document.querySelector(".new-window-body");

//초기 렌딩 함수 실행
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

  // 날짜 조건에 맞게 필터 (yyyy-mm-dd 형식)
  const filterData = datas
    .filter(
      (data) => startDay <= data.fstvlEndDate && data.fstvlEndDate <= endDay
    )
    // 지역 조건에 맞게 필터 ('도/광역시 드롭다운메뉴 기준')
    .filter((data) => {
      // 전체는 모든 데이터 반환
      if (selectedDropdown.includes("전체")) {
        return data;
      }
      return data.address.includes(selectedDropdown);
    })
    .filter((data) => {
      const festivalName = unescapeHtml(data.fstvlNm)
        .toLowerCase()
        .replace(/\s+/g, ""); // 공백 제거
      return festivalName.includes(searchTerm);
    });

  rendMap(filterData);
  console.log("filter", filterData);

  //리스트 초기화
  $festivalGrid.innerHTML = "";

  filterData.forEach((data) => {
    const transText = unescapeHtml(data.fstvlNm);

    const $newFestivalCard = document.createElement("div");
    $newFestivalCard.classList.add("festival-card");
    $newFestivalCard.setAttribute("id", data.id);
    $newFestivalCard.innerHTML = `              <h3>${transText}</h3>
      <p>${data.fstvlStartDate} ~ ${data.fstvlEndDate}</p>
      <p>${data.address}</p>`;
    $festivalGrid.append($newFestivalCard);
  });
}

// 리스트 클릭 시 모달 데이터 렌더링 함수
function rendModalData(itemNode) {
  let name;
  let festival;
  let period;
  let deadline;
  let institutionalname;
  let numbers;
  let address;
  let url;
  let latitude;
  let longitude;

  festivalDatas.forEach((data) => {
    if (String(data.id) === itemNode) {
      name = unescapeHtml(data.fstvlNm);
      festival = unescapeHtml(data.fstvlCo);
      address = data.address;
      numbers = data.phoneNumber;
      period = data.fstvlStartDate;
      deadline = data.fstvlEndDate;
      institutionalname = data.mnnstNm;
      url = data.homepageUrl;
      latitude = data.latitude;
      longitude = data.longitude;
    }
    console.log(url);
  });

  //모달에 데이터 뿌리기
  // url 이 있는 경우에만 하이퍼링크 적용
  // $newWindowBody.innerHTML =
  // `<strong>${name}</strong>
  // <p></p>
  // <p>축제내용: ${festival}</p>
  // <p>주소: ${address}</p>
  // <p>축제기간: ${period} ~ ${deadline}</p>
  // <p>주최기관명: ${institutionalname}</p>
  // <p>전화번호: ${numbers}</p>
  //  <p>홈페이지주소: ${url.includes("http") ? `<a href="${url}">${url}</a>` : '지자체 홈페이지를 참고해주세요.'}</p>`;

  // 모달 리스트 초기화
  $newWindowBody.innerHTML = "";

  const $title = document.createElement("p");
  $title.textContent = unescapeHtml(name);
  $title.style.color = "#6a5acd";
  $title.classList.add("modal-title");
  $newWindowBody.appendChild($title);

  // 축제내용
  const $festivalDesc = document.createElement("p");
  $festivalDesc.classList.add("modal-desc");
  $festivalDesc.textContent = `축제내용 : ${unescapeHtml(festival)}`;
  $newWindowBody.appendChild($festivalDesc);

  // 주소
  const $address = document.createElement("p");
  $address.classList.add("modal-address");
  $address.textContent = `주소 : ${address}`;
  $newWindowBody.appendChild($address);

  // 축제기간
  const $period = document.createElement("p");
  $period.classList.add("modal-period");
  $period.textContent = `축제기간 : ${period} ~ ${deadline}`;
  $newWindowBody.appendChild($period);

  // 주최기관명
  const $instName = document.createElement("p");
  $instName.classList.add("modal-inst");
  $instName.textContent = `주최기관명 : ${institutionalname}`;
  $newWindowBody.appendChild($instName);

  // 전화번호
  const $numbers = document.createElement("p");
  $numbers.classList.add("modal-numbers");

  if (numbers !== null && typeof numbers === "object") {
    $numbers.textContent = `전화번호 : 지자체 홈페이지를 확인해주세요.`;
  } else {
    $numbers.textContent = `전화번호 : ${numbers}`;
  }
  $newWindowBody.appendChild($numbers);

  // 홈페이지주소
  const $url = document.createElement("p");
  $url.classList.add("modal-url");
  $url.textContent = `홈페이지 주소 : `;
  console.log(url);

  if (url.includes("http")) {
    const aTag = document.createElement("a");
    aTag.href = url;
    aTag.textContent = `${url}`;
    $url.appendChild(aTag);
  } else {
    $url.textContent = " 홈페이지 주소 : 지자체 홈페이지를 확인해주세요.";
  }
  $newWindowBody.appendChild($url);

  const $map = document.createElement("div");
  // $map.classList.add("modal-map");
  $map.setAttribute("id", "modal-map");
  if (latitude !== null && typeof latitude !== "object") {
    $map.classList.add("boder");
  }
  $newWindowBody.append($map);
  // 모달 열기
  openNewWindow();

  if (latitude !== null && typeof latitude !== "object") {
    modalMap(latitude, longitude);
  }
}

// 모달창 지도 이미지 (마커포함) 랜더링 함수
function modalMap(latitude, longitude) {
  const markerPosition = new kakao.maps.LatLng(latitude, longitude);

  // 이미지 지도에 표시할 마커입니다
  // 이미지 지도에 표시할 마커는 Object 형태입니다
  const marker = {
    position: markerPosition,
  };

  const staticMapContainer2 = document.getElementById("modal-map"), // 이미지 지도를 표시할 div
    staticMapOption2 = {
      center: new kakao.maps.LatLng(latitude, longitude), // 이미지 지도의 중심좌표
      level: 3, // 이미지 지도의 확대 레벨
      marker: marker,
    };

  // 이미지 지도를 표시할 div와 옵션으로 이미지 지도를 생성합니다
  const staticMap = new kakao.maps.StaticMap(
    staticMapContainer2,
    staticMapOption2
  );
}

// 모달 닫기
function closeNewWindow() {
  newWindow.classList.add("hidden");
  overlay.classList.add("hidden");
  deselectOverlay();
}
// 모달 열기
function openNewWindow() {
  newWindow.classList.remove("hidden");
  overlay.classList.remove("hidden");
  // 모달 창 열릴 때 가장 상단으로 스크롤 위치하게
  $newWindowBody.scrollTop = 0;
}

//=======================================================================================

// 키다운 이벤트 리스너
$searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    $searchBtn.click();
  }
});

// 클릭 아이콘 클릭 이벤트
$searchBtn.addEventListener("click", (e) => {
  rendData(festivalDatas);
});

// 모달 창 닫기
closeWindowButton.addEventListener("click", closeNewWindow);
overlay.addEventListener("click", closeNewWindow);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeNewWindow();
});

// 리스트 클릭 이벤트
$festivalGrid.addEventListener("click", (e) => {
  const target = e.target;
  const itemNode = target.closest(".festival-card");
  if (itemNode) {
    highlightOverlay(itemNode.id);
  }
  rendModalData(itemNode.id);
});

// 드롭다운 클릭 이벤트
$dropdown.addEventListener("click", (e) => {
  $dropdownToggle.textContent = e.target.innerText;
});

$dropdownMenu.addEventListener("click", (e) => {
  rendData(festivalDatas);
});

// 오버레이 클릭 이벤트 리스너 추가
const overlayLink = document.getElementById("map");
overlayLink.addEventListener("click", (e) => {
  e.preventDefault(); // 기본 링크 동작 방지
  if (e.target.tagName === "SPAN") {
    const targetId = e.target.id;
    const id = targetId.replace("map-", "");
    console.log(id);
    highlightOverlay(id);
    rendModalData(id);
  }
});
