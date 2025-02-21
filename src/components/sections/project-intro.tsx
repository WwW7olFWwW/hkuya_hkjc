'use client';

import { Typography, Box, Paper, Grid, Divider, Modal, IconButton } from '@mui/material';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { Section } from '@/components/layout/section';
import { PageContainer } from '@/components/layout/page-container';
import { CalendarMonth, LocationOn, Groups, Person } from '@mui/icons-material';

import { SvgIconComponent } from '@mui/icons-material';

const InfoItem = ({ icon: Icon, title, content }: { icon: SvgIconComponent, title: string, content: string | React.ReactNode }) => {
  const [chineseTitle, englishTitle] = (typeof title === 'string' ? title.split(' / ') : ['', '']);
  const contentNode = typeof content === 'string' 
    ? content.split(' / ').map((text, index) => (
        <Typography 
          key={index} 
          variant="body1" 
          sx={{ 
            flex: 1,
            textAlign: index === 0 ? 'left' : 'right',
            color: index === 1 ? 'text.secondary' : 'text.primary'
          }}
        >
          {text}
        </Typography>
      ))
    : content;

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
      <Icon sx={{ color: 'primary.main', mr: 2, mt: 0.5 }} />
      <Box sx={{ flex: 1 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            mb: 1,
            gap: 2
          }}
        >
          <Typography 
            variant="subtitle2" 
            color="text.primary"
            sx={{ fontWeight: 600 }}
          >
            {chineseTitle}
          </Typography>
          <Typography 
            variant="subtitle2" 
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            {englishTitle}
          </Typography>
        </Box>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          gap: 2,
          alignItems: 'flex-start'
        }}>
          {contentNode}
        </Box>
      </Box>
    </Box>
  );
};

