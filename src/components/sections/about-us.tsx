import { Box, Paper, Typography, Chip, Grid } from '@mui/material'
import Image from 'next/image'
import { Section } from '@/components/layout/section'
import { PageContainer } from '@/components/layout/page-container'

const styles = {
  section: {
    textAlign: 'center' as const,
    mb: 6
  },
  imageContainer: {
    maxWidth: { xs: '180px', sm: '250px', md: '300px' },
    width: '100%',
    height: { xs: '72px', sm: '120px' },
    position: 'relative' as const
  },
  paper: {
    p: { xs: 2, sm: 3 },
    height: '100%',
    minHeight: '200px',
    bgcolor: 'white',
    borderRadius: 2,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  chip: {
    bgcolor: 'primary.lighter',
    color: 'primary.main',
    fontSize: { xs: '0.75rem', sm: '0.875rem' },
    height: { xs: '24px', sm: '32px' },
    mb: { xs: 1, sm: 2 }
  },
  orgName: {
    fontWeight: 'bold',
    color: 'primary.main',
    fontSize: { xs: '1rem', sm: '1.25rem' },
    mt: 2
  }
} as const

interface Organization {
  readonly name: string
  readonly logo?: string
  readonly url?: string
  readonly role: string
}

const organizations: readonly Organization[] = [
  {
    name: "",
    logo: "/images/logo.png",
    url: "https://www.hkuya.org.hk/",
    role: "承辦單位 Organizer"
  },
  {
    name: "",
    logo: "/images/hkjc_140_bi_tc_logo_cmyk_coated_full_colour_ol.png",
    url: "https://www.hkjc.com/",
    role: "贊助單位 Sponsor"
  },
  {
    name: "中央政府駐港聯絡辦青年工作部",
    role: "支持單位 Support Unit"
  }
] as const

function OrganizationCard({ org }: { org: Organization }) {
  return (
    <Paper elevation={3} sx={styles.paper}>
      <Chip
        label={org.role}
        size="small"
        sx={styles.chip}
      />
      
      {org.logo ? (
        <Box sx={styles.imageContainer}>
          {org.url ? (
            <a
              href={org.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'block', width: '100%', height: '100%' }}
            >
              <Image
                src={org.logo}
                alt={org.name}
                fill
                sizes="(max-width: 600px) 180px, (max-width: 960px) 250px, 300px"
                style={{ objectFit: 'contain' }}
                priority
              />
            </a>
          ) : (
            <Image
              src={org.logo}
              alt={org.name}
              fill
              sizes="(max-width: 600px) 180px, (max-width: 960px) 250px, 300px"
              style={{ objectFit: 'contain' }}
              priority
            />
          )}
        </Box>
      ) : (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          height: '100%',
          flex: 1
        }}>
          <Typography 
            variant="h3" 
            align="center" 
            sx={{
              color: '#CC0000',
              fontWeight: 'bold',
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
              lineHeight: 1.2,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1
            }}
          >
            {org.name === '中央政府駐港聯絡辦青年工作部' ? (
              <>
                <span>中央政府駐港聯絡辦</span>
                <span>青年工作部</span>
              </>
            ) : org.name}
          </Typography>
        </Box>
      )}
      
      {org.logo && (
        <Typography variant="subtitle1" sx={styles.orgName}>
          {org.name}
        </Typography>
      )}
    </Paper>
  )
}

export function AboutUs() {
  return (
    <Section id="about">
      <PageContainer>
        <Box sx={styles.section}>
          <Typography variant="h3" component="h2" gutterBottom>
            關於我們 About us
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 2, sm: 3 }} justifyContent="center">
          {organizations.map((org) => (
            <Grid item xs={12} sm={6} md={4} key={org.name}>
              <OrganizationCard org={org} />
            </Grid>
          ))}
        </Grid>
      </PageContainer>
    </Section>
  )
}
