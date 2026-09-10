import React from 'react';

interface HokiLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  lightMode?: boolean;
}

export const HokiLogo: React.FC<HokiLogoProps> = ({
  className = '',
  size = 'md',
  showTagline = true,
  lightMode = false,
}) => {
  const heightClasses = {
    sm: 'h-8 sm:h-9',
    md: 'h-11 sm:h-12',
    lg: 'h-14 sm:h-16',
    xl: 'h-18 sm:h-20',
  }[size];

  const navyColor = lightMode ? '#ffffff' : '#192d59';
  const greenColor = '#3eb542';

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <svg
        className={`${heightClasses} w-auto`}
        viewBox="0 0 1080 270"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ========================================================
            1. GREEN GEOMETRIC BEETLE EMBLEM
           ======================================================== */}
        <g id="hoki-beetle-emblem">
          {/* Antennae */}
          <path
            d="M 86 38 L 52 14 L 36 10"
            stroke={greenColor}
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 124 38 L 158 14 L 174 10"
            stroke={greenColor}
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Head (Faceted hexagon) */}
          <path
            d="M 90 34 L 120 34 Q 132 34 130 46 L 122 62 Q 105 78 105 78 Q 105 78 88 62 L 80 46 Q 78 34 90 34 Z"
            fill={greenColor}
          />

          {/* Thorax / Center Tie */}
          <path
            d="M 95 90 L 115 90 Q 120 90 122 95 L 128 116 Q 130 122 125 127 L 108 148 Q 105 152 102 148 L 85 127 Q 80 122 82 116 L 88 95 Q 90 90 95 90 Z"
            fill={greenColor}
          />

          {/* Upper Left Outer Bracket / Shoulder */}
          <path
            d="M 68 58 L 26 82 Q 22 84 22 90 L 22 138 Q 22 144 28 144 Q 34 144 34 138 L 34 94 L 72 72 Q 78 68 76 62 Q 74 56 68 58 Z"
            fill={greenColor}
          />

          {/* Upper Left Inner Diagonal Arm */}
          <path
            d="M 88 64 L 56 82 Q 50 85 54 91 Q 57 96 64 93 L 94 76 Q 100 73 97 67 Q 94 61 88 64 Z"
            fill={greenColor}
          />

          {/* Upper Right Outer Bracket / Shoulder */}
          <path
            d="M 142 58 L 184 82 Q 188 84 188 90 L 188 138 Q 188 144 182 144 Q 176 144 176 138 L 176 94 L 138 72 Q 132 68 134 62 Q 136 56 142 58 Z"
            fill={greenColor}
          />

          {/* Upper Right Inner Diagonal Arm */}
          <path
            d="M 122 64 L 154 82 Q 160 85 156 91 Q 153 96 146 93 L 116 76 Q 110 73 113 67 Q 116 61 122 64 Z"
            fill={greenColor}
          />

          {/* Lower Left Wing with Hollow Polygonal Center */}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M 101 154 L 84 144 Q 80 142 76 144 L 25 166 Q 21 168 21 173 L 21 216 Q 21 221 24 224 L 56 257 Q 59 260 64 257 L 98 232 Q 101 230 101 226 L 101 154 Z M 87 163 L 87 217 L 62 236 L 35 208 L 35 178 L 76 158 Q 78 157 80 158 L 87 163 Z"
            fill={greenColor}
          />

          {/* Lower Right Wing with Hollow Polygonal Center */}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M 109 154 L 126 144 Q 130 142 134 144 L 185 166 Q 189 168 189 173 L 189 216 Q 189 221 186 224 L 154 257 Q 151 260 146 257 L 112 232 Q 109 230 109 226 L 109 154 Z M 123 163 L 123 217 L 148 236 L 175 208 L 175 178 L 134 158 Q 132 157 130 158 L 123 163 Z"
            fill={greenColor}
          />
        </g>

        {/* ========================================================
            2. WORDMARK: "HOKI Structural Fiber"
           ======================================================== */}
        <g id="hoki-brand-name">
          {/* HOKI Primary Vector Geometry */}
          <g id="hoki-letters" fill={navyColor}>
            {/* H */}
            <path d="M 235 68 L 267 68 L 267 112 L 319 112 L 319 68 L 351 68 L 351 184 L 319 184 L 319 139 L 267 139 L 267 184 L 235 184 Z" />

            {/* O (Squircle) */}
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M 390 68 L 463 68 C 489 68 504 82 504 108 L 504 144 C 504 170 489 184 463 184 L 390 184 C 364 184 349 170 349 144 L 349 108 C 349 82 364 68 390 68 Z M 394 95 C 385 95 381 100 381 110 L 381 142 C 381 152 385 157 394 157 L 459 157 C 468 157 472 152 472 142 L 472 110 C 472 100 468 95 459 95 Z"
            />

            {/* K */}
            <path d="M 510 68 L 542 68 L 542 113 L 590 68 L 630 68 L 577 119 L 634 184 L 594 184 L 542 125 L 542 184 L 510 184 Z" />

            {/* I */}
            <path d="M 648 68 L 680 68 L 680 184 L 648 184 Z" />
          </g>

          {/* STRUCTURAL FIBER Descriptor */}
          <text
            x="706"
            y="126"
            fill={greenColor}
            fontFamily="'Montserrat', 'Inter', -apple-system, sans-serif"
            fontSize="38"
            fontWeight="800"
            letterSpacing="0.08em"
          >
            STRUCTURAL
          </text>
          <text
            x="706"
            y="172"
            fill={navyColor}
            fontFamily="'Montserrat', 'Inter', -apple-system, sans-serif"
            fontSize="38"
            fontWeight="800"
            letterSpacing="0.08em"
          >
            FIBER
          </text>
        </g>

        {/* ========================================================
            3. TAGLINE: "— Engineering the Future of Concrete —"
           ======================================================== */}
        {showTagline && (
          <g id="hoki-tagline" fill={navyColor}>
            {/* Left em-dash */}
            <rect x="235" y="224" width="28" height="4.5" rx="2" fill={greenColor} />

            {/* Tagline text */}
            <text
              x="280"
              y="232"
              fontFamily="'Montserrat', 'Inter', -apple-system, sans-serif"
              fontSize="27.5"
              fontWeight="700"
              letterSpacing="0.06em"
            >
              Engineering the Future of Concrete
            </text>

            {/* Right em-dash */}
            <rect x="996" y="224" width="28" height="4.5" rx="2" fill={greenColor} />
          </g>
        )}
      </svg>
    </div>
  );
};
