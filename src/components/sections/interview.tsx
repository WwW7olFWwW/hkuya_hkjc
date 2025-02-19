import { Typography, Box, Paper, Stack } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import InfoIcon from '@mui/icons-material/Info';
import { Section } from '@/components/layout/section';
import { PageContainer } from '@/components/layout/page-container';

export function Interview() {
  return (
    <Section id="interview">
      <PageContainer>
        <Box textAlign="center" mb={6}>
          <Typography variant="h3" component="h2" gutterBottom>
            面試安排 Interview Arrangement
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4, md: 5 },
            bgcolor: 'white',
            borderRadius: 2,
            maxWidth: 'md',
            mx: 'auto'
          }}
        >
          <Stack spacing={4}>
            <Stack 
              direction="row" 
              spacing={2} 
              alignItems="flex-start"
              sx={{
                backgroundColor: 'primary.lighter',
                p: 3,
                borderRadius: 2
              }}
            >
              <InfoIcon 
                color="primary" 
                sx={{ 
                  fontSize: 28,
                  flexShrink: 0,
                  mt: 0.5
                }} 
              />
              <Stack spacing={2}>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'primary.darker',
                    lineHeight: 1.6,
                    fontWeight: 500
                  }}
                >
                  本會將根據實習崗位要求而為申請者安排面試（如申請者就讀之學科未能匹配崗位要求，則不獲面試資格）面試詳情將於稍後另行通知。
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'primary.darker',
                    lineHeight: 1.6,
                    opacity: 0.85
                  }}
                >
                  We will arrange interviews for applicants based on the requirements of the internship position (if the subject studied by the applicant does not match the job requirements, the applicant will not be eligible for the interview). Interview details will be provided later.
                </Typography>
              </Stack>
            </Stack>

            <Stack 
              direction="row" 
              spacing={2} 
              alignItems="center"
              sx={{
                backgroundColor: 'primary.lighter',
                p: 3,
                borderRadius: 2
              }}
            >
              <EventIcon 
                color="primary" 
                sx={{ 
                  fontSize: 28,
                  flexShrink: 0
                }} 
              />
              <Typography 
                variant="h6" 
                component="h3" 
                sx={{ 
                  fontWeight: 'medium',
                  color: 'primary.darker'
                }}
              >
                面試日期 Interview Date:
              </Typography>
              <Typography 
                variant="h6" 
                component="h3" 
                sx={{ 
                  fontWeight: 'medium',
                  color: 'primary.darker'
                }}
              >
                8 March 2025
              </Typography>
            </Stack>
          </Stack>
        </Paper>
      </PageContainer>
    </Section>
  );
}
