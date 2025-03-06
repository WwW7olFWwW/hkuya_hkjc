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
  company: React.ReactNode;
  role?: React.ReactNode;
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
        company: (
          <> 
            <Typography variant="h6" component="div">(Suitable for English speaking students)</Typography>
            <Typography variant="h6" component="div">中國科學院生態環境研究中心</Typography>
            <Typography variant="subtitle1" color="text.secondary">Chinese Academy of Sciences</Typography>
          </>
        ),
        role: (
          <>
            <Typography variant="subtitle1">科研實習崗(環境水質學)</Typography>
            <Typography variant="subtitle2" color="text.secondary">Research Internship Position (Environmental Water Quality Science)</Typography>
          </>
        ),
        duties: ['以水質淨化研究為主，涵蓋材料、人工智慧、淨水工藝、水生態等，相關方向的科學研究','Focus on water quality purification research, covering materials, artificial intelligence, water treatment processes, aquatic ecology, and other related scientific research directions.'],
        requirements: ['有相關專業學術背景，熟練使用分析儀器優先','Academic background in relevant fields, proficiency in using analytical instruments is preferred.']
      },

      {
        company: (
          <>
            <Typography variant="h6" component="div">(Suitable for English speaking students)</Typography>
            <Typography variant="h6" component="div">中國科學院生態環境研究中心</Typography>
            <Typography variant="subtitle1" color="text.secondary">Chinese Academy of Sciences</Typography>
          </>
        ),
        role: (
          <>
            <Typography variant="subtitle1">科研實習崗(生物多樣性保護)</Typography>
            <Typography variant="subtitle2" color="text.secondary">Research Internship Position (Biodiversity Conservation)</Typography>
          </>
        ),
        duties: ['參加大熊貓棲息地三維結構遙感監測相關研究 ','Participate in research related to the 3D structural remote sensing monitoring of giant panda habitats.'],
        requirements: ['有遙感、GIS、機器視覺等相關專業背景優先','A background in remote sensing, GIS, machine vision, or related fields is preferred.']
      },

      {
        company: (
          <>
            <Typography variant="h6" component="div">(Suitable for English speaking students)</Typography>
            <Typography variant="h6" component="div">中國科學院生態環境研究中心</Typography>
            <Typography variant="subtitle1" color="text.secondary">Chinese Academy of Sciences</Typography>
          </>
        ),
        role: (
          <>
            <Typography variant="subtitle1">科研實習崗(生物多樣性保護)</Typography>
            <Typography variant="subtitle2" color="text.secondary">Research Internship Position (Biodiversity Conservation)</Typography>
          </>
        ),
        duties: ['參加大熊貓分佈區生物多樣性多模態資料獲取、傳輸系統研發的相關工作','Participate in the research and development of the multimodal data collection and transmission system for biodiversity in giant panda distribution areas.'],
        requirements: ['有資料傳輸、多模態大資料管理、等相關專業背景優先','A background in data transmission, multimodal big data management, or related fields is preferred.']
      },

      {
        company: (
          <>
           <Typography variant="h6" component="div">(Suitable for English speaking students)</Typography>
            <Typography variant="h6" component="div">中國科學院生態環境研究中心</Typography>
            <Typography variant="subtitle1" color="text.secondary">Chinese Academy of Sciences</Typography>
          </>
        ),
        role: (
          <>
            <Typography variant="subtitle1">科研實習崗(生態、環境、地理、動植物、自然資源等相關專業)</Typography>
            <Typography variant="subtitle2" color="text.secondary">Research Internship Position (Ecology, Environment, Geography, Zoology, Botany, Natural Resources, and related fields)</Typography>
          </>
        ),
        duties: ['參加國家公園相關研究項目','Participate in research projects related to national parks.'],
        requirements: ['有相關專業學術背景','Academic background in relevant fields.']
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
        company: '騰訊集團',
        role: '遊戲策劃培訓生',
        duties: ['主要負責休閒社交遊戲項目的玩法設計和玩法研究','根據項目需求，負責與玩法相關的系統功能設計和策劃案撰寫','關注國內外同品類遊戲的玩法資訊，或可以向本項目提供玩法設計創意的資訊資訊，定期輸出分析報告'],
        requirements: ['不限專業','熱愛遊戲，對休閒社交類遊戲有深入研究和獨特見解，具備創新思維','對年輕用戶的潮流文化、梗文化有充分的瞭解，具備相關內容創作經驗者優先(例如B站、youtube的UP主等)','互聯網產品分析、行業分析或商業分析相關專業優先']
      },

      {
        company: '騰訊集團',
        role: '策略分析培訓生',
        duties: ['針對遊戲行業、泛娛樂行業及技術行業進行市場調研、數據分析、競爭對手研究等商業分析工作，撰寫商業分析報告及策略建議','參與“大語言模型 AI 融入商業分析工作流”項目，支持 AI 應用開發與實踐探索'],
        requirements: ['在校本科生或研究生，專業不限（經濟、管理、計算機、數據分析等相關專業優先）','對管理諮詢、企業研究及商業分析有濃厚興趣，並具備一定的理論基礎和實操理解','具備基礎的技術能力，熟悉數據分析工具及辦公軟體，能夠進行基本的 AI 應用開發或配置 (包括使用 Cursor) 者優先','良好的溝通能力、邏輯思維和團隊合作精神，能適應快節奏的工作環境','具備自我驅動和創新精神，樂於接受新技術、新方法的挑戰']
      },

      {
        company: '騰訊集團',
        role: '商業分析培訓生',
        duties: ['負責監控遊戲及AI等前沿科技領域的最新動態，包括技術發展、市場趨勢、競爭對手分析以及政策環境變化','對遊戲行業有一定的理解，能夠對遊戲玩法進行拆解，分析運營策略','深入分析行業數據，撰寫策略專題報告，為SG提供決策支持和戰略規劃建議'],
        requirements: ['本科以上學歷，有策略分析，遊戲策劃、運營等相關工作實習經驗優先','能迅速洞察用戶需求，對遊戲有較深的認知與體驗','有敏銳的遊戲觸覺，且對於前沿科技等領域有研究，有良好的文案撰寫能力和PPT能力','工作主動積極，認真負責，溝通能力良好，團隊合作精神良好，抗壓能力強']
      },

      {
        company: '騰訊集團',
        role: '社區運營培訓生',
        duties: ['負責跟蹤AI等前沿科技領域的最新動態，包括技術發展、市場趨勢、競爭對手分析以及政策環境變化等','協助負責AI內容公眾號的運營，能根據行業內的熱點資訊，重要的技術發展、產品的動態，產出相應研究報告'],
        requirements: ['本科以上學歷，有商科或市場行銷背景，能負責社區運營，公眾號運營相關工作實習經驗優先',
          '能迅速洞察用戶需求，對遊戲有較深的認知與體驗',
          '有敏銳的遊戲觸覺，對前沿科技AI等領域有研究，有良好的文案撰寫能力和PPT能力',
          '能夠把握各類管道用戶需求以及關注點； 掌握一定的用戶研究方法，具備一定的數據分析基礎',
          '工作主動積極，認真負責，溝通能力良好，團隊合作精神良好，抗壓能力強'
        ]
      },

      
      {
        company: '騰訊集團',
        role: 'AI產品培訓生',
        duties: ['主要負責AI產品項目的玩法設計和玩法研究',
          '根據項目需求，負責相關的系統功能設計和策劃案撰寫',
        '關注國內外同品類產品的玩法資訊，或可以向本項目提供玩法設計創意的資訊資訊，定期輸出分析報告'],
        requirements: ['CS專業，工科背景等相關專業優先',
          '對AI有深刻瞭解並能夠靈活使用AI大模型產品',
          '計算機、數據分析等相關專業優先，具備 AI 應用開發和一定代碼能力',
          '熱愛遊戲，對遊戲有深入研究和獨特見解，具備創新思維',
          '互聯網產品分析、行業分析或商業分析相關專業優先',
           ]
      },

      {
        company: '騰訊集團',
        role: '社會價值項目培訓生',
        duties: ['負責公益項目的相關調研、策劃、實施管理',
          '與內外部合作團隊建立緊密聯系，協調項目團隊各幹系人高效協同工作',
          '綜合項目目標和推進階段及團隊狀態等，持續優化項目流程規範、落地改善機制、推進工具化/自動化建設、開展宣傳外聯工作',
          '及時發現並跟蹤解決項目問題，有效管理項目風險',
          '沉澱項目管理經驗和方法論，賦能組織高效運作，助力目標有效達成'],
        requirements: ['本科或研究生(在讀),社會科學或相關專業優先',
          '對公益與“科技向善”有興趣，有相關經驗更佳',
          '對香港與內地的慈善公益行業有了解，有亞洲或全球的認識與經驗更佳', 
          '願意探索創新，有過整合資源、構建規則流程、搭建新工具等參與創新項目的經驗',
          '責任感強，積極主動，具有快速學習能力',
          '善於耐心且積極的溝通，優秀書面及口頭表達能力，有出色的協調能力和團隊合作精神，能夠與多領域的夥伴聯絡，保持緊密合作關系',
          '中英文流利，會粵語者優先'
           ]
      },

      {
        company: '騰訊集團',
        role: '公共事務項目培訓生',
        duties: ['協助團隊與相關公共事務部門對接、溝通，維護良好的公共溝通管道',
          '研究和分析行業及產業相關政策，對相關政策進行前瞻性研究並為公司業務決策提供意見參考',
          '策劃活動並執行，協助團隊落地公司各類項目',
        ],
        requirements: ['本科及以上學曆，文學、社會科學、傳播等相關專業優先',
          '為人正直，具有較好親和力、良好的人際交往與協調能力、邏輯思維與表達能力',
          '具有優秀的文字撰寫與分析能力，具備良好的團隊合作精神，抗壓能力較強'
           ]
      },
      
            {
        company: '騰訊集團',
        role: '英雄聯盟手游PM',
        duties: ['協助合理規劃項目和相關團隊及合作機制，把控專案進度，風險預警、資源配置，關注合作細節，推動解決問題，並協助項目的複盤和總結',
          '協助優化團隊資源結構，進行需求、人力、成本的分析，負責制定和優化工作流程，運用工具將人工推進事務逐步標準化、流程化、高效化'],
        requirements: ['本科及以上學歷，電腦，管理類專業優先',
          '樂觀開朗、善於溝通、擅長協作、樂於用自己的能量感染他人',
          '對新技術&AI有比較濃厚的興趣，學習能力強，溝通能力強，最好有一些編碼基礎',
          '傾向於電腦，管理類專業，對新技術&AI有比較濃厚的興趣，學習能力強，溝通能力強，最好有一些編碼基礎'
           ]
      },
      
                  {
        company: '騰訊集團',
        role: '遊戲策劃(文案)',
        duties: ['收集資料，考據歷史，為創作尋找靈感和依據',
          '劇情向遊戲劇本創作，能構建有一定深度與新鮮感的世界觀，並能持續完善、拓展已有的世界觀設定',
          '設計有情感張力的故事及角色。完成遊戲相關的文字創作，包括但不限於各模組劇情的構思及撰寫，系統、活動包裝等',
          '將劇本落地實現遊戲內演出效果，不斷打磨運鏡、角色等細節，使其達到上線標準'],
        requirements: ['文學相關專業',
          '具備優秀的文學和故事創作功底，尤其擅長撰寫人物、關卡、勢力等設定',
          '性格開朗，善於發表自己見解，具有良好的溝通能力，邏輯思維和分析能力強，感染力突出，勇於創新，有主見，能積極配合團隊工作',
          '熱愛遊戲，喜歡玩3A敘事向大作',
          '傾向于文學、歷史等專業，從小在香港長大、熟悉香港文化加分'
           ]
      },      
                        {
        company: '騰訊集團',
        role: '2D角色原畫',
        duties: ['負責休閒品類（海外/國內）遊戲專案角色及場景原畫的設計及美宣繪製',
          '負責與遊戲生產線（3D模型，動畫特效）等後續環節的美術設計資產還原展現溝通交流與跟進工作',
          '設計有情感張力的故事及角色。完成遊戲相關的文字創作，包括但不限於各模組劇情的構思及撰寫，系統、活動包裝等'],   
        requirements: ['擅長卡通風格，融合現代審美，具備較強的時尚流行敏感度',
          '美術功底扎實，良好的繪畫技巧，較強的結構，線條，色彩把控力；熟練掌握ps，blender等繪圖工具的使用，熟悉使用AI，高效工作流程',
          '喜歡休閒類型遊戲（棋牌、消除、派對、輕度休閒競技等）優先']
      },
      
                              {
        company: '騰訊集團',
        role: '當地語系化運營',
        duties: ['深入挖掘遊戲相關資料，洞悉玩家的喜好和趨勢，為遊戲的發展提供有力的支援',
          '傾聽玩家聲音，在遊戲社區中與玩家互動交流，洞察與理解玩家、關心玩家',
          '負責用戶運營，策劃有趣、有吸引力的活動，完成商業化運營和活動運營，實現活躍和商業目標。通過合理的商業模式和策略，為玩家提供獨特的價值和體驗，同時為遊戲創造可持續的收入和增長',
          '負責遊戲各類平臺和管道的運營，實現遊戲推廣與合作，將遊戲的魅力傳播給更多的人，讓更多的人體驗到遊戲的快樂'],
        requirements: ['葡語專業，綜合素質扎實，學科成績優秀，熱愛遊戲，關注遊戲行業動態',
          '具有優秀的學習能力、創造力、溝通能力、邏輯思維、系統分析與文字組織能力，能從思考事物規律中獲得樂趣',
          '樂於接受新鮮事物，對於流行文化，創新科技或電子競技等有高關注度',
          '熱愛生活，關注人性']
      },
      
                                    {
        company: '騰訊集團',
        role: '全球展會組 - 活動運營',
        duties: ['深入挖掘遊戲相關資料，洞悉玩家的喜好和趨勢，為遊戲的發展提供有力的支援',
          '傾聽玩家聲音，在遊戲社區中與玩家互動交流，洞察與理解玩家、關心玩家',
          '負責用戶運營，策劃有趣、有吸引力的活動，完成商業化運營和活動運營，實現活躍和商業目標。通過合理的商業模式和策略，為玩家提供獨特的價值和體驗，同時為遊戲創造可持續的收入和增長',
          '負責遊戲各類平臺和管道的運營，實現遊戲推廣與合作，將遊戲的魅力傳播給更多的人，讓更多的人體驗到遊戲的快樂'],   
        requirements: ['專業不限，綜合素質扎實，學科成績優秀，熱愛遊戲，關注遊戲行業動態',
          '具有優秀的學習能力、創造力、溝通能力、邏輯思維、系統分析與文字組織能力，能從思考事物規律中獲得樂趣',
          '樂於接受新鮮事物，對於流行文化，創新科技或電子競技等有高關注度',
          '熱愛生活，關注人性']
      },
      

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
      role: 'UI/UX設計師',
      duties: ['稍候公佈'],
      requirements: ['就讀相應的課程',]
    },

    {
      company: '深圳市微馬視覺智慧科技有限公司',
      role: 'AI算法實習崗位',
      duties: ['稍候公佈'],
      requirements: ['就讀相應的課程',]
    },

    {
      company: '深圳市微馬視覺智慧科技有限公司',
      role: '數據庫實習崗位',
      duties: ['稍候公佈'],
      requirements: ['就讀相應的課程',]
    },

    {
      company: '深圳市微馬視覺智慧科技有限公司',
      role: '市場部實習崗位',
      duties: ['稍候公佈'],
      requirements: ['就讀相應的課程',]
    },

    {
      company: '深圳市微馬視覺智慧科技有限公司',
      role: '嵌入式工程師',
      duties: ['稍候公佈'],
      requirements: ['就讀相應的課程',]
    },

    {
      company: '深圳市微馬視覺智慧科技有限公司',
      role: '數據收集/數據標注',
      duties: ['稍候公佈'],
      requirements: ['就讀相應的課程',]
    },

    {
      company: '深圳市微馬視覺智慧科技有限公司',
      role: 'Web developer',
      duties: ['稍候公佈'],
      requirements: ['就讀相應的課程',]
    },

    {
      company: '深圳市微馬視覺智慧科技有限公司',
      role: 'Frontend engineer',
      duties: ['稍候公佈'],
      requirements: ['就讀相應的課程',]
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
          <Box component="h3">
            {position.company}
          </Box>
        </Box>

        {position.role && (
          <Box sx={{ display: 'flex', alignItems: 'flex-start', ml: 4, mb: 1 }}>
            <WorkIcon sx={{ color: 'text.secondary', mr: 2, mt: 0.5 }} />
            <Box>
              {position.role}
            </Box>
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


