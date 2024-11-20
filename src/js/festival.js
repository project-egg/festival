import { xmlToJson } from "./xmlToJson.js";

const pageNo = 1;
const festivalDatas = {};

const apiKey =
  "3ih8%2BQR83rsvCEY8npFeJxn4kCUYoPwt%2BCGlm5t4iMup1WvwgEErvFno2bFeGwyZ20DymdWNc7mQlGVM8Pb9tg%3D%3D";
const apiUrl = `http://api.data.go.kr/openapi/tn_pubr_public_cltur_fstvl_api?serviceKey=${apiKey}&pageNo=${pageNo}&numOfRows=10`; // API 호출 URL

// fetch API를 사용하여 호출
const dataAPI = fetch(apiUrl)
  .then((response) => {
    return response.text();
  })
  .then((data) => {
    let XmlNode = new DOMParser().parseFromString(data, "text/xml");

    // xml형식을 json으로 파싱
    const jsonData = xmlToJson(XmlNode);
    const festivalRes = jsonData.response.body.items.item;
    console.log(festivalRes);

    festivalDatas = festivalRes;

    // 필터 예시
    const filterData = festivalRes.filter((festival) => {
      // 축제 2024년부터~
      const regex = new RegExp("^2024-");
      return regex.test(festival.fstvlStartDate);
    });

    // 강원도 축제 오름차순
    const filterRe = festivalRes
      .filter((festival) => {
        if (typeof festival.lnmadr === "string") {
          return festival.lnmadr.includes("강원");
        }
      })
      .sort((a, b) => {
        const dateA = new Date(a.fstvlStartDate);
        const dateB = new Date(b.fstvlStartDate);
        return dateA - dateB;
      });
    console.log(filterData);
    console.log(filterRe);
  });

export { festivalDatas };
