import { Box, BoxProps } from '@mui/material'

interface SectionProps extends BoxProps {
  children: React.ReactNode
  isDark?: boolean
}

export function Section({ children, isDark = false, ...props }: SectionProps) {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 6, sm: 8, md: 10 },
        bgcolor: isDark ? 'grey.900' : 'background.default',
        color: isDark ? 'common.white' : 'text.primary',
        ...props.sx
      }}
      {...props}
    >
      {children}
    </Box>
  )
}
