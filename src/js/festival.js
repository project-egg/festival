import { xmlToJson } from "./xmlToJson.js";

const pageNo = 1;

const apiKey =
  "3ih8%2BQR83rsvCEY8npFeJxn4kCUYoPwt%2BCGlm5t4iMup1WvwgEErvFno2bFeGwyZ20DymdWNc7mQlGVM8Pb9tg%3D%3D";
const apiUrl = `http://api.data.go.kr/openapi/tn_pubr_public_cltur_fstvl_api?serviceKey=${apiKey}&pageNo=${pageNo}&numOfRows=1266`; // API 호출 URL


const festivalDatas = await fetchFestivalData(apiUrl);


// api 데이터 호출 
async function fetchFestivalData(apiUrl) {

    const response = await fetch(apiUrl); // API 호출
    const data = await response.text();  // 응답을 텍스트로 변환

    const XmlNode = new DOMParser().parseFromString(data, "text/xml");

    // xml형식을 json으로 파싱
    const date = new Date();
    const today = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
  
    console.log('aasda',date);
    console.log('aasda',today);
    
    // xmlToJson.js 에서 emport
    const jsonData = xmlToJson(XmlNode);
    const festivalRes = jsonData.response.body.items.item;
    let index = 0;
    console.log(festivalRes);
   
    // 당일 날짜 이후 데이터만 필터
    const filteredByTodayData = festivalRes.filter((data)=>{
 
      return data.fstvlEndDate >= today;
    }).map(data=>{

      let address = null;
      let url = null;

      // 주소 도로명 주소 우선 표시
      // rdnmadr - 도로명 주소 / lnmadr - 지번 주소
      if (data.rdnmadr !== null && typeof data.rdnmadr === "object") {
        address = data.lnmadr;
      } else {
        address = data.rdnmadr;
      }
      
      if (!address) {
        address = "주소없음";
      }

      // 홈페이지 주소가 없을 경우
      if (data.homepageUrl !== null && typeof data.homepageUrl === "object") {
        url = "지자체 홈페이지를 확인해주세요.";
      }else{
        url = data.homepageUrl;
      }

      // + 기호 제거
      const mnnstNm = data.mnnstNm.replace(/\+/g, '');
      const auspcInsttNm =data.auspcInsttNm.replace(/\+/g, '');
      const fstvlCo =data.fstvlCo.replace(/\+/g, '');

      return {
        latitude : data.latitude,
        longitude: data.longitude,
        auspcInsttNm: auspcInsttNm,  // 축제기관
        fstvlCo: fstvlCo,  // 축제 상세
        fstvlEndDate: data.fstvlEndDate, // 종료일
        fstvlNm: data.fstvlNm, // 축제이름
        fstvlStartDate: data.fstvlStartDate, // 시작일
        homepageUrl: url, // 홈페이지 주소
        address : address,  // 주소
        mnnstNm: mnnstNm, // 개최기관?
        opar: data.opar, // 장소명
        phoneNumber: data.phoneNumber, //전화번호
        id: index++, // id 값에 인덱스를 1씩 증가
      };
    })

    return filteredByTodayData;
  
}
  
  export default festivalDatas;
