import festivalDatas from "./festival.js";

const container = document.getElementById("map"); // 지도를 담을 영역의 DOM 레퍼런스
const $festival_info = document.querySelector(".festival-info"); // 축제 정보 영역의 DOM 레퍼런스

const options = {
  center: new kakao.maps.LatLng(36, 127.6), // 지도의 중심좌표
  level: 13, // 지도의 레벨
};

const map = new kakao.maps.Map(container, options); // 지도 생성 및 객체 리턴
const geocoder = new kakao.maps.services.Geocoder(); // 주소-좌표 변환 객체 생성

// 마커와 커스텀 오버레이를 생성하는 함수
function createMarkerAndOverlay(position, title, index) {
  const markerImage = new kakao.maps.MarkerImage(
    "../../assets/images/festival.png",
    new kakao.maps.Size(25, 25),
    { offset: new kakao.maps.Point(12.5, 12.5) }
  );

  const marker = new kakao.maps.Marker({
    position: position,
    image: markerImage,
  });

  marker.setMap(map); // 마커를 지도 위에 표시

  const content = `<div class="customoverlay">
          <a href="https://map.kakao.com/link/map/11394059" target="_blank">
            <span class="title">${title}</span>
          </a>
        </div>`;

  const customOverlay = new kakao.maps.CustomOverlay({
    map: map,
    position: position,
    content: content,
    yAnchor: 0,
  });

  // 축제 정보 동적 생성
  const $festival_summary = document.createElement("p");
  $festival_summary.classList.add("festival-summary");
  $festival_summary.innerHTML = title;
  $festival_summary.dataset.index = index; // 생성된 순서에 따른 인덱스 부여
  $festival_summary.addEventListener("click", (e) => selectMarker(e));
  $festival_info.append($festival_summary);
}

// 축제 데이터를 기반으로 마커와 오버레이 생성
let currentIndex = 0; // 현재 인덱스를 추적하는 변수

festivalDatas.forEach((festival) => {
  const latitude = parseFloat(festival.latitude);
  const longitude = parseFloat(festival.longitude);

  // 위도와 경도 유효성 검사
  if (
    isNaN(latitude) ||
    isNaN(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    // 주소로 좌표를 검색
    geocoder.addressSearch(festival.rdnmadr, function (result, status) {
      if (status === kakao.maps.services.Status.OK) {
        const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
        createMarkerAndOverlay(coords, festival.fstvlNm, currentIndex++); // 마커와 오버레이 생성
      }
    });
  } else {
    const markerPosition = new kakao.maps.LatLng(latitude, longitude);
    createMarkerAndOverlay(markerPosition, festival.fstvlNm, currentIndex++); // 마커와 오버레이 생성
  }
});

function selectMarker(e) {  
  const allTitles = document.querySelectorAll(".customoverlay .title");
  
  allTitles.forEach((title) => {
    title.classList.remove("selected-title");
  });

  // 선택된 마커의 제목에 선택 클래스 추가
  const index = e.target.dataset.index; // dataset.index 사용
  
  const selectedTitle = allTitles[index]; // 인덱스를 사용하여 선택된 요소 찾기
  if (selectedTitle) {
    selectedTitle.classList.add("selected-title");
  }
}