'use client';

import { Typography, Box, Paper, Grid, Divider } from '@mui/material';
import { Timeline, TimelineItem, TimelineContent, TimelineSeparator, TimelineDot, TimelineConnector } from '@mui/lab';
import { Section } from '@/components/layout/section';
import { PageContainer } from '@/components/layout/page-container';
import { Event, Info, MoneyOff, Hotel, Security, Restaurant, DirectionsBus } from '@mui/icons-material';

interface TimelineEvent {
  date: string;
  content: string[];
  isHighlight?: boolean;
}

const timelineData: TimelineEvent[] = [
  {
    date: 'Early February till 28 February, 2025',
    content: ['宣傳推廣', 'Promotion Period'],
    isHighlight: true
  },
  {
    date: '28 Feb 2025 22:00',
    content: ['報名截止', 'Applications Deadline'],
    isHighlight: true
  },
  {
    date: '8 March 2025',
    content: ['首輪面試', 'Interview'],
    isHighlight: true
  },
  {
    date: '7 June 2025 (T.B.C)',
    content: ['出發前簡介會',  'Information Session'],
    isHighlight: true
  },
  {
    date: '22 June 2025 - 19 July 2025',
    content: [
      '實習',
      '週一至週五：到實習機構上班',
      '週末：大會安排外出考察當地重要發展項目/參觀當地景點'
    ,'Internship',
      'Weekdays: Internship in the designed institutions',
      'Weekends: Visit to the local sites'],
    isHighlight: true
  },
  {
    date: 'End of Aug 2025',
    content: ['總結分享會（按金將於同日退還）',' Sharing Session (Deposits will be refunded on the same day)'],
    isHighlight: true
  }
];

const projectDetails = [
  {
    icon: MoneyOff,
    title: '薪金 salary',
    content: [
      <Typography key="zh" variant="body1">本次實習不提供薪金，項目費用根據實習地點要求</Typography>,
      <Typography key="en" variant="body1">No salary is provided for this internship</Typography>
    ],
  },
  {
    icon: Hotel,
    title: '住宿 Accommodation',
    content: [ 
      <Typography key="zh" variant="body1">入主當地酒店（兩名同性別參加者一房）</Typography>,
      <Typography key="en" variant="body1">Stay in the local hotel (two people of the same gender)</Typography>
    ]
  },
  {
    icon: Security,
    title: '保險 Insurance',
    content: [ 
      <Typography key="zh" variant="body1">主辦方將會為每名參加者購買保險</Typography>,
      <Typography key="en" variant="body1">Insurance will be purchased for each participant</Typography>
    ]
  },
  {
    icon: Restaurant,
    title: '用餐 Meal',
    content: [ 
      <Typography key="zh" variant="body1">主辦方僅提供早餐，其他自理</Typography>,
      <Typography key="en" variant="body1">Only breakfast is provided, other expenses are at own expenses</Typography>
    ]
  },
  {
    icon: DirectionsBus,
    title: '交通 Transportation',
    content: [ 
      <Typography key="zh" variant="body1">主辦方將不會提供當地交通（週末活動則由大會機構安排）</Typography>,
      <Typography key="en" variant="body1">No local transportation to and from the internship location
(Official weekend activities will be arranged and covered)</Typography>
    ]
  }
];

export function ProjectTimeline() {
  return (
    <Section id="project-timeline">
      <PageContainer>
        <Box textAlign="center" mb={6}>
          <Typography variant="h3" component="h2" gutterBottom>
            時間表 Timeline
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: { xs: 2, md: 4 }, 
                borderRadius: 2,
                height: '100%'
              }}
            >
              <Timeline 
                position="left"
                sx={{
                  [`& .MuiTimelineItem-root`]: {
                    minHeight: { xs: 80, sm: 100 },
                    '&:before': {
                      // 這會移除左側的空間
                      display: 'none'
                    }
                  },
                  p: 0
                }}
              >
                {timelineData.map((event, index) => (
                  <TimelineItem key={index}>
                    <TimelineSeparator>
                      <TimelineDot 
                        color={event.isHighlight ? 'primary' : 'grey'}
                        variant={event.isHighlight ? 'filled' : 'outlined'}
                        sx={{
                          boxShadow: event.isHighlight ? 2 : 0,
                          '& .MuiSvgIcon-root': {
                            fontSize: event.isHighlight ? 24 : 20
                          }
                        }}
                      >
                        <Event />
                      </TimelineDot>
                      {index < timelineData.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent
                      sx={{
                        py: { xs: 1, sm: 2 },
                        px: { xs: 2, sm: 3 },
                        pb: { xs: 3, sm: 4 }
                      }}
                    >
                      <Paper 
                        elevation={event.isHighlight ? 2 : 0} 
                        sx={{
                          p: { xs: 1.5, sm: 2 },
                          bgcolor: event.isHighlight ? 'primary.50' : 'transparent',
                          borderRadius: 1.5
                        }}
                      >
                        <Typography 
                          variant="h6" 
                          component="h3" 
                          color="text.primary"
                          gutterBottom
                          sx={{
                            fontWeight: event.isHighlight ? 600 : 500,
                            fontSize: { xs: '0.92rem', md: '1.1rem' },  // 調小字型
                            whiteSpace: 'normal',  // 允許自然換行
                            lineHeight: 1.3,       // 緊湊行距
                            wordBreak: 'keep-all'  // 保持中文不換行
                          }}
                        >
                          {event.date}
                        </Typography>
                        {event.content.map((text, i) => (
                          <Typography
                            key={i}
                            variant="body1"
                            sx={{
                              mb: 1,
                              color: 'text.primary',
                              lineHeight: 1.8,
                              fontSize: { xs: '0.875rem', md: '1rem' }
                            }}
                          >
                            {text}
                          </Typography>
                        ))}
                      </Paper>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: { xs: 2, md: 4 }, 
                borderRadius: 2,
                height: '100%',
                bgcolor: 'grey.50'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Info color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="h3">
                  備註 Note
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              {projectDetails.map((detail, index) => (
                <Box key={index} sx={{ mb: 3, display: 'flex', alignItems: 'flex-start' }}>
                  <detail.icon sx={{ 
                    mr: 2, 
                    color: 'primary.main',
                    fontSize: '2rem'
                  }} />
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        mb: 0.5
                      }}
                    >
                      {detail.title}
                    </Typography>
                    {detail.content.map((text, i) => (
                      <Typography
                        key={i}
                        variant="body1"
                        sx={{
                          color: 'text.primary',
                          lineHeight: 1.8,
                          fontSize: { xs: '0.875rem', md: '1rem' }
                        }}
                      >
                        {text}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </PageContainer>
    </Section>
  );
}
