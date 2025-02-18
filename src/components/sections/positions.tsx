'use client';

import React from 'react';
import { Box, Typography, Paper, Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Section } from '@/components/layout/section';
import { PageContainer } from '@/components/layout/page-container';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import WorkIcon from '@mui/icons-material/Work';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

interface Position {
  company: string;
  role?: string;
  requirements?: string[];
  duties?: string[];
}

interface LocationGroup {
  location: string;
  description: string;
  positions: Position[];
  }

const positionData: LocationGroup[] = [
  {
    location: '北京',
    description: '科創企業，包括但不限於以下企業（持續更新中）',
    positions: [
      {
        company: '中國科學院生態環境研究中心 Chinese Academy of Sciences',
        role: '科研實習崗 Research Internship Position',
        duties: ['以水質淨化研究為主，涵蓋材料、人工智慧、淨水工藝、水生態等，相關方向的科學研究','Focus on water quality purification research, covering materials, artificial intelligence, water treatment processes, aquatic ecology, and other related scientific research directions.'],
        requirements: ['有相關專業學術背景，熟練使用分析儀器優先','Academic background in relevant fields, proficiency in using analytical instruments is preferred.']
      },

      {
        company: '中國科學院生態環境研究中心 Chinese Academy of Sciences',
        role: '科研實習崗 Research Internship Position',
        duties: ['參加大熊貓棲息地三維結構遙感監測相關研究 ','Participate in research related to the 3D structural remote sensing monitoring of giant panda habitats.'],
        requirements: ['有遙感、GIS、機器視覺等相關專業背景優先','A background in remote sensing, GIS, machine vision, or related fields is preferred.']
      },

      {
        company: '中國科學院生態環境研究中心 Chinese Academy of Sciences',
        role: '科研實習崗 Research Internship Position',
        duties: ['參加大熊貓分佈區生物多樣性多模態資料獲取、傳輸系統研發的相關工作','Participate in the research and development of the multimodal data collection and transmission system for biodiversity in giant panda distribution areas.'],
        requirements: ['有資料傳輸、多模態大資料管理、等相關專業背景優先','A background in data transmission, multimodal big data management, or related fields is preferred.']
      },

      {
        company: '中國科學院生態環境研究中心 Chinese Academy of Sciences',
        role: '科研實習崗 Research Internship Position',
        duties: ['參加國家公園相關研究項目','Participate in research projects related to national parks.'],
        requirements: ['生態、環境、地理、動植物、自然資源等相關專業','Academic background in relevant fields.']
      },      
      
      {
        company: '北京眸視科技有限公司',
        role: '稍候公佈',
        duties: ['稍候公佈'],
        requirements: ['稍候公佈']
      },

      {
        company: '新東方前途出國歐亞教育',
        role: '新媒體推廣方向',
        duties: ['負責策劃、編輯和發佈話題視頻，確保內容品質、多樣性和時效性。與團隊合作，開發有吸引力的視頻和文案，增加使用者互動和參與度。',
          '管理視頻號和公眾號的社交媒體平臺，與用戶進行互動，回復評論和私信。維護良好的使用者關係，提供滿意的客戶服務，並關注使用者回饋以改進運營效果。'],
        requirements: ['會拍攝和剪輯，短視頻愛好者，有網感，熟悉視頻拍攝及構圖。',
          '港八大在讀學生，新媒體團隊成立推廣小組，配合完成選題，實習生結合實際情況，完成話題策劃、內容收集、拍攝、剪輯、發佈、造勢；',
          '具備對目標受眾的深入瞭解和洞察力，能夠根據受眾特徵和喜好制定相關內容和運營策略。熟悉受眾行為、趨勢和偏好的調研方法和工具。']
      },
      {
        company: '新東方前途出國歐亞教育',
        role: '新媒體運營方向',
        duties: ['負責新東方語培業務在新媒體平臺的內容製作與發佈，提升互動量、粉絲量；',
          '協助進行運營資料統計、私信回復、活動策劃與落地等具體工作；',
          '定期進行語培、小語種留學等業務競品調研，輸出分析報告；'],
        requirements: ['會拍攝和剪輯，短視頻愛好者，有網感，熟悉視頻拍攝及構圖。',
          '本科及以上學歷，有小紅書/抖音/自媒體運營經驗優先；',
          '較強的設計能力，對增長運營感興趣，學習力&執行力強，認真愛思考；',
          '聰明皮實，審美線上，熟練使用常用辦公軟體與AI；']
      },
      {
        company: '新東方前途出國歐亞教育',
        role: '業務資料資訊方向',
        duties: ['收集並核對香港、澳門、新加坡、馬來西亞、泰國院校的最新招生資訊；',
          '定期維護內部資料庫，確保資訊的準確性和時效性；',
          '根據院校政策變更和申請流程調整，優化和完善申請流程相關標準化範本及指導檔，提升工作效率和用戶體驗；',
          '根據指定專題，協助製作香港學習生活分享文件。',
          '按照院校要求，整理和整合學生的申請材料，確保格式規範、內容完整；',
          '對申請材料進行品質審查，發現並及時糾正可能存在的問題。',
          '根據學生的學術背景、經歷和申請目標，撰寫申請文書，確保文書內容符合院校的要求和學術標準，突出學生的優勢與特質。'],
        requirements: ['稍候公佈']
      },
      {
        company: '卡尤迪生物科技',
        role: '生物科技實習生',
        duties: ['協助進行各種生物實驗'],
        requirements: ['生物科技的碩士和博士']
      },
      {
        company: '北京聲智科技有限公司',
        role: '研究助理',
        duties: ['研究跟蹤國內外人工智慧及大模型理論及實踐',
            '撰寫相關研究報告'],
        requirements: ['電腦科學、人工智慧或相關領域的碩士或博士在讀，對技術有持續的熱情，遠見好學']
      },
      {
        company: '北京聲智科技有限公司',
        role: '海外媒體運營實習生',
        duties: ['海外社媒運營，包括內容運營、帳號運營、粉絲運營;',
          '挖掘相關熱點，參與海外社交媒體內容創建及更新，包含但不限於X、YouTube、Reddit、Tiktok等;',
          '視頻內容腳本編寫，熟練使用各類剪輯工具。'
        ],
        requirements: ['有較強英語寫作和溝通能力，本科及以上學歷，英語、小語種、新聞傳播傳媒類專業優先；',
          '有海外學習或生活經歷、海外社交媒體運營、網紅行銷、管道合作等相關經驗者優先；',
          '有較強的責任心，目標導向，積極主動，自驅力，資料敏感，優秀的問題分析和解決問題能力。'
        ]
      },
      {
        company: '北京聲智科技有限公司',
        role: '電商實習生',
        duties: ['協助電商團隊進行日常運營工作，包括但不限於產品上架、更新和維護電商平臺的商品資訊。',
          '跟蹤並分析店鋪運營資料，協助完成銷售目標，提升產品轉化率。',
          '協助處理客戶諮詢、投訴和售後問題，提升客戶滿意度。',
          '支持行銷活動的策劃與執行，包括促銷活動、廣告推廣和社交媒體行銷。'
        ],
        requirements: ['在校本科生或研究生，電子商務、市場行銷、商業管理或相關專業優先。',
          '熟悉主流電商平臺（如淘寶、京東等）的運營規則和流程優先。',
          '具備良好的資料分析能力和邏輯思維能力，熟練使用Excel等辦公軟體。'
        ]
      },
      {
        company: '北京聲智科技有限公司',
        role: '設計實習生',
        duties: ['協助設計師完成公司業務推廣PPT、電商頁面等排版設計',
          '協助設計師完成公司行銷視覺物料設計，包括海報、banner、h5等',
          '協助設計師參與專案前期調研，收集專案所需的素材及資料，並能產出創意內容。'
        ],
        requirements: ['本科及以上學歷，視覺傳達、工業設計、廣告設計、交互設計等相關專業優先',
          '熟練使用 Sketch、Illustrator、Photoshop 等軟體',
          '審美良好，思維敏捷，學習能力強，工作認真細緻，具備團隊精神'
        ]
      },
    ]
  },
  {
    location: '廣州',
    description: '科創企業，包括但不限於以下企業（持續更新中）',
    positions: [
      {
        company: '稍候公佈',
        role: '稍候公佈',
        duties: ['稍候公佈'],
        requirements: ['稍候公佈']
      },
    ]
  },
  {
    location: '深圳',
    description: '科創企業，包括但不限於以下企業（持續更新中）',
    positions: [      
    
      {
        company: '北京聲智科技有限公司',
        role: '抖店運營實習生',
        duties: ['負責抖店相關運營工作，上下連結，詳情頁修改、資料拉取、店鋪分評論等',
          '配合直播運營完成其他相關工作'],
        requirements: ['有抖音運營實習經驗',
          '勤奮踏實細心，積極向上，目標感強']
      },

      {
        company: '北京聲智科技有限公司',
        role: '內容實習生',
        duties: ['負責新媒體用戶端（包括但不限於抖音、小紅書、視頻號等）內容的編輯運營',
          '準確掌握新媒體內容動向和使用者偏好，對於熱點有極強的辨識力，提出創造性的策劃意見',
          '負責探索新的內容形式，能根據資料結果優化內容',
          '分析競對內容結構及話題熱點，調研目標使用者群體喜好，增長粉絲量'],
        requirements: ['本科及以上學歷，新聞、中文、理工類相關專業優先',
          '熟悉消費電子產品及使用者心理，相關經歷優先',
          '熟悉各種新媒體、新技術的運用及玩法，有服務或運營過大號者優先',
          '具備較強的溝通表達能力，簡單高效，有團隊合作精神']
      },
    
      {
        company: '北京聲智科技有限公司',
        role: '媒介實習生',
        duties: ['協助品牌產品在抖音平臺達人投放，甄別和發掘有潛力的優質KOL/KOC媒介資源，建立長期穩定的合作關係',
          '協助制定投放策略，進行合作資源篩選、價格溝通、腳本把控、視頻審核、跟進結果產出，確保按時按量完成達人投放工作',
          '協助跟進投放效果並及時對團隊同步，從多維度對投放資料進行整理分析，形成可複製的方法論'],
        requirements: ['抖音5G衝浪達人，能夠快速判斷和篩選和品牌產品相匹配的達人',
          '優秀的溝通能力、勤奮、細心、有責任心']
      },

      {
      company: '深圳辰達半導體有限公司',
      role: '品牌運營',
      duties: ['短視頻宣傳推廣製作全流程'],
      requirements: ['稍候公佈',]
    },
    {
      company: '深圳辰達半導體有限公司',
      role: '產品設計',
      duties: ['電子產品市場調研分析定義設計實現全流程'],
      requirements: ['稍候公佈',]
    },
    {
      company: '深圳辰達半導體有限公司',
      role: '培訓管理',
      duties: ['線上線下課程製作發佈執行管理'],
      requirements: ['稍候公佈',]
    },
    {
      company: '深圳辰達半導體有限公司',
      role: '人事管理',
      duties: ['人才招聘篩選培養管理'],
      requirements: ['稍候公佈',]
    },
    {
      company: '深圳市微馬視覺智慧科技有限公司',
      role: '稍候公佈',
      duties: ['稍候公佈'],
      requirements: ['稍候公佈',]
    },
    {
      company: '深圳締宙科技',
      role: '稍候公佈',
      duties: ['稍候公佈'],
      requirements: ['稍候公佈',]
    },
  ]
  }
];

function PositionCard({ position, showDivider = true }: { position: Position; showDivider?: boolean }) {
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ py: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
          <BusinessIcon sx={{ color: 'primary.main', mr: 2, mt: 0.5 }} />
          <Typography variant="h6" component="h3">
            {position.company}
          </Typography>
        </Box>

        {position.role && (
          <Box sx={{ display: 'flex', alignItems: 'flex-start', ml: 4, mb: 1 }}>
            <WorkIcon sx={{ color: 'text.secondary', mr: 2, mt: 0.5 }} />
            <Typography variant="subtitle1" color="text.primary">
              {position.role}
            </Typography>
          </Box>
        )}

        {position.requirements && position.requirements.length > 0 && (
          <Box sx={{ ml: 4, pl: 4 }}>
            <Typography variant="subtitle2" color="text.primary" sx={{ mb: 1 }}>
              崗位要求 Job Requirements
            </Typography>
            <List dense>
              {position.requirements.map((requirement, index) => (
                <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 24 }}>
                    <ArrowRightIcon color="action" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={requirement}
                    primaryTypographyProps={{
                      variant: 'body2',
                      color: 'text.secondary',
                      sx: { lineHeight: 1.6 }
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {position.duties && position.duties.length > 0 && (
          <Box sx={{ ml: 4, pl: 4 }}>
            <Typography variant="subtitle2" color="text.primary" sx={{ mb: 1 }}>
              工作內容 Job Description
            </Typography>
            <List dense>
              {position.duties.map((duty, index) => (
                <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 24 }}>
                    <ArrowRightIcon color="action" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={duty}
                    primaryTypographyProps={{
                      variant: 'body2',
                      color: 'text.secondary',
                      sx: { lineHeight: 1.6 }
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Box>
      {showDivider && <Divider />}
    </Box>
  );
}

export function Positions() {
  const [expanded, setExpanded] = React.useState<string | false>('panel-0');
  return (
    <Section id="positions">
      <PageContainer>
        <Box textAlign="center" mb={6}>
          <Typography variant="h3" component="h2" gutterBottom>
            實習崗位 Job Positions
          </Typography>
        </Box>

        <Box>
          {positionData.map((locationGroup, groupIndex) => (
            <Accordion 
              key={locationGroup.location}
              expanded={expanded === `panel-${groupIndex}`}
              onChange={(event, isExpanded) => {
                setExpanded(isExpanded ? `panel-${groupIndex}` : false);
              }}
              sx={{
                mb: 2,
                '&:before': {
                  display: 'none',
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  backgroundColor: 'grey.50',
                  '&.Mui-expanded': {
                    minHeight: 48,
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">
                    {locationGroup.location}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ ml: 2 }}
                  >
                    {locationGroup.description}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 0 }}>
                <Paper elevation={0}>
                  {locationGroup.positions.map((position, index) => (
                    <PositionCard
                      key={`${position.company}-${position.role || index}`}
                      position={position}
                      showDivider={index < locationGroup.positions.length - 1}
                    />
                  ))}
                  {locationGroup.positions.length === 0 && (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                      <Typography color="text.secondary">
                        更多職位正在更新中...
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </PageContainer>
    </Section>
  );
}


