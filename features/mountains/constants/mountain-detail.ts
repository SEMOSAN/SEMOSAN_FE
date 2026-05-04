export type CourseDifficulty = "초급" | "중급" | "상급";

export type Course = {
  id: number;
  title: string;
  difficulty: CourseDifficulty;
  distanceKm: number;
  durationHours: number;
};

export const MOCK_COURSES: Course[] = [
  {
    id: 1,
    title: "관악산 코스 1",
    difficulty: "초급",
    distanceKm: 10,
    durationHours: 3,
  },
  {
    id: 2,
    title: "관악산 코스 2",
    difficulty: "중급",
    distanceKm: 10,
    durationHours: 3,
  },
  {
    id: 3,
    title: "관악산 코스 3",
    difficulty: "상급",
    distanceKm: 10,
    durationHours: 3,
  },
  {
    id: 4,
    title: "관악산 코스 4",
    difficulty: "상급",
    distanceKm: 10,
    durationHours: 3,
  },
  {
    id: 5,
    title: "관악산 코스 5",
    difficulty: "초급",
    distanceKm: 10,
    durationHours: 3,
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
