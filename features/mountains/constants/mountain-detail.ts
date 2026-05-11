export type CourseDifficulty = "초급" | "중급" | "상급";

export type Course = {
  id: number;
  title: string;
  difficulty: CourseDifficulty;
  distanceKm: number;
  durationHours: number;
  imageUrl?: string;
  imageSource?: number;
};

export const MOCK_COURSES: Course[] = [
  {
    id: 1,
    title: "관악산 코스 1",
    difficulty: "초급",
    distanceKm: 10,
    durationHours: 3,
    imageSource: require("@/assets/images/courses/course-1.png"),
    imageUrl:
      "https://github-production-user-asset-6210df.s3.amazonaws.com/92029332/589566263-44c884d0-f20f-48b5-84a4-e1308e924c39.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20260508%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260508T132116Z&X-Amz-Expires=300&X-Amz-Signature=9dc14ad9355f4d2ec5685a136ecd3486816d5d3a4686677a8ef3174e1628d551&X-Amz-SignedHeaders=host&response-content-type=image%2Fpng",
  },
  {
    id: 2,
    title: "관악산 코스 2",
    difficulty: "중급",
    distanceKm: 10,
    durationHours: 3,
    imageSource: require("@/assets/images/courses/course-2.png"),
    imageUrl:
      "https://private-user-images.githubusercontent.com/92029332/589567487-cd5026ab-a0c0-497d-b9ed-7677036f9183.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NzgyNDY4OTAsIm5iZiI6MTc3ODI0NjU5MCwicGF0aCI6Ii85MjAyOTMzMi81ODk1Njc0ODctY2Q1MDI2YWItYTBjMC00OTdkLWI5ZWQtNzY3NzAzNmY5MTgzLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNjA1MDglMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjYwNTA4VDEzMjMxMFomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTBjZTA4MzY4NTMzMTIwNGI4NzBhOGVjZDBjMDg1MGY4YzhjN2QzNDY2NDFhNDQ2MmMwNDUxYTdhYzYyZTY4YzQmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JnJlc3BvbnNlLWNvbnRlbnQtdHlwZT1pbWFnZSUyRnBuZyJ9.E_2ZCDx-VGAhMQ5kCi0_gTfPOOvkhn5BhfOVUOKQ3jY",
  },
  {
    id: 3,
    title: "관악산 코스 3",
    difficulty: "상급",
    distanceKm: 10,
    durationHours: 3,
    imageSource: require("@/assets/images/courses/course-1.png"),
    imageUrl:
      "https://private-user-images.githubusercontent.com/92029332/589568080-428d31c1-428a-4aac-a81f-d524181eca34.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NzgyNDY5NDcsIm5iZiI6MTc3ODI0NjY0NywicGF0aCI6Ii85MjAyOTMzMi81ODk1NjgwODAtNDI4ZDMxYzEtNDI4YS00YWFjLWE4MWYtZDUyNDE4MWVjYTM0LnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNjA1MDglMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjYwNTA4VDEzMjQwN1omWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWMwZmRjMTJmZTljZmRmZGNjMWUyYWM3NjIwNDQ3OGVmNjczOTA3NDdjZDVkOTAzZDc5YzA2NDI4ZmU4NDg0ZDcmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JnJlc3BvbnNlLWNvbnRlbnQtdHlwZT1pbWFnZSUyRnBuZyJ9.PMUGvrvlSWAMzHqlrIMewohUh48_4CXnbnjH6uJppUw",
  },
  {
    id: 4,
    title: "관악산 코스 4",
    difficulty: "상급",
    distanceKm: 10,
    durationHours: 3,
    imageSource: require("@/assets/images/courses/course-2.png"),
    imageUrl:
      "https://private-user-images.githubusercontent.com/92029332/589567487-cd5026ab-a0c0-497d-b9ed-7677036f9183.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NzgyNDY4OTAsIm5iZiI6MTc3ODI0NjU5MCwicGF0aCI6Ii85MjAyOTMzMi81ODk1Njc0ODctY2Q1MDI2YWItYTBjMC00OTdkLWI5ZWQtNzY3NzAzNmY5MTgzLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNjA1MDglMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjYwNTA4VDEzMjMxMFomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTBjZTA4MzY4NTMzMTIwNGI4NzBhOGVjZDBjMDg1MGY4YzhjN2QzNDY2NDFhNDQ2MmMwNDUxYTdhYzYyZTY4YzQmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JnJlc3BvbnNlLWNvbnRlbnQtdHlwZT1pbWFnZSUyRnBuZyJ9.E_2ZCDx-VGAhMQ5kCi0_gTfPOOvkhn5BhfOVUOKQ3jY",
  },
  {
    id: 5,
    title: "관악산 코스 5",
    difficulty: "초급",
    distanceKm: 10,
    durationHours: 3,
    imageSource: require("@/assets/images/courses/course-1.png"),
    imageUrl:
      "https://github-production-user-asset-6210df.s3.amazonaws.com/92029332/589566263-44c884d0-f20f-48b5-84a4-e1308e924c39.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20260508%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260508T132116Z&X-Amz-Expires=300&X-Amz-Signature=9dc14ad9355f4d2ec5685a136ecd3486816d5d3a4686677a8ef3174e1628d551&X-Amz-SignedHeaders=host&response-content-type=image%2Fpng",
  },
];

