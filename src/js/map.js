const container = document.getElementById("map"); // 지도를 담을 영역의 DOM 레퍼런스
let currentSelectedId = null; // 현재 선택된 id를 저장
let markers = [];
let overlays = [];
let clusterer; // 클러스터러 추가

const options = {
  center: new kakao.maps.LatLng(36.2, 127.6), // 지도의 중심좌표
  level: 13, // 지도의 레벨
};

const map = new kakao.maps.Map(container, options); // 지도 생성 및 객체 리턴
const geocoder = new kakao.maps.services.Geocoder(); // 주소-좌표 변환 객체 생성

// 클러스터러 초기화
clusterer = new kakao.maps.MarkerClusterer({
  map: map,
  averageCenter: true,
  minLevel: 1, // 클러스터링을 시작할 최소 레벨 설정
});

function unescapeHtml(str) {
  const doc = new DOMParser().parseFromString(str, "text/html");
  return doc.body.textContent || "";
}

// 마커를 생성하는 함수
function createMarker(position) {
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
}

// 커스텀 오버레이를 생성하는 함수
function createCustomOverlay(position, festival) {
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
    position: position,
    content: content,
    yAnchor: 0,
  });

  // 오버레이 클릭 이벤트 리스너 추가
  const overlayLink = content.querySelector(".c-overlay");
  overlayLink.addEventListener("click", (e) => {
    e.preventDefault(); // 기본 링크 동작 방지
    highlightOverlay(festival.id);
  });

  return customOverlay; // 커스텀 오버레이 반환
}

// 마커와 커스텀 오버레이를 생성하는 함수
function createMarkerAndOverlay(position, festival) {
  createMarker(position);
  const customOverlay = createCustomOverlay(position, festival);

  // 클러스터러에 커스텀 오버레이 추가
  clusterer.addMarker(customOverlay); // 커스텀 오버레이 추가

  overlays.push(customOverlay); // 오버레이를 배열에 추가
}

// 같은 위치에 있는 오버레이 재배치
function reposSamePosOverlays() {
  const positionMap = {};

  overlays.forEach((overlay) => {
    const position = overlay.getPosition();
    const key = `${position.getLat()},${position.getLng()}`; // 위도와 경도를 키로 사용

    if (!positionMap[key]) {
      positionMap[key] = [];
    }
    positionMap[key].push(overlay);
  });

  Object.values(positionMap).forEach((overlaysAtPos) => {
    if (overlaysAtPos.length > 1) {
      overlaysAtPos.forEach((overlay, index) => {
        const originalPosition = overlay.getPosition();
        const verticalOffset = index * 0.0001; // 오프셋 조정
        const adjustedPosition = new kakao.maps.LatLng(
          originalPosition.getLat() + verticalOffset,
          originalPosition.getLng()
        );

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
  if (currentSelectedId === selectedId) return;

  deselectOverlay();

  const selectedTitle = document.querySelector(
    `.customoverlay[data-id='${selectedId}'] .title`
  );
  if (selectedTitle) {
    selectedTitle.classList.add("selected-title");
  }

  currentSelectedId = selectedId;
}

function rendMap(data) {
  // 기존 마커와 오버레이 제거
  markers.forEach((marker) => {
    marker.setMap(null); // 지도에서 마커 제거
  });
  markers = []; // 마커 배열 초기화  

  // 기존 오버레이 제거
  overlays.forEach((overlay) => {
    overlay.setMap(null); // 지도에서 오버레이 제거
  });
  overlays = []; // 오버레이 배열 초기화

  // 클러스터러 초기화
  clusterer = new kakao.maps.MarkerClusterer({
    map: map,
    averageCenter: true,
    minLevel: 10, // 클러스터링을 시작할 최소 레벨 설정
  });

  // 축제 데이터를 기반으로 커스텀 오버레이 생성
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

  reposSamePosOverlays();
}

export { rendMap, highlightOverlay };
