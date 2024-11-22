import festivalDatas from "./festival.js";

const container = document.getElementById("map"); // 지도를 담을 영역의 DOM 레퍼런스
let currentSelectedId = null; // 현재 선택된 id를 저장

const options = {
  center: new kakao.maps.LatLng(36, 127.6), // 지도의 중심좌표
  level: 13, // 지도의 레벨
};

const map = new kakao.maps.Map(container, options); // 지도 생성 및 객체 리턴
const geocoder = new kakao.maps.services.Geocoder(); // 주소-좌표 변환 객체 생성

// 마커와 커스텀 오버레이를 생성하는 함수
function createMarkerAndOverlay(position, festival) {
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

  const content = document.createElement("div");
  content.className = "customoverlay";
  content.setAttribute("data-id", festival.id); // data-id 속성 추가
  content.innerHTML = `
    <div class="overlay">
      <span class="title">${festival.fstvlNm}</span>
    </div>
  `;

  const customOverlay = new kakao.maps.CustomOverlay({
    map: map,
    position: position,
    content: content,
    yAnchor: 0,
  });

  // 오버레이 클릭 이벤트 리스너 추가
  const overlayLink = content.querySelector(".overlay");
  overlayLink.addEventListener("click", (e) => {
    e.preventDefault(); // 기본 링크 동작 방지
    HighlightOverlay(festival.id);
  });
}

// 선택된 오버레이 색 변경
function HighlightOverlay(selectedId) {
  
  // 현재 선택된 id와 다를 경우에만 클래스 제거 및 추가
  if (currentSelectedId !== selectedId) {
    // 기존 선택 요소 제거
    if (currentSelectedId !== null) {
      const previouslySelectedTitle = document.querySelector(`.customoverlay[data-id='${currentSelectedId}'] .title`);
      if (previouslySelectedTitle) {
        previouslySelectedTitle.classList.remove("selected-title"); // 이전 선택 클래스 제거
      }
    }

    // 선택된 제목에 클래스 추가
    const selectedTitle = document.querySelector(`.customoverlay[data-id='${selectedId}'] .title`);
    if (selectedTitle) {
      selectedTitle.classList.add("selected-title");
    }

    // 현재 선택된 id 업데이트
    currentSelectedId = selectedId;
  }
}

function rendMap(data) {
  console.log(`rendMap ${data.length}`);
  
  // 축제 데이터를 기반으로 마커와 오버레이 생성
  data.forEach((festival) => {
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
          createMarkerAndOverlay(coords, festival);
        }
      });
    } else {
      const markerPosition = new kakao.maps.LatLng(latitude, longitude);
      createMarkerAndOverlay(markerPosition, festival);
    }
  });
}

rendMap(festivalDatas);
export { rendMap, HighlightOverlay };