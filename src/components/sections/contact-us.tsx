import { Typography, Box, Paper, Link, Stack } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import { Section } from '@/components/layout/section';
import { PageContainer } from '@/components/layout/page-container';

export function ContactUs() {
  return (
    <Section id="contactus">
      <PageContainer>
        <Box textAlign="center" mb={6}>
          <Typography variant="h3" component="h2" gutterBottom>
            聯絡我們 Contact us
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
          <Stack spacing={3}>
            <Stack 
              direction="row" 
              spacing={2} 
              alignItems="center"
            >
              <EmailIcon color="primary" />
              <Typography variant="body1">
                Email:
                <Link 
                  href="mailto:mail@hkuya.org.hk"
                  color="primary"
                  sx={{ 
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  mail@hkuya.org.hk
                </Link>
              </Typography>
            </Stack>

            <Stack 
              direction="row" 
              spacing={2} 
              alignItems="center"
            >
              <PhoneIcon color="primary" />
              <Typography variant="body1">
                Tel: 2598 9385
              </Typography>
            </Stack>
          </Stack>
        </Paper>
      </PageContainer>
    </Section>
  );
}
