export type Reply = {
  id: string;
  author: string;
  date: string;
  body: string;
  isAuthor?: boolean;
};

export type Comment = {
  id: string;
  author: string;
  date: string;
  body: string;
  isAuthor?: boolean;
  replies?: Reply[];
};

export const MOCK_POST_DETAIL = {
  author: "나는야엄홍길",
  date: "33분 전",
  title: "등산할 때 신기 좋은 신발 추천 부탁드려요!",
  body: "아치가 무너져서 오래 걷기 힘든데 이런 사람한테도 괜찮은 신발 있으면 알려주세요. 등산하고는 싶은 때 준비할 게 많아서 쉽지 않네요 ~",
  likes: 3,
  comments: 3,
};

export const MOCK_COMMENTS: Comment[] = [
  {
    id: "1",
    author: "나는야엄홍길",
    date: "33분 전",
    body: "재밌게 잘 다녀오셨나보네요 ㅎㅎ",
    isAuthor: false,
    replies: [
      {
        id: "1-1",
        author: "나는야엄홍길",
        date: "33분 전",
        body: "날씨도 좋고~ 산의 기운이 너무나도 좋습니다~~ 강추강추",
        isAuthor: true,
      },
    ],
  },
  {
    id: "2",
    author: "나는야엄홍길",
    date: "33분 전",
    body: "꽃내음을 맡으며 봄의 산을 만끽하셨겠어요 ^~^ 꽃 많이 피어있던가요~?",
    isAuthor: true,
  },
  {
    id: "3",
    author: "나는야엄홍길",
    date: "33분 전",
    body: "꽃내음을 맡으며 봄의 산을 만끽하셨겠어요 ^~^ 꽃 많이 피어있던가요~?",
    isAuthor: true,
  },
];
