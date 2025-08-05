// Expandable Text Component
import React, { useState } from 'react';
import { Typography, Button, Box } from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import LinkifiedText from './LinkifiedText';

const ExpandableText = ({
  text,
  maxLength = 150,
  variant = 'body2',
  color = 'text.secondary',
  gutterBottom,
  ...props
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) return null;

  const shouldTruncate = text.length > maxLength;
  const displayText =
    shouldTruncate && !isExpanded ? text.substring(0, maxLength) + '...' : text;

  return (
    <Box {...props}>
      <LinkifiedText
        text={displayText}
        variant={variant}
        color={color}
        component="div"
        gutterBottom={gutterBottom}
      />

      {shouldTruncate && (
        <Button
          size="small"
          onClick={() => setIsExpanded(!isExpanded)}
          startIcon={isExpanded ? <ExpandLess /> : <ExpandMore />}
          sx={{
            mt: 0.5,
            p: 0.5,
            minWidth: 'auto',
            fontSize: '0.75rem',
            textTransform: 'none',
          }}
        >
          {isExpanded ? 'عرض أقل' : 'عرض المزيد'}
        </Button>
      )}
    </Box>
  );
};

export default ExpandableText;