export function ProjectIntro() {
  const [open, setOpen] = useState(false);
  return (
    <Section id="project-intro">
      <PageContainer maxWidth="lg" disableGutters sx={{ px: { xs: 2, sm: 3 } }}>
        <Box textAlign="center" mb={{ xs: 4, sm: 6, md: 8 }}>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{
              fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' },
              fontWeight: 700,
              lineHeight: 1.3
            }}
          >
            &ldquo;實踐科創·探知歷史&rdquo;2024-2025
          </Typography>
          <Typography 
            variant="h4" 
            color="primary" 
            gutterBottom
            sx={{
              fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' },
              fontWeight: 500
            }}
          >
            暑期實習團
          </Typography>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{
              fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' },
              fontWeight: 700,
              lineHeight: 1.3
            }}
          >
            &ldquo;Reimagining History, Innovating Tomorrow&rdquo; 
          </Typography>

          <Typography 
            variant="h4" 
            color="primary" 
            gutterBottom
            sx={{
              fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' },
              fontWeight: 500
            }}
          >
            Summer Internship Program 2024-2025
          </Typography>
        </Box>

        <Box maxWidth="lg" mx="auto">
          <Paper 
            elevation={2} 
            sx={{ 
              p: { xs: 2, sm: 3, md: 4 }, 
              mb: { xs: 4, sm: 5, md: 6 }, 
              borderRadius: 2 
            }}
          >
            <Grid container spacing={4} sx={{ mb: 4 }}>
              <Grid item xs={12} md={4}>
                <Box sx={{ position: 'relative' }}>
                  <Box
                    component="img"
                    src="/images/poster.webp"
                    alt="實習計劃海報"
                    onClick={() => setOpen(true)}
                    sx={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: 2,
                      boxShadow: 3,
                      mb: { xs: 2, md: 0 },
                      cursor: 'pointer',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.02)'
                      }
                    }}
                  />
                  <IconButton
                    onClick={() => setOpen(true)}
                    sx={{
                      position: 'absolute',
                      right: 8,
                      bottom: 8,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 1)'
                      }
                    }}
                  >
                    <ZoomInIcon />
                  </IconButton>
                </Box>
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography 
                  variant="body1" 
                  paragraph 
                  sx={{ 
                    lineHeight: 1.8,
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    textAlign: 'justify',
                    letterSpacing: '0.01em'
                  }}
                >
                  &ldquo;實踐科創·探知歷史&rdquo;暑期實習計劃旨在透過實習認識創科行業，體驗不同企業的文化背景及創新科技業界的工作，同時，讓實習生在工作中學習相關的專業知識，培養他們日後投身不同領域事業的興趣。參與者將有機會在北京和大灣區（廣州、深圳）的知名企業和機構進行實習，拓展視野，增強專業能力。計劃不僅鼓勵來自不同學校的青年學子互相交流與合作，還設有一系列的增值活動，包括企業參訪、文化名勝考察以及與業界領袖及大學生的交流對話。這些活動將為參與者提供全方位的學習體驗，助力他們在職業發展上邁出堅實步伐。
                </Typography>
                <Typography 
                  variant="body1" 
                  paragraph 
                  sx={{ 
                    lineHeight: 1.8,
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    textAlign: 'justify',
                    letterSpacing: '0.01em'
                  }}
                >
                  &ldquo;Reimagining History, Innovating Tomorrow&rdquo; Summer Internship Program 2025 aims to introduce participants to the innovation and technology industry through internships, allowing them to experience the cultural backgrounds of different companies and work in the innovative tech sector. At the same time, the program provides interns with the opportunity to acquire relevant professional knowledge and develop an interest in pursuing careers in various fields. Participants will have the chance to intern at renowned companies and organizations in Beijing and the Greater Bay Area (Guangzhou, Shenzhen), expanding their horizons and enhancing their professional capabilities. The program encourages young people from different schools to communicate and collaborate and includes a series of value-added activities, such as company visits, cultural heritage tours, and exchanges with industry leaders and university students. These activities will offer participants a comprehensive learning experience, helping them take solid steps in their career development.
                </Typography>
              </Grid>
            </Grid>

            <Grid container spacing={4} mt={4}>
              <Grid item xs={12} md={6}>
                <InfoItem
                  icon={CalendarMonth}
                  title="實習日期 / Internship Period"
                  content="2025年6月22日至7月19日 / June 22 - July 19, 2025"
                />
                <InfoItem
                  icon={LocationOn}
                  title="實習地點 / Location"
                  content="北京及大灣區（廣州和深圳） / Beijing and Greater Bay Area (Guangzhou, Shenzhen)"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoItem
                  icon={Groups}
                  title="實習崗位範疇 / Positions"
                  content="科創產業 / Science, Innovation and Technology Industry"
                />
                <InfoItem
                  icon={Person}
                  title="名額 / Quota"
                  content="40名 / 40 participants"
                />
              </Grid>
            </Grid>
          </Paper>

          <Paper elevation={2} sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 2 }}>
            <Box sx={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: 3, sm: 4 }
            }}>
              {/* 參加資格部分 */}
              <Box>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  color="primary"
                  sx={{ mb: 2 }}
                >
                  參加資格 / Eligibility
                </Typography>
                <Paper elevation={0} sx={{ p: 2, mb: 3 }}>
                  <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                    a. 18 歲以上的各大院校之全日制學生或應屆畢業生
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                    b. （i）持有有效香港永久居民身份證 或（ii）持有有效香港居民身份證並在香港就讀全日制課程
                  </Typography>                  
                  <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                    a. Full-time students or recent graduates from various universities who are 18 years of age or older; and
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                    b. (i) Hold a valid Hong Kong Permanent Resident Identity Card, or　(ii) Hold a valid Hong Kong Resident Identity Card and are enrolled in a full-time program in Hong Kong.
                  </Typography>
                </Paper>
              </Box>

              <Divider sx={{ my: { xs: 1, sm: 2 } }} />

              {/* 費用部分 */}
              <Box>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  color="primary"
                  sx={{ mb: 2 }}
                >
                  費用 / Fee
                </Typography>
                <Paper elevation={0} sx={{ p: 2, mb: 3 }}>
                  <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                    團費：全免（包括來回交通、住宿、保險、交流活動等費用）
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                    按金：港幣2,500元正（順利完成整個實習計劃後全數退還，包括完成實習工作、實習報告及本會預先指定的學習任務）
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                    Fee: Free of Charge (covering accommodation, round-trip transportation, insurance, and breakfast)
                  </Typography>                 
                  <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                    Deposits: HKD2,500 (fully refundable upon completion of the exchange and submission of a report and designated tasks)
                  </Typography>
                </Paper>
              </Box>
            </Box>
          </Paper>
        </Box>
      </PageContainer>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="poster-modal"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
          overflow: 'auto'
        }}
      >
        <Box 
          sx={{ 
            position: 'relative',
            margin: 'auto',
            bgcolor: 'background.paper',
            borderRadius: 2,
            p: 1,
            maxWidth: '95%',
            maxHeight: '95%',
            overflow: 'auto',
            '&:focus': {
              outline: 'none'
            }
          }}
        >
          <IconButton
            onClick={() => setOpen(false)}
            sx={{
              position: 'fixed',
              right: 16,
              top: 16,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              zIndex: 1,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 1)'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
          <Box
            component="img"
            src="/images/poster.webp"
            alt="實習計劃海報"
            sx={{
              display: 'block',
              maxWidth: '100%',
              height: 'auto',
              borderRadius: 2
            }}
          />
        </Box>
      </Modal>
    </Section>
  );
}