const container = document.getElementById("map"); // 지도를 담을 영역의 DOM 레퍼런스
let mapCenter = {
  latitude : 36.2,
  longitude : 127.6,
}
let currentSelectedId = null; // 현재 선택된 id를 저장
let markers = [];
let overlays = [];
let clusterer; // 클러스터러 추가

const options = {
  center: new kakao.maps.LatLng(mapCenter.latitude, mapCenter.longitude), // 지도의 중심좌표
  level: 13, // 지도의 레벨
};

const map = new kakao.maps.Map(container, options); // 지도 생성 및 객체 리턴
const geocoder = new kakao.maps.services.Geocoder(); // 주소-좌표 변환 객체 생성

function unescapeHtml(str) {
  const doc = new DOMParser().parseFromString(str, "text/html");
  return doc.body.textContent || "";
}

// 마커를 생성하는 함수
function createMarker(position, festival) {
  const markerImage = new kakao.maps.MarkerImage(
    "../../assets/images/festival.png",
    new kakao.maps.Size(25, 25),
    { offset: new kakao.maps.Point(12.5, 12.5) }
  );

  const marker = new kakao.maps.Marker({
    position: position,
    image: markerImage,
  });

  marker.dataId = festival.id;

  return marker;
}

// 커스텀 오버레이를 생성하는 함수
function createCustomOverlay(position, festival) {
  const content = document.createElement("div");
  content.className = "customoverlay";
  content.setAttribute("data-id", festival.id); // data-id 속성 추가

  const festivalTitle = unescapeHtml(festival.fstvlNm);
  content.innerHTML = `
    <div class="c-overlay">
      <span class="title" id="map-${festival.id}">${festivalTitle}</span>
    </div>
  `;

  console.log(`overlay 생성`);
  
  const customOverlay = new kakao.maps.CustomOverlay({
    position: position,
    content: content,
    yAnchor: 0,
  });

  customOverlay.dataId = festival.id;

  return customOverlay; // 커스텀 오버레이 반환
}

// 마커와 커스텀 오버레이를 생성하는 함수
function createMarkerAndOverlay(position, festival) {
  const marker = createMarker(position, festival);
  const customOverlay = createCustomOverlay(position, festival);

  clusterer.addMarker(marker);   // 클러스터러에 마커 추가

  markers.push(marker); // 마커를 배열에 추가
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

function updateOverlaysVisibility(clusters) {  
  console.log("=====================updateOverlaysVisibility");
    
  markers.forEach((marker) => {
    const isInCluster = clusters.some((cluster) =>
      cluster.getMarkers().includes(marker)
    ); // 클러스터에 포함된 마커인지 확인

    const overlay = overlays.find((o) => o.dataId === marker.dataId); // dataId로 오버레이 찾기
    if (!isInCluster) {
      // 클러스터에 포함되지 않은 마커에 오버레이 표시
      if (overlay) {
        overlay.setMap(map);
        //console.log("오버레이 표시");
        
      }
    } else {
      // 클러스터에 포함된 마커의 오버레이 숨김
      if (overlay) {
        overlay.setMap(null);
        //console.log("오버레이 제거");
      }
    }
  });
}

function rendMap(data) {
  console.log("rendMap");  
  
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
  
  if (clusterer) {    
    clusterer.clear(); // 클러스터러의 모든 마커를 제거
  }
  clusterer = new kakao.maps.MarkerClusterer({
    map: map,
    averageCenter: true,
    minLevel: 1, // 클러스터링을 시작할 최소 레벨 설정
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
      if (festival.address) {
        // 도로명 주소로 좌표를 검색
        geocoder.addressSearch(festival.address, function (result, status) {
          if (status === kakao.maps.services.Status.OK) {
            const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
            createMarkerAndOverlay(coords, festival);
          } else { // 주소 검색 실패 (ex. 장소 미지정)
            console.log(`${festival.fstvlNm} 주소 검색 실패: ${status}`);
          }
        });
      }
    } else { // 위도 경도 잘 있는 경우
      const markerPosition = new kakao.maps.LatLng(latitude, longitude);
      createMarkerAndOverlay(markerPosition, festival);
    }
  });

  // 클러스터링 이벤트에서 오버레이 표시 관리
  kakao.maps.event.addListener(clusterer, "clustered", function (clusters) {
    updateOverlaysVisibility(clusters)
  });

  // 맵 로드 시에 updateOverlaysVisibility 호출을 위해 중심좌표 이동
  mapCenter.latitude += 0.01;
  console.log(`mapCenter.latitude: ${mapCenter.latitude}`);
  
  map.setCenter(new kakao.maps.LatLng(mapCenter.latitude, mapCenter.longitude));

  reposSamePosOverlays();
}

export { rendMap, highlightOverlay };
