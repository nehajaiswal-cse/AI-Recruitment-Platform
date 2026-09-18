// import { useEffect, useMemo } from 'react';
// import {
//   Card,
//   CardContent,
//   Typography,
//   Box,
//   Skeleton,
//   useTheme,
// } from '@mui/material';

// import {
//   RadialBarChart,
//   RadialBar,
//   ResponsiveContainer,
//   PolarAngleAxis,
// } from 'recharts';

// import useCandidate from '../../hooks/useCandidate';

// // Bucket definitions against the real Candidate.aiScore field (0-100).
// // NOTE: aiControllers.js is currently an empty stub — nothing in the
// // backend sets aiScore yet, so every candidate will show as
// // "Not analyzed" until a resume-scoring feature populates it. This
// // component is wired correctly for when that exists; it isn't faking
// // numbers in the meantime.
// const BUCKETS = [
//   { key: 'excellent', name: 'Excellent Match', color: '#10b981', min: 85, max: 100 },
//   { key: 'good', name: 'Good Match', color: '#3b82f6', min: 70, max: 84 },
//   { key: 'fair', name: 'Fair Match', color: '#f59e0b', min: 50, max: 69 },
//   { key: 'poor', name: 'Poor Match', color: '#f43f5e', min: 0, max: 49 },
// ];

// export default function AIMatchDistribution() {
//   const theme = useTheme();

//   const { candidates, loading, error, fetchCandidates } = useCandidate();

//   useEffect(() => {
//     fetchCandidates().catch(() => {});
//   }, [fetchCandidates]);

//   const { chartData, legendData, notAnalyzedCount } = useMemo(() => {
//     const scored = candidates.filter(
//       (candidate) =>
//         typeof candidate.aiScore === 'number' &&
//         !Number.isNaN(candidate.aiScore)
//     );

//     const totalScored = scored.length;

//     const counts = BUCKETS.map((bucket) => ({
//       ...bucket,
//       count: scored.filter(
//         (candidate) =>
//           candidate.aiScore >= bucket.min && candidate.aiScore <= bucket.max
//       ).length,
//     }));

//     const withPercentages = counts.map((bucket) => ({
//       name: bucket.name,
//       color: bucket.color,
//       value:
//         totalScored > 0
//           ? Math.round((bucket.count / totalScored) * 100)
//           : 0,
//     }));

//     return {
//       chartData: withPercentages.map((item) => ({
//         name: item.name,
//         value: item.value,
//         fill: item.color,
//       })),
//       legendData: withPercentages,
//       notAnalyzedCount: candidates.length - totalScored,
//     };
//   }, [candidates]);

//   return (
//     <Card
//       sx={{
//         height: '100%',
//         bgcolor: 'background.paper',
//         borderColor: 'divider',
//       }}
//     >
//       <CardContent sx={{ p: 3 }}>
//         {/* Title */}
//         <Typography
//           variant="h6"
//           sx={{
//             mb: 0.5,
//             color: 'text.primary',
//             fontWeight: 600,
//           }}
//         >
//           AI Candidate Matching
//         </Typography>

//         {/* Subtitle */}
//         <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
//           Match quality distribution
//         </Typography>

//         {/* Error state */}
//         {error && (
//           <Typography variant="body2" sx={{ color: 'error.main', mb: 2 }}>
//             {error}
//           </Typography>
//         )}

//         {loading ? (
//           <Skeleton
//             variant="circular"
//             width={180}
//             height={180}
//             sx={{ mx: 'auto' }}
//           />
//         ) : (
//           <>
//             {/* Radial Chart */}
//             <Box
//               sx={{
//                 width: '100%',
//                 height: 200,
//               }}
//             >
//               <ResponsiveContainer>
//                 <RadialBarChart
//                   innerRadius="35%"
//                   outerRadius="100%"
//                   data={chartData}
//                   startAngle={90}
//                   endAngle={-270}
//                 >
//                   <PolarAngleAxis
//                     type="number"
//                     domain={[0, 100]}
//                     tick={false}
//                   />

//                   <RadialBar
//                     background={{
//                       fill:
//                         theme.palette.mode === 'dark'
//                           ? '#314057'
//                           : '#e2e8f0',
//                     }}
//                     dataKey="value"
//                     cornerRadius={8}
//                   />
//                 </RadialBarChart>
//               </ResponsiveContainer>
//             </Box>

//             {/* Legend */}
//             <Box
//               sx={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 gap: 1,
//                 mt: 2,
//               }}
//             >
//               {legendData.map((item) => (
//                 <Box
//                   key={item.name}
//                   sx={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'space-between',
//                   }}
//                 >
//                   {/* Label */}
//                   <Box
//                     sx={{
//                       display: 'flex',
//                       alignItems: 'center',
//                       gap: 1,
//                     }}
//                   >
//                     <Box
//                       sx={{
//                         width: 10,
//                         height: 10,
//                         borderRadius: '50%',
//                         bgcolor: item.color,
//                       }}
//                     />

//                     <Typography variant="body2" color="text.secondary">
//                       {item.name}
//                     </Typography>
//                   </Box>

//                   {/* Percentage */}
//                   <Typography
//                     variant="body2"
//                     sx={{
//                       fontWeight: 600,
//                       color: 'text.primary',
//                     }}
//                   >
//                     {item.value}%
//                   </Typography>
//                 </Box>
//               ))}
//             </Box>

//             {/* Not-analyzed note */}
//             {notAnalyzedCount > 0 && (
//               <Typography
//                 variant="caption"
//                 sx={{
//                   display: 'block',
//                   mt: 2,
//                   color: 'text.secondary',
//                   textAlign: 'center',
//                 }}
//               >
//                 {notAnalyzedCount} candidate
//                 {notAnalyzedCount === 1 ? '' : 's'} not yet AI-analyzed
//               </Typography>
//             )}
//           </>
//         )}
//       </CardContent>
//     </Card>
//   );
// }



import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
} from '@mui/material';

import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
} from 'recharts';

export default function AIMatchDistribution({ data }) {
  const theme = useTheme();

  const chartData = data.map((d) => ({
    name: d.name,
    value: d.value,
    fill: d.color,
  }));

  return (
    <Card
      sx={{
        height: '100%',
        bgcolor: 'background.paper',
        borderColor: 'divider',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Title */}
        <Typography
          variant="h6"
          sx={{
            mb: 0.5,
            color: 'text.primary',
            fontWeight: 600,
          }}
        >
          AI Candidate Matching
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Match quality distribution
        </Typography>

        {/* Radial Chart */}
        <Box
          sx={{
            width: '100%',
            height: 200,
          }}
        >
          <ResponsiveContainer>
            <RadialBarChart
              innerRadius="35%"
              outerRadius="100%"
              data={chartData}
              startAngle={90}
              endAngle={-270}
            >
              <PolarAngleAxis
                type="number"
                domain={[0, 50]}
                tick={false}
              />

              <RadialBar
                background={{
                  fill:
                    theme.palette.mode === 'dark'
                      ? '#314057'
                      : '#e2e8f0',
                }}
                dataKey="value"
                cornerRadius={8}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </Box>

        {/* Legend */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            mt: 2,
          }}
        >
          {data.map((item) => (
            <Box
              key={item.name}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              {/* Label */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    bgcolor: item.color,
                  }}
                />

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {item.name}
                </Typography>
              </Box>

              {/* Percentage */}
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                }}
              >
                {item.value}%
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}




