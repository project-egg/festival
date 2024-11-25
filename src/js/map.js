const container = document.getElementById("map"); // 지도를 담을 영역의 DOM 레퍼런스
let currentSelectedId = null; // 현재 선택된 id를 저장
let markers = [];
let overlays = [];

const options = {
  center: new kakao.maps.LatLng(36.2, 127.6), // 지도의 중심좌표
  level: 13, // 지도의 레벨
};

const map = new kakao.maps.Map(container, options); // 지도 생성 및 객체 리턴
const geocoder = new kakao.maps.services.Geocoder(); // 주소-좌표 변환 객체 생성

function unescapeHtml(str) {
  const doc = new DOMParser().parseFromString(str, "text/html");
  return doc.body.textContent || "";
}

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
  markers.push(marker); // 마커를 배열에 추가

  const content = document.createElement("div");
  content.className = "customoverlay";
  content.setAttribute("data-id", festival.id); // data-id 속성 추가

  const festivalTitle = unescapeHtml(festival.fstvlNm);
  content.innerHTML = `
    <div class="c-overlay">
      <span class="title">${festivalTitle}</span>
    </div>
  `;

  const customOverlay = new kakao.maps.CustomOverlay({
    map: map,
    position: position,
    content: content,
    yAnchor: 0,
  });

  overlays.push(customOverlay); // 오버레이를 배열에 추가

  // 오버레이 클릭 이벤트 리스너 추가
  const overlayLink = content.querySelector(".c-overlay");
  overlayLink.addEventListener("click", (e) => {
    e.preventDefault(); // 기본 링크 동작 방지
    highlightOverlay(festival.id);
  });
}

// 같은 위치에 있는 오버레이 재배치
function reposSamePosOverlays() {
  const positionMap = {};

  // 각 오버레이의 위치를 추적하기 위한 맵 생성
  overlays.forEach((overlay) => {
    const position = overlay.getPosition();
    const key = `${position.getLat()},${position.getLng()}`; // 위도와 경도를 키로 사용

    if (!positionMap[key]) {
      positionMap[key] = [];
    }
    positionMap[key].push(overlay);
  });

  // 각 위치에 대해 오버레이 재배치
  Object.values(positionMap).forEach((overlaysAtPos) => {
    if (overlaysAtPos.length > 1) {
      // 동일한 위치에 있는 경우
      overlaysAtPos.forEach((overlay, index) => {
        const originalPosition = overlay.getPosition();
        const verticalOffset = index * 0.0001; // 오프셋 조정 (필요에 따라 변경 가능)
        const adjustedPosition = new kakao.maps.LatLng(originalPosition.getLat() + verticalOffset, originalPosition.getLng());

        overlay.setPosition(adjustedPosition); // 새로운 위치로 재배치
      });
    }
  });
}

// 기존 선택 오버레이 제거
function deselectOverlay() {
  if (currentSelectedId !== null) {
    const previouslySelectedTitle = document.querySelector(
      `.customoverlay[data-id='${currentSelectedId}'] .title`
    );
    if (previouslySelectedTitle) {
      previouslySelectedTitle.classList.remove("selected-title"); // 이전 선택 클래스 제거
    }
  }
}

// 선택된 오버레이 색 변경
function highlightOverlay(selectedId) {
  // 기존 선택 id와 다를 경우에만 클래스 제거 및 추가
  if (currentSelectedId === selectedId) return;

  deselectOverlay();

  // 선택된 제목에 클래스 추가
  const selectedTitle = document.querySelector(
    `.customoverlay[data-id='${selectedId}'] .title`
  );
  if (selectedTitle) {
    selectedTitle.classList.add("selected-title");
  }

  // 현재 선택된 id 업데이트
  currentSelectedId = selectedId;  
}

function rendMap(data) {
  console.log(`rend : ${data.length}`);

  // 기존 마커와 오버레이 제거
  markers.forEach((marker) => {
    marker.setMap(null); // 지도에서 마커 제거
  });
  markers = []; // 마커 배열 초기화

  overlays.forEach((overlay) => {
    overlay.setMap(null); // 지도에서 오버레이 제거
  });
  overlays = []; // 오버레이 배열 초기화

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
    // 모든 오버레이가 생성된 후에 재배치 함수 호출
  });
  
  reposSamePosOverlays();
}

export { rendMap, highlightOverlay };
