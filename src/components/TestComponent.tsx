// src/components/TestComponent.tsx
'use client';
import { Button } from '@mui/material';

export function StylePriorityTest() {
  return (
    <div className="flex flex-col gap-4">
      <Button 
        variant="contained" 
        color="primary"
        size="large"
      >
        主要按鈕
      </Button>
      <Button 
        variant="outlined" 
        color="secondary"
        size="large"
      >
        次要按鈕
      </Button>
    </div>
  )
}