import { Container, ContainerProps } from '@mui/material'

interface PageContainerProps extends ContainerProps {
  children: React.ReactNode
}

export function PageContainer({ children, ...props }: PageContainerProps) {
  return (
    <Container
      maxWidth="lg"
      sx={{
        py: { xs: 4, sm: 6, md: 8 },
        ...props.sx
      }}
      {...props}
    >
      {children}
    </Container>
  )
}
