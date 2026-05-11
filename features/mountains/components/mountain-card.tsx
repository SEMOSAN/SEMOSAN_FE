import { COURSE_BADGE } from "@/features/mountains/constants/course-badge";
import React from "react";
import { Image, Text, View } from "react-native";

export type Difficulty = "하" | "중" | "상";

export type Mountain = {
  id: number;
  name: string;
  location: string;
  altitude: number;
  difficulty: Difficulty;
  imageUrl?: string;
};

export const MOCK_MOUNTAINS: Mountain[] = [
  {
    id: 1,
    name: "북한산",
    location: "서울 도봉구 도봉동",
    altitude: 837,
    difficulty: "상",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Insoo_peak.jpg/330px-Insoo_peak.jpg",
  },
  {
    id: 2,
    name: "도봉산",
    location: "서울 도봉구 도봉동",
    altitude: 740,
    difficulty: "하",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/ko/thumb/b/be/Dobongsan.jpg/330px-Dobongsan.jpg",
  },
  {
    id: 3,
    name: "수락산",
    location: "서울 노원구 상계동",
    altitude: 638,
    difficulty: "상",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Suraksan.JPG/330px-Suraksan.JPG",
  },
  {
    id: 4,
    name: "관악산",
    location: "서울 관악구 신림동",
    altitude: 632,
    difficulty: "상",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Gwanaksan_Seoul_KR.jpg/330px-Gwanaksan_Seoul_KR.jpg",
  },
  {
    id: 5,
    name: "청계산",
    location: "서울 서초구 원지동",
    altitude: 618,
    difficulty: "중",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Maebawi_of_Cheong_gye_Mt_Seoul.JPG/330px-Maebawi_of_Cheong_gye_Mt_Seoul.JPG",
  },
  {
    id: 6,
    name: "불암산",
    location: "서울 노원구 중계동",
    altitude: 508,
    difficulty: "상",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Buram_Mountain_Peak.JPG/330px-Buram_Mountain_Peak.JPG",
  },
  {
    id: 7,
    name: "삼성산",
    location: "서울 관악구 남현동",
    altitude: 481,
    difficulty: "상",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Samsungsan.jpg/330px-Samsungsan.jpg",
  },
  {
    id: 8,
    name: "남한산",
    location: "서울 송파구 마천동",
    altitude: 522,
    difficulty: "상",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Korea-Namhansanseong-10.jpg/330px-Korea-Namhansanseong-10.jpg",
  },
  {
    id: 9,
    name: "용마산",
    location: "서울 광진구 중곡동",
    altitude: 348,
    difficulty: "상",
    imageUrl: "http://www.mhtimes.kr/data/newsThumb/1695002162ADD_thumb580.jpg",
  },
  {
    id: 10,
    name: "북악산",
    location: "서울 종로구 청운동",
    altitude: 342,
    difficulty: "상",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Seoul_Gyeongbokgung_Blue_House_Bukhansan.jpg/330px-Seoul_Gyeongbokgung_Blue_House_Bukhansan.jpg",
  },
  {
    id: 11,
    name: "인왕산",
    location: "서울 서대문구 홍제동",
    altitude: 338,
    difficulty: "중",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Mount_Inwang.jpg/330px-Mount_Inwang.jpg",
  },
  {
    id: 12,
    name: "인릉산",
    location: "서울 서초구 내곡동",
    altitude: 326,
    difficulty: "상",
    imageUrl:
      "http://pnuac.com/files/attach/images/103/029/093/be8dcdf5dc58aa679606712d76dd4b77.jpg",
  },
  {
    id: 13,
    name: "구룡산",
    location: "서울 서초구 염곡동",
    altitude: 306,
    difficulty: "상",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/%EA%B5%AC%EB%A3%A1%EC%82%B0.jpg/330px-%EA%B5%AC%EB%A3%A1%EC%82%B0.jpg",
  },
  {
    id: 14,
    name: "아차산",
    location: "서울 광진구 광장동",
    altitude: 287,
    difficulty: "하",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/AchasanPost.jpg/330px-AchasanPost.jpg",
  },
  {
    id: 15,
    name: "대모산",
    location: "서울 강남구 개포동",
    altitude: 293,
    difficulty: "상",
    imageUrl:
      "https://www.gangnam.go.kr/assets/images/contents/01/011102_img01.jpg",
  },
  {
    id: 16,
    name: "우면산",
    location: "서울 서초구 우면동",
    altitude: 293,
    difficulty: "상",
    imageUrl:
      "https://i.namu.wiki/i/2HANF35TPXMhUJEL1cgmbVCVDnWKJN5XjjRIrxv7-bvtMNlkTiSVRJxbxftR7w81HfKa9jKVC0thDTIShjKmUdUKYQCEtWX_2diBaL9TSiBFPvEQequMfLZxfVFwYZldWIC-lQKYjRPeDNcA_5pang.webp",
  },
  {
    id: 17,
    name: "안산",
    location: "서울 서대문구 홍제동",
    altitude: 296,
    difficulty: "하",
    imageUrl:
      "https://cdn.tongilnews.com/news/photo/201609/118264_53108_311.jpg",
  },
  {
    id: 18,
    name: "남산",
    location: "서울 중구 예장동",
    altitude: 262,
    difficulty: "상",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Seoul_Aerial_Shot_13.jpg/330px-Seoul_Aerial_Shot_13.jpg",
  },
  {
    id: 19,
    name: "백련산",
    location: "서울 은평구 응암동",
    altitude: 216,
    difficulty: "상",
    imageUrl:
      "https://mediahub.seoul.go.kr/uploads/mediahub/2023/03/aTlfPNPKiehfQLdIqHZbmsMMAHdnYPwP.jpg",
  },
  {
    id: 20,
    name: "매봉산",
    location: "서울 용산구 도원동",
    altitude: 236,
    difficulty: "상",
    imageUrl:
      "https://devin.aks.ac.kr/image/73580ef3-202e-4751-b698-b8243dd88c30?preset=orig",
  },
  {
    id: 21,
    name: "봉제산",
    location: "서울 강서구 화곡동",
    altitude: 193,
    difficulty: "상",
    imageUrl:
      "https://mediahub.seoul.go.kr/uploads/mediahub/2021/06/TrnaQAqGHDbpptaXkVAwDxeVqENxzgMR.JPG",
  },
  {
    id: 22,
    name: "일자산",
    location: "서울 강동구 고덕동",
    altitude: 150,
    difficulty: "상",
    imageUrl:
      "https://i.namu.wiki/i/ISw7R1DE7MhtMQebkEbjxM5vT0MZyzkO9hHuKXjP4W9DBsTmUJV_ZqlFEvvoXwJEJuCZFk4NUVikxMPOnYALKmehIDEIGifsjZECxr6S-1h9uhuSHTszscAkgcsee-7y12A51VI613SiP6WJmuOEYw.webp",
  },
  {
    id: 23,
    name: "굴봉산",
    location: "서울 구로구 오류동",
    altitude: 145,
    difficulty: "상",
    imageUrl: "https://cdn.chunsa.kr/news/photo/202309/56164_23471_637.jpg",
  },
  {
    id: 24,
    name: "개화산",
    location: "서울 강서구 개화동",
    altitude: 132,
    difficulty: "상",
    imageUrl:
      "https://mediahub.seoul.go.kr/uploads/mediahub/2023/11/HmtMDrIbPHjbXZUqZSQqvQmXFdlfEWvv.jpg",
  },
  {
    id: 25,
    name: "개운산",
    location: "서울 성북구 안암동",
    altitude: 134,
    difficulty: "상",
    imageUrl:
      "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FcxhhG3%2FbtsJ3IVw37N%2FAAAAAAAAAAAAAAAAAAAAAGvxOSB-T3VwQR7N6iAV6F9oDm6-XrRMZnyKu7FPo6mg%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1780239599%26allow_ip%3D%26allow_referer%3D%26signature%3D4XDTHKydHxng%252F%252BrcCExHnCWdZjs%253D",
  },
  {
    id: 26,
    name: "금호산",
    location: "서울 성동구 금호동",
    altitude: 140,
    difficulty: "상",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Eungbongsan_Mountain_Spring_01_%2825558972543%29.jpg/330px-Eungbongsan_Mountain_Spring_01_%2825558972543%29.jpg",
  },
  {
    id: 27,
    name: "벽오산",
    location: "서울 강북구 번동",
    altitude: 135,
    difficulty: "상",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Bukhansan_Spring_in_Korea.jpg/330px-Bukhansan_Spring_in_Korea.jpg",
  },
  {
    id: 28,
    name: "봉화산",
    location: "서울 중랑구 신내동",
    altitude: 138,
    difficulty: "상",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Bukhansan_landscape_and_azalia.jpg/330px-Bukhansan_landscape_and_azalia.jpg",
  },
  {
    id: 29,
    name: "오패산",
    location: "서울 성북구 월곡동",
    altitude: 123,
    difficulty: "상",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Mount_Inwang.jpg/330px-Mount_Inwang.jpg",
  },
  {
    id: 30,
    name: "대현산",
    location: "서울 성동구 옥수동",
    altitude: 123,
    difficulty: "상",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Gwanaksan_Seoul_KR.jpg/330px-Gwanaksan_Seoul_KR.jpg",
  },
  {
    id: 31,
    name: "낙산",
    location: "서울 종로구 동숭동",
    altitude: 125,
    difficulty: "상",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Seoul_Aerial_Shot_13.jpg/330px-Seoul_Aerial_Shot_13.jpg",
  },
  {
    id: 32,
    name: "개웅산",
    location: "서울 구로구 개봉동",
    altitude: 125,
    difficulty: "상",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Suraksan.JPG/330px-Suraksan.JPG",
  },
  {
    id: 33,
    name: "응봉산",
    location: "서울 성동구 응봉동",
    altitude: 81,
    difficulty: "상",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Eungbongsan_Mountain_Spring_01_%2825558972543%29.jpg/330px-Eungbongsan_Mountain_Spring_01_%2825558972543%29.jpg",
  },
  {
    id: 34,
    name: "와우산",
    location: "서울 마포구 창전동",
    altitude: 79,
    difficulty: "상",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Maebawi_of_Cheong_gye_Mt_Seoul.JPG/330px-Maebawi_of_Cheong_gye_Mt_Seoul.JPG",
  },
  {
    id: 35,
    name: "우장산",
    location: "서울 강서구 화곡동",
    altitude: 99,
    difficulty: "상",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Samsungsan.jpg/330px-Samsungsan.jpg",
  },
  {
    id: 36,
    name: "용왕산",
    location: "서울 양천구 신월동",
    altitude: 78,
    difficulty: "상",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/AchasanPost.jpg/330px-AchasanPost.jpg",
  },
  {
    id: 37,
    name: "배봉산",
    location: "서울 동대문구 전농동",
    altitude: 106,
    difficulty: "상",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Seoul_Gyeongbokgung_Blue_House_Bukhansan.jpg/330px-Seoul_Gyeongbokgung_Blue_House_Bukhansan.jpg",
  },
  {
    id: 38,
    name: "노고산",
    location: "서울 마포구 노고산동",
    altitude: 106,
    difficulty: "상",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Insoo_peak.jpg/330px-Insoo_peak.jpg",
  },
  {
    id: 39,
    name: "성산",
    location: "서울 마포구 성산동",
    altitude: 66,
    difficulty: "상",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Buram_Mountain_Peak.JPG/330px-Buram_Mountain_Peak.JPG",
  },
  {
    id: 40,
    name: "매봉산",
    location: "서울 강남구 도곡동",
    altitude: 95,
    difficulty: "상",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/%EA%B5%AC%EB%A3%A1%EC%82%B0.jpg/330px-%EA%B5%AC%EB%A3%A1%EC%82%B0.jpg",
  },
];

