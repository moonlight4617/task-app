import { v4 as uuidv4 } from "uuid";

const dummyData = [
  {
    id: uuidv4(),
    title: "📝進行中のタスク",
    tasks: [
      {
        id: uuidv4(),
        title: "Reactの勉強",
        pic: "担当者A",
        startDate: "2022/09/20",
        compDate: "2022/09/30",
      },
      {
        id: uuidv4(),
        title: "Youtubeで勉強",
        pic: "担当者A、B",
        startDate: "2022/09/22",
        compDate: "2022/09/31",
      },
      {
        id: uuidv4(),
        title: "散歩",
        pic: "担当者C",
        startDate: "2022/09/10",
        compDate: "2022/10/2",
      },
    ],
  },
  {
    id: uuidv4(),
    title: "🚀今後のタスク",
    tasks: [
      {
        id: uuidv4(),
        title: "コーディング",
        pic: "担当者B",
        startDate: "2022/10/4",
        compDate: "2022/10/12",
      },
      {
        id: uuidv4(),
        title: "転職活動",
        pic: "担当者A、C",
        startDate: "2022/10/6",
        compDate: "2022/10/15",
      },
    ],
  },
  {
    id: uuidv4(),
    title: "🌳完了タスク",
    tasks: [
      {
        id: uuidv4(),
        title: "読書",
        pic: "担当者C",
        startDate: "2022/08/01",
        compDate: "2022/08/15",
      },
    ],
  },
];

export default dummyData;