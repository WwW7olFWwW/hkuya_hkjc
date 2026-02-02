import { timelineEvents, projectDetails } from "../../data/timeline"
import { positionGroups } from "../../data/positions"

export const defaultContent = {
  project_intro: {
    fields: {
      titleZh: "“實踐科創·探知歷史”2024-2025",
      subtitleZh: "暑期實習團",
      titleEn: "“Reimagining History, Innovating Tomorrow”",
      subtitleEn: "Summer Internship Program 2024-2025",
      descriptionZh:
        "“實踐科創·探知歷史”暑期實習計劃旨在透過實習認識科創行業，體驗不同企業的文化背景及創新科技業界的工作，同時，讓實習生在工作中學習相關的專業知識，培養他們日後投身不同領域事業的興趣。參與者將有機會在北京和大灣區（廣州、深圳）的知名企業和機構進行實習，拓展視野，增強專業能力。計劃不僅鼓勵來自不同學校的青年學子互相交流與合作，還設有一系列的增值活動，包括企業參訪、文化名勝考察以及與業界領袖及大學生的交流對話。這些活動將為參與者提供全方位的學習體驗，助力他們在職業發展上邁出堅實步伐。",
      descriptionEn:
        "“Reimagining History, Innovating Tomorrow” Summer Internship Program 2025 aims to introduce participants to the innovation and technology industry through internships, allowing them to experience the cultural backgrounds of different companies and work in the innovative tech sector. At the same time, the program provides interns with the opportunity to acquire relevant professional knowledge and develop an interest in pursuing careers in various fields. Participants will have the chance to intern at renowned companies and organizations in Beijing and the Greater Bay Area (Guangzhou, Shenzhen), expanding their horizons and enhancing their professional capabilities. The program encourages young people from different schools to communicate and collaborate and includes a series of value-added activities, such as company visits, cultural heritage tours, and exchanges with industry leaders and university students. These activities will offer participants a comprehensive learning experience, helping them take solid steps in their career development.",
      posterUrl: "/images/poster.webp",
      infoCards: [
        {
          titleZh: "實習日期",
          titleEn: "Internship Period",
          contentZh: "2025年6月22日至7月19日",
          contentEn: "June 22 - July 19, 2025"
        },
        {
          titleZh: "實習崗位範疇",
          titleEn: "Positions",
          contentZh: "科創產業",
          contentEn: "Science, Innovation and Technology Industry"
        },
        {
          titleZh: "實習地點",
          titleEn: "Location",
          contentZh: "北京及大灣區（廣州和深圳）",
          contentEn: "Beijing and Greater Bay Area (Guangzhou, Shenzhen)"
        },
        {
          titleZh: "名額",
          titleEn: "Quota",
          contentZh: "40名",
          contentEn: "40 participants"
        }
      ],
      eligibilityZh: [
        "a. 18 歲以上的各大院校之全日制學生或應屆畢業生",
        "b. （i）持有有效香港永久居民身份證 或（ii）持有有效香港居民身份證並在香港就讀全日制課程"
      ],
      eligibilityEn: [
        "a. Full-time students or recent graduates from various universities who are 18 years of age or older; and",
        "b. (i) Hold a valid Hong Kong Permanent Resident Identity Card, or (ii) Hold a valid Hong Kong Resident Identity Card and are enrolled in a full-time program in Hong Kong."
      ],
      feeZh: [
        "團費：全免（包括來回交通、住宿、保險、交流活動等費用）",
        "按金：港幣2,500元正（順利完成整個實習計劃後全數退還，包括完成實習工作、實習報告及本會預先指定的學習任務）"
      ],
      feeEn: [
        "Fee: Free of Charge (covering accommodation, round-trip transportation, insurance, and breakfast)",
        "Deposits: HKD2,500 (fully refundable upon completion of the exchange and submission of a report and designated tasks)"
      ]
    }
  },
  interview: {
    fields: {
      titleZh: "面試安排",
      titleEn: "Interview",
      descriptionZh:
        "本會將根據實習崗位要求而為申請者安排面試（如申請者就讀之學科未能匹配崗位要求，則不獲面試資格）面試詳情將於稍後另行通知。",
      descriptionEn:
        "We will arrange interviews for applicants based on the requirements of the internship position (if the subject studied by the applicant does not match the job requirements, the applicant will not be eligible for the interview). Interview details will be provided later."
    }
  },
  timeline: {
    fields: {
      titleZh: "作息時程",
      titleEn: "Timeline",
      steps: timelineEvents,
      notes: projectDetails
    }
  },
  positions: {
    fields: {
      titleZh: "實習崗位",
      titleEn: "Job Positions",
      groups: positionGroups
    }
  },
  about_us: {
    fields: {
      titleZh: "關於我們",
      titleEn: "About Us",
      organizations: [
        {
          role: "承辦單位 Organizer",
          name: "",
          logo: "/images/logo.png",
          url: "https://www.hkuya.org.hk/"
        },
        {
          role: "贊助單位 Sponsor",
          name: "",
          logo: "/images/hkjc_140_bi_tc_logo_cmyk_coated_full_colour_ol.png",
          url: "https://www.hkjc.com/"
        },
        {
          role: "支持單位 Support Unit",
          name: "中央政府駐港聯絡辦青年工作部",
          logo: "",
          url: ""
        }
      ]
    }
  },
  site_settings: {
    fields: {
      logoHeight: 48
    }
  },
  contact: {
    fields: {
      titleZh: "聯絡方式",
      titleEn: "Contact",
      email: "mail@hkuya.org.hk",
      tel: "2598 9385"
    }
  }
}