export const DIFFICULTY_STYLE: Record<Difficulty, string> = {
  하: COURSE_BADGE.초급.text,
  중: COURSE_BADGE.중급.text,
  상: COURSE_BADGE.상급.text,
};

export function MountainCard({
  mountain,
}: {
  mountain: Mountain;
}): React.JSX.Element {
  return (
    <View className="flex-row items-center gap-4">
      <Image
        source={{ uri: mountain.imageUrl }}
        className="h-[72px] w-[86px] rounded-[10px] bg-fill-stronger"
        resizeMode="cover"
      />
      <View className="flex-col gap-1.5">
        <View className="flex-row items-end gap-[9px]">
          <Text className="text-label-normal typo-headline-1-semi-bold">
            {mountain.name}
          </Text>
          <Text className="pb-[3px] text-label-subtler typo-body-3-medium">
            {mountain.location}
          </Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <Text className="text-label-subtle typo-body-3-medium">
            고도 {mountain.altitude}m
          </Text>
          <View className="h-0.5 w-0.5 rounded-full bg-label-subtler" />
          <Text
            className={`typo-body-3-semi-bold ${DIFFICULTY_STYLE[mountain.difficulty]}`}
          >
            난이도 {mountain.difficulty}
          </Text>
        </View>
      </View>
    </View>
  );
}
