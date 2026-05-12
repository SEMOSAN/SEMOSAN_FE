export type Post = {
  id: string;
  title: string;
  body: string;
  date: string;
  views: number;
  likes: number;
  comments: number;
  imageCount?: number;
};

export const MOCK_POSTS: Post[] = [
  {
    id: "1",
    title: "등산할 때 신기 좋은 신발 추천 부탁드려요!",
    body: "아치가 무너져서 오래 걷기 힘든데 이런 사람한테도 괜찮은 신발 있으면 알려주세요. 등산하고는 싶은 때 준비할 게 많아서 쉽지 않네요 ~",
    date: "2026.04.27",
    views: 234,
    likes: 3,
    comments: 8,
  },
  {
    id: "2",
    title: "등산할 때 신기 좋은 신발 추천 부탁드려요!",
    body: "아치가 무너져서 오래 걷기 힘든데 이런 사람한테도 괜찮은 신발 있으면 알려주세요. 등산하고는 싶은 때 준비할 게 많아서 쉽지 않네요 ~",
    date: "2026.04.27",
    views: 234,
    likes: 3,
    comments: 8,
    imageCount: 1,
  },
  {
    id: "3",
    title: "등산할 때 신기 좋은 신발 추천 부탁드려요!",
    body: "아치가 무너져서 오래 걷기 힘든데 이런 사람한테도 괜찮은 신발 있으면 알려주세요. 등산하고는 싶은 때 준비할 게 많아서 쉽지 않네요 ~",
    date: "2026.04.27",
    views: 234,
    likes: 3,
    comments: 8,
    imageCount: 2,
  },
  {
    id: "4",
    title: "등산할 때 신기 좋은 신발 추천 부탁드려요!",
    body: "아치가 무너져서 오래 걷기 힘든데 이런 사람한테도 괜찮은 신발 있으면 알려주세요. 등산하고는 싶은 때 준비할 게 많아서 쉽지 않네요 ~",
    date: "2026.04.27",
    views: 234,
    likes: 3,
    comments: 8,
  },
  {
    id: "5",
    title: "등산할 때 신기 좋은 신발 추천 부탁드려요!",
    body: "아치가 무너져서 오래 걷기 힘든데 이런 사람한테도 괜찮은 신발 있으면 알려주세요. 등산하고는 싶은 때 준비할 게 많아서 쉽지 않네요 ~",
    date: "2026.04.27",
    views: 234,
    likes: 3,
    comments: 8,
  },
];
