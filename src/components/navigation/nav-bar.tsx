"use client"

import { useState } from 'react'
import { 
  AppBar, 
  Box, 
  Button, 
  Container, 
  IconButton, 
  Stack,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText 
} from "@mui/material"
import Image from "next/image"
import MenuIcon from "@mui/icons-material/Menu"

const navItems = [
  { 
    title: (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.2 }}>
        <span style={{ fontSize: '1.25em', fontWeight: 500 }}>立即報名</span>
        <span style={{ fontSize: '0.7em', opacity: 0.85 }}>Apply NOW</span>
      </Box>
    ),
    href: "https://forms.gle/QZdgDyGfNyfztPLd6" 
  },
  { 
    title: (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.2 }}>
        <span style={{ fontSize: '1.25em', fontWeight: 500 }}>項目簡介</span>
        <span style={{ fontSize: '0.7em', opacity: 0.85 }}>Project Introduction</span>
      </Box>
    ),
    href: "#project-intro" 
  },
  { 
    title: (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.2 }}>
        <span style={{ fontSize: '1.25em', fontWeight: 500 }}>面試安排</span>
        <span style={{ fontSize: '0.7em', opacity: 0.85 }}>Interview Arrangement</span>
      </Box>
    ),
    href: "#interview" 
  },
  { 
    title: (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.2 }}>
        <span style={{ fontSize: '1.25em', fontWeight: 500 }}>時間表</span>
        <span style={{ fontSize: '0.7em', opacity: 0.85 }}>Timeline</span>
      </Box>
    ),
    href: "#project-timeline" 
  },
  { 
    title: (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.2 }}>
        <span style={{ fontSize: '1.25em', fontWeight: 500 }}>實習崗位</span>
        <span style={{ fontSize: '0.7em', opacity: 0.85 }}>Positions</span>
      </Box>
    ),
    href: "#positions" 
  },
  { 
    title: (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.2 }}>
        <span style={{ fontSize: '1.25em', fontWeight: 500 }}>關於我們</span>
        <span style={{ fontSize: '0.7em', opacity: 0.85 }}>About Us</span>
      </Box>
    ),
    href: "#about" 
  },
  { 
    title: (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.2 }}>
        <span style={{ fontSize: '1.25em', fontWeight: 500 }}>聯絡我們</span>
        <span style={{ fontSize: '0.7em', opacity: 0.85 }}>Contact Us</span>
      </Box>
    ),
    href: "#contactus" 
  }
]

export function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const drawer = (
    <Box 
      onClick={handleDrawerToggle} 
      sx={{ 
        textAlign: 'center',
        pt: 'calc(env(safe-area-inset-top) + 64px)',
        pb: 'env(safe-area-inset-bottom)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundImage: 'linear-gradient(315deg, rgba(3, 33, 105, 0.3) 7%, rgba(0, 126, 78, 0.3) 95%)',
        transition: 'background-color 0.3s ease'
      }}
    >
      <List>
        {navItems.map((item) => (
          <ListItem key={item.href} disablePadding>
            <ListItemButton 
              href={item.href}
              sx={{
                textAlign: 'center',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              <ListItemText 
                primary={item.title} 
                sx={{
                  '& .MuiTypography-root': {
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    lineHeight: 1.2
                  },
                  my: 0.25
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <>
      <AppBar 
        position="fixed" 
        color="transparent" 
        elevation={0}
        sx={{
          //background: 'rgba(0, 0, 0, 0.7)',
          backgroundImage: 'linear-gradient(315deg, rgba(0, 126, 78, 0.3) 7%, rgba(3, 33, 105, 0.3) 95%)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          top: 0,
          paddingTop: 'env(safe-area-inset-top)'
        }}
      >
        <Container 
          maxWidth="lg"
          disableGutters
          sx={{
            px: { xs: 1, sm: 2, md: 3 },
            width: '100%',
            maxWidth: '100%'
          }}
        >
          <Stack 
            direction="row" 
            spacing={2} 
            alignItems="center" 
            justifyContent="space-between"
            sx={{ 
              minHeight: { xs: 56, sm: 64 },
              width: '100%'
            }}
          >
            <Box
              sx={{
                width: { xs: '90px', sm: '110px', md: '130px' },
                height: 'auto'
              }}
            >
              <Image
                src="/images/3x.png"
                alt="Logo"
                width={300}
                height={100}
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain'
                }}
                priority
              />
            </Box>

            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Stack direction="row" spacing={1}>
                {navItems.map((item) => (
                  <Button
                    key={item.href}
                    href={item.href}
                    variant="text"
                    color="inherit"
                    sx={{
                      color: 'white',
                      px: { xs: 1.5, sm: 2 },
                      py: { xs: 1, sm: 1.5 },
                      minHeight: { xs: 52, sm: 64 },
                      minWidth: { xs: 90, sm: 110 },
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    {item.title}
                  </Button>
                ))}
              </Stack>
            </Box>

            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ 
                display: { md: 'none' },
                color: 'white'
              }}
            >
              <MenuIcon />
            </IconButton>
          </Stack>
        </Container>
      </AppBar>

      <Box component="nav">
        <Drawer
          variant="temporary"
          anchor="right"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: 240,
              backgroundColor: 'transparent',
              backdropFilter: 'blur(10px)'
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  )
}
