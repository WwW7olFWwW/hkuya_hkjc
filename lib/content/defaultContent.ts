import { timelineEvents, projectDetails } from "../../data/timeline"
import { positionGroups } from "../../data/positions"

export const defaultContent = {
  project_intro: {
    fields: {
      titleZh: "港澳青年內地實習計劃",
      titleEn: "HKUYA Internship Program",
      descriptionZh:
        "香港青年聯會（HKUYA）與香港賽馬會慈善信託基金攜手舉辦『港澳青年內地實習計劃』，旨在加強港澳青年與內地的交流，提升專業能力，拓闊視野。",
      descriptionEn:
        "The Hong Kong United Youth Association (HKUYA) collaborates with The Hong Kong Jockey Club Charities Trust to launch the HKUYA Internship Program, fostering exchanges between Hong Kong and Macau youth and the mainland, enhancing professional skills and broadening horizons.",
      locationZh: "內地",
      locationEn: "Mainland China",
      programDurationZh: "約四星期",
      programDurationEn: "Around 4 weeks",
      deadlineZh: "21 March 2025",
      deadlineEn: "21 March 2025",
      ctaTextZh: "立即報名",
      ctaTextEn: "Apply Now"
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
  contact: {
    fields: {
      titleZh: "聯絡方式",
      titleEn: "Contact",
      email: "mail@hkuya.org.hk",
      tel: "2598 9385"
    }
  }
}
