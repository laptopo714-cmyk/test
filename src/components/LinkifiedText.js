// Linkified Text Component - تحويل الروابط في النص إلى روابط قابلة للنقر
import React from 'react';
import { Typography, Link } from '@mui/material';
import { OpenInNew } from '@mui/icons-material';

const LinkifiedText = ({
  text,
  variant = 'body1',
  color = 'text.primary',
  component = 'div',
  ...props
}) => {
  if (!text) return null;

  // تعبير منتظم لاكتشاف الروابط
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  // تقسيم النص إلى أجزاء (نص عادي وروابط)
  const parts = text.split(urlRegex);

  return (
    <Typography
      variant={variant}
      color={color}
      component={component}
      {...props}
    >
      {parts.map((part, index) => {
        // إذا كان الجزء رابط
        if (urlRegex.test(part)) {
          return (
            <Link
              key={index}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                textDecoration: 'underline',
                color: 'primary.main',
                '&:hover': {
                  textDecoration: 'none',
                  backgroundColor: 'primary.light',
                  color: 'primary.contrastText',
                  borderRadius: 1,
                  px: 0.5,
                  py: 0.25,
                },
                transition: 'all 0.2s ease',
                wordBreak: 'break-all',
              }}
            >
              {part.length > 50 ? `${part.substring(0, 50)}...` : part}
              <OpenInNew sx={{ fontSize: 14 }} />
            </Link>
          );
        }

        // إذا كان نص عادي، تحويل أسطر جديدة إلى <br>
        return part.split('\n').map((line, lineIndex, lines) => (
          <React.Fragment key={`${index}-${lineIndex}`}>
            {line}
            {lineIndex < lines.length - 1 && <br />}
          </React.Fragment>
        ));
      })}
    </Typography>
  );
};

export default LinkifiedText;
