// Developer Credit Component
import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { Code, Phone } from '@mui/icons-material';

const DeveloperCredit = ({ variant = 'default', showPhone = true }) => {
  if (variant === 'minimal') {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          opacity: 0.8,
          fontSize: '0.75rem',
          p: 1,
          borderRadius: 1,
          bgcolor: 'rgba(0,0,0,0.05)',
        }}
      >
        <Code sx={{ fontSize: 16, color: 'primary.main' }} />
        <Typography variant="caption" sx={{ fontWeight: 'medium' }}>
          👨‍💻 مطور المنصة: كريم عطية عطية
        </Typography>
        {showPhone && (
          <>
            <Phone sx={{ fontSize: 14, color: 'success.main' }} />
            <Typography variant="caption" sx={{ fontWeight: 'medium' }}>
              📞 01095288373
            </Typography>
          </>
        )}
      </Box>
    );
  }

  if (variant === 'chip') {
    return (
      <Chip
        icon={<Code />}
        label="تطوير: كريم عطية عطية"
        variant="outlined"
        size="small"
        sx={{
          opacity: 0.8,
          '& .MuiChip-label': {
            fontSize: '0.75rem',
          },
        }}
      />
    );
  }

  return (
    <Box
      sx={{
        textAlign: 'center',
        p: 2,
        borderRadius: 2,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        opacity: 0.9,
      }}
    >
      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
        تطوير: كريم عطية عطية
      </Typography>
      {showPhone && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          <Phone sx={{ fontSize: 16 }} />
          <Typography variant="body2">01095288373</Typography>
        </Box>
      )}
    </Box>
  );
};

export default DeveloperCredit;
