'use client';

import React from 'react';
import { Box, Grid, Typography, Link, Stack, Divider } from '@mui/material';
import { Facebook, Instagram } from '@mui/icons-material';
import { PageContainer } from '@/components/layout/page-container';

const socialLinks = [
  { icon: Facebook, href: 'https://www.facebook.com/hongkonguya/', label: 'Facebook' },
  { icon: Instagram, href: 'https://www.instagram.com/hkuya_ig/', label: 'Instagram' },
];

const quickLinks = [
  { text: '立即報名', href: 'https://forms.gle/QZdgDyGfNyfztPLd6' },
  { text: '項目簡介', href: '#project-intro' },
  { text: '面試安排', href: '#interview' },
  { text: '時間表', href: '#project-timeline' },
  { text: '實習崗位', href: '#positions' },
  { text: '關於我們', href: '#about' },
  { text: '聯絡我們', href: '#contact' }
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        backgroundImage: 'linear-gradient(315deg, rgba(3, 33, 105, 0.5) 0%, rgba(0, 126, 78, 0.5) 100%)',
        backdropFilter: 'blur(8px)',
        color: 'grey.300',
        mt: 'auto'
      }}
    >
      <PageContainer>
        <Box sx={{ py: 6 }}>
          <Grid container spacing={4} justifyContent="center">
          
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="white" gutterBottom align="center">
              快速連結
            </Typography>
            <Stack spacing={1} alignItems="center">
              {quickLinks.map((link) => (
                <Link
                  key={link.text}
                  href={link.href}
                  color="inherit"
                  sx={{
                    textDecoration: 'none',
                    '&:hover': {
                      color: 'primary.main'
                    }
                  }}
                >
                  {link.text}
                </Link>
              ))}
            </Stack>
          </Grid>
          
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="white" gutterBottom align="center">
              聯絡資訊
            </Typography>
            <Typography variant="body2" paragraph align="center">
              地址：香港柴灣道238號青年廣場807-808室
            </Typography>
            <Typography variant="body2" paragraph align="center">
              電話：(852) 25989385
            </Typography>
            <Typography variant="body2" align="center">
              電郵：mail@hkuya.org.hk
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mt: 2 }} justifyContent="center">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    color="inherit"
                    sx={{
                      '&:hover': {
                        color: 'primary.main'
                      }
                    }}
                    aria-label={social.label}
                  >
                    <Icon />
                  </Link>
                );
              })}
            </Stack>
          </Grid>
        </Grid>
        
          <Divider sx={{ my: 4, borderColor: 'grey.800' }} />
          
          <Typography variant="body2" align="center" color="grey.500">
            © {currentYear} Hong Kong United Youth Association All rights reserved.
          </Typography>
        </Box>
      </PageContainer>
    </Box>
  );
}
