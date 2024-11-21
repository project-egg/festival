import festivalDatas from "./festival.js";

const container = document.getElementById("map"); //지도를 담을 영역의 DOM 레퍼런스
const options = {
  //지도를 생성할 때 필요한 기본 옵션
  center: new kakao.maps.LatLng(36, 127.6), //지도의 중심좌표 위도(latitude), 경도(longitude)순
  level: 13, //지도의 레벨(확대, 축소 정도)
};

const map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴

// TODO : 마커 사이즈에 따른 ImageOption offset 변동하도록 수정
festivalDatas.forEach((festival) => {
  var imageSrc = "../../assets/images/festival.png", // 마커이미지의 주소입니다
    imageSize = new kakao.maps.Size(25, 25), // 마커이미지의 크기입니다
    imageOption = { offset: new kakao.maps.Point(12.5, 12.5) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

  // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
  var markerImage = new kakao.maps.MarkerImage(
      imageSrc,
      imageSize,
      imageOption
    ),
    markerPosition = new kakao.maps.LatLng(
      festival.latitude,
      festival.longitude
    ); // 마커가 표시될 위치입니다

  // 마커를 생성합니다
  var marker = new kakao.maps.Marker({
    position: markerPosition,
    image: markerImage, // 마커이미지 설정
  });

  // 마커가 지도 위에 표시되도록 설정합니다
  marker.setMap(map);

  // 커스텀 오버레이에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
  var content = `<div class="customoverlay">
            <a href="https://map.kakao.com/link/map/11394059" target="_blank">
              <span class="title">${festival.fstvlNm}</span>
            </a>
          </div>`;

  // 커스텀 오버레이가 표시될 위치입니다
  var position = new kakao.maps.LatLng(festival.latitude, festival.longitude);

  // 커스텀 오버레이를 생성합니다
  var customOverlay = new kakao.maps.CustomOverlay({
    map: map,
    position: position,
    content: content,
    yAnchor: 0,
  });
});