export type RestaurantItem = {
  id: number;
  name: string;
  category: string;
};
export type RestaurantSection = {
  title: string;
  moreLabel: string;
  items: RestaurantItem[];
};

export const RESTAURANT_SECTIONS: RestaurantSection[] = [
  {
    title: "정상에서 꺼내는 짜릿한 한입",
    moreLabel: "포장 맛집",
    items: [
      { id: 1, name: "하산주막", category: "막걸리·안주" },
      { id: 2, name: "산중카페", category: "카페·디저트" },
      { id: 3, name: "정상마트", category: "편의점·간식" },
    ],
  },
  {
    title: "하산 후 국룰 한잔",
    moreLabel: "하산 맛집",
    items: [
      { id: 1, name: "막걸리타운", category: "막걸리·안주" },
      { id: 2, name: "산밑식당", category: "한식·백반" },
      { id: 3, name: "냉면집", category: "냉면·분식" },
    ],
  },
  {
    title: "체력 회복 필수 코스",
    moreLabel: "보양식 맛집",
    items: [
      { id: 1, name: "해장국집", category: "해장국·국밥" },
      { id: 2, name: "삼겹살타운", category: "삼겹살·구이" },
      { id: 3, name: "칼국수집", category: "칼국수·수제비" },
    ],
  },
];

export type Review = {
  id: number;
  userName: string;
  text: string;
  courseName: string;
  difficulty: CourseDifficulty;
};

export const MOCK_REVIEWS: Review[] = [
  {
    id: 1,
    userName: "나는야엄홍길",
    text: "서울대입구 쪽으로 올라갔는데 초반은 그냥 산책 느낌이라 방심했음. 중간부터 슬슬 힘들어지더라구요. 정말정말 힘들었어요. 그렇지만, 재밌었답니다.",
    courseName: "과천향교 출발 코스",
    difficulty: "초급",
  },
  {
    id: 2,
    userName: "나는야엄홍길",
    text: "서울대입구 쪽으로 올라갔는데 초반은 그냥 산책 느낌이라 방심했음. 중간부터 슬슬 힘들어지더라구요. 정말정말 힘들었어요. 그렇지만, 재밌었답니다.",
    courseName: "과천향교 출발 코스",
    difficulty: "초급",
  },
  {
    id: 3,
    userName: "나는야엄홍길",
    text: "서울대입구 쪽으로 올라갔는데 초반은 그냥 산책 느낌이라 방심했음. 중간부터 슬슬 힘들어지더라구요. 정말정말 힘들었어요. 그렇지만, 재밌었답니다.",
    courseName: "과천향교 출발 코스",
    difficulty: "초급",
  },
];
