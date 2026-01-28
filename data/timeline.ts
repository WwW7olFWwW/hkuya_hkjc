export interface TimelineEvent {
  date: string
  content: string[]
  highlight?: boolean
}

export interface ProjectDetail {
  icon: string
  title: string
  content: string[]
}

export const timelineEvents: TimelineEvent[] = [
  {
    date: 'March, 2025',
    content: ['宣傳推廣', 'Promotion Period'],
    highlight: true
  },
  {
    date: '21 March 2025',
    content: ['報名截止', 'Applications Deadline'],
    highlight: true
  },
  {
    date: '29 March 2025',
    content: ['第一輪面試', 'First Round Interview'],
    highlight: true
  },
  {
    date: 'April 2025',
    content: ['發送首批錄取通知書及確認崗位', 'First batch of admission letters will be issued and positions will be confirmed'],
    highlight: true
  },
  {
    date: '10 May 2025',
    content: ['第二輪面試', 'Second Round Interview'],
    highlight: true
  },
  {
    date: 'May 2025',
    content: ['發送第二批錄取通知書及確認崗位', 'Second batch of admission letters will be issued and positions will be confirmed'],
    highlight: true
  },
  {
    date: '7 June 2025 (T.B.C)',
    content: ['出發前簡介會', 'Information Session'],
    highlight: true
  },
  {
    date: '22 June 2025 - 19 July 2025',
    content: [
      '實習',
      '週一至週五：到實習機構上班',
      '週末：大會安排外出考察當地重要發展項目/參觀當地景點',
      'Internship',
      'Weekdays: Internship in the designed institutions',
      'Weekends: Visit to the local sites'
    ],
    highlight: true
  },
  {
    date: 'End of Aug 2025',
    content: ['總結分享會（按金將於同日退還）', 'Sharing Session (Deposits will be refunded on the same day)'],
    highlight: true
  }
]

export const projectDetails: ProjectDetail[] = [
  {
    icon: 'money',
    title: '薪金 salary',
    content: ['本次實習不提供薪金，項目費用根據實習地點要求', 'No salary is provided for this internship']
  },
  {
    icon: 'hotel',
    title: '住宿 Accommodation',
    content: ['入主當地酒店（兩名同性別參加者一房）', 'Stay in the local hotel (two people of the same gender)']
  },
  {
    icon: 'shield',
    title: '保險 Insurance',
    content: ['主辦方將會為每名參加者購買保險', 'Insurance will be purchased for each participant']
  },
  {
    icon: 'meal',
    title: '用餐 Meal',
    content: ['主辦方僅提供早餐，其他自理', 'Only breakfast is provided, other expenses are at own expenses']
  },
  {
    icon: 'bus',
    title: '交通 Transportation',
    content: [
      '主辦方將不會提供當地交通（週末活動則由大會機構安排）',
      'No local transportation to and from the internship location',
      '(Official weekend activities will be arranged and covered)'
    ]
  }
]
