// import { useState } from 'react';
// import {
//   Card,
//   CardContent,
//   Typography,
//   Box,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Chip,
//   IconButton,
//   Menu,
//   MenuItem,
//   ListItemIcon,
//   ListItemText,
//   Avatar,
//   useMediaQuery,
//   useTheme,
//   Stack,
//   Divider,
// } from '@mui/material';

// import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
// import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
// import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
// import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';


// // ============================================================
// // LOCAL MOCK DATA
// // ============================================================
// // You can remove/replace this later.
// //
// // For real data:
// //
// // <RecentApplications applications={applications} />
// //
// // The component does NOT care whether the data comes from:
// // - Supabase
// // - REST API
// // - Node/Express
// // - Firebase
// // - Local state
// // - React Query
// // ============================================================

// const mockApplications = [
//   {
//     id: '1',
//     company: 'ABC Tech',
//     position: 'React Developer',
//     status: 'interview',
//     applied_date: '2026-08-15',
//     logo_color: '#6366f1',
//   },
//   {
//     id: '2',
//     company: 'XYZ Ltd',
//     position: 'Frontend Dev',
//     status: 'shortlisted',
//     applied_date: '2026-08-12',
//     logo_color: '#ec4899',
//   },
//   {
//     id: '3',
//     company: 'PQR Corp',
//     position: 'UI Developer',
//     status: 'applied',
//     applied_date: '2026-08-10',
//     logo_color: '#f59e0b',
//   },
//   {
//     id: '4',
//     company: 'TechNova',
//     position: 'Senior Frontend Engineer',
//     status: 'applied',
//     applied_date: '2026-08-08',
//     logo_color: '#10b981',
//   },
//   {
//     id: '5',
//     company: 'DataSys',
//     position: 'Full Stack Developer',
//     status: 'rejected',
//     applied_date: '2026-08-05',
//     logo_color: '#8b5cf6',
//   },
//   {
//     id: '6',
//     company: 'CloudPeak',
//     position: 'Frontend Architect',
//     status: 'shortlisted',
//     applied_date: '2026-08-03',
//     logo_color: '#3b82f6',
//   },
//   {
//     id: '7',
//     company: 'ByteWorks',
//     position: 'React Native Developer',
//     status: 'applied',
//     applied_date: '2026-08-01',
//     logo_color: '#ef4444',
//   },
//   {
//     id: '8',
//     company: 'NovaSoft',
//     position: 'Software Engineer',
//     status: 'interview',
//     applied_date: '2026-07-29',
//     logo_color: '#14b8a6',
//   },
// ];


// // ============================================================
// // STATUS CONFIGURATION
// // ============================================================

// const statusConfig = {
//   applied: {
//     label: 'Applied',
//     color: '#2563eb',
//     background: 'rgba(37, 99, 235, 0.12)',
//   },

//   shortlisted: {
//     label: 'Shortlisted',
//     color: '#db2777',
//     background: 'rgba(219, 39, 119, 0.12)',
//   },

//   interview: {
//     label: 'Interview',
//     color: '#d97706',
//     background: 'rgba(245, 158, 11, 0.16)',
//   },

//   rejected: {
//     label: 'Rejected',
//     color: '#dc2626',
//     background: 'rgba(220, 38, 38, 0.12)',
//   },
// };


// // Order used inside Change Status menu
// const statusOrder = [
//   'applied',
//   'shortlisted',
//   'interview',
//   'rejected',
// ];


// // ============================================================
// // HELPERS
// // ============================================================

// const getInitials = (company = '') => {
//   return company
//     .trim()
//     .split(/\s+/)
//     .map((word) => word[0])
//     .join('')
//     .slice(0, 2)
//     .toUpperCase();
// };


// const formatDate = (date) => {
//   if (!date) return '-';

//   const parsedDate = new Date(date);

//   if (Number.isNaN(parsedDate.getTime())) {
//     return '-';
//   }

//   return parsedDate.toLocaleDateString('en-US', {
//     month: 'short',
//     day: 'numeric',
//   });
// };


// // ============================================================
// // MAIN COMPONENT
// // ============================================================

// export default function RecentApplications({
//   applications = mockApplications,

//   // These are optional for now.
//   // Later your real parent component can provide them.
//   onEdit = () => {},
//   onDelete = () => {},
//   onStatusChange = () => {},
// }) {
//   const theme = useTheme();

//   const isMobile = useMediaQuery(theme.breakpoints.down('md'));
//   const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedApp, setSelectedApp] = useState(null);


//   // ----------------------------------------------------------
//   // MENU
//   // ----------------------------------------------------------

//   const handleMenuOpen = (event, app) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedApp(app);
//   };


//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setSelectedApp(null);
//   };


//   // ----------------------------------------------------------
//   // SORT APPLICATIONS
//   // ----------------------------------------------------------

//   const sortedApplications = [...applications].sort(
//     (a, b) =>
//       new Date(b.applied_date).getTime() -
//       new Date(a.applied_date).getTime()
//   );


//   // Desktop = 8
//   // Tablet = 6
//   const displayApplications = isTablet
//     ? sortedApplications.slice(0, 6)
//     : sortedApplications.slice(0, 8);


//   // ==========================================================
//   // MOBILE VIEW
//   // ==========================================================

//   if (isMobile) {
//     return (
//       <Card
//         sx={{
//           borderRadius: 3,
//           border: `1px solid ${theme.palette.divider}`,
//           backgroundColor: theme.palette.background.paper,
//           boxShadow: 'none',
//           m:3
//         }}
//       >
//         <CardContent
//           sx={{
//             p: 2.5,
//             pb: 2,
//           }}
//         >
//           {/* Header */}
//           <Box
//             sx={{
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'space-between',
//               gap: 1,
//               mb: 2,
//             }}
//           >
//             <Box
//               sx={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: 1,
//               }}
//             >
//               <DescriptionOutlinedIcon
//                 sx={{
//                   color: 'primary.main',
//                   fontSize: 21,
//                 }}
//               />

//               <Typography
//                 variant="h6"
//                 sx={{
//                   fontWeight: 700,
//                   color: 'text.primary',
//                 }}
//               >
//                 Recent Applications
//               </Typography>
//             </Box>

//             <Typography
//               variant="body2"
//               sx={{
//                 color: 'text.secondary',
//               }}
//             >
//               {applications.length}
//             </Typography>
//           </Box>


//           {/* Empty state */}
//           {displayApplications.length === 0 && (
//             <EmptyState />
//           )}


//           {/* Applications */}
//           <Stack spacing={1.5}>
//             {displayApplications.map((app) => (
//               <MobileApplicationRow
//                 key={app.id}
//                 app={app}
//                 onMenuOpen={handleMenuOpen}
//               />
//             ))}
//           </Stack>


//           {/* Action menu */}
//           <ActionMenu
//             anchorEl={anchorEl}
//             selectedApp={selectedApp}
//             onClose={handleMenuClose}
//             onEdit={onEdit}
//             onDelete={onDelete}
//             onStatusChange={onStatusChange}
//           />
//         </CardContent>
//       </Card>
//     );
//   }


//   // ==========================================================
//   // DESKTOP / TABLET VIEW
//   // ==========================================================

//   return (
//     <Card
//       sx={{
//         borderRadius: 3,
//         border: `1px solid ${theme.palette.divider}`,
//         backgroundColor: theme.palette.background.paper,
//         boxShadow: 'none',
//         overflow: 'hidden',
//       }}
//     >
//       <CardContent
//         sx={{
//           p: 2.5,
//           pb: 0,
//         }}
//       >

//         {/* Header */}
//         <Box
//           sx={{
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//             mb: 1,
//           }}
//         >
//           <Box
//             sx={{
//               display: 'flex',
//               alignItems: 'center',
//               gap: 1,
//             }}
//           >
//             <DescriptionOutlinedIcon
//               sx={{
//                 color: 'primary.main',
//                 fontSize: 21,
//               }}
//             />

//             <Typography
//               variant="h6"
//               sx={{
//                 fontWeight: 700,
//                 color: 'text.primary',
//               }}
//             >
//               Recent Applications
//             </Typography>
//           </Box>


//           <Typography
//             variant="body2"
//             sx={{
//               color: 'text.secondary',
//             }}
//           >
//             {applications.length} total
//           </Typography>
//         </Box>


//         {/* Empty state */}
//         {displayApplications.length === 0 ? (
//           <EmptyState />
//         ) : (
//           <TableContainer>
//             <Table
//               size="medium"
//               sx={{
//                 minWidth: 650,
//               }}
//             >

//               {/* Header */}
//               <TableHead>
//                 <TableRow>
//                   <TableCell
//                     sx={{
//                       color: 'text.secondary',
//                       fontWeight: 600,
//                       fontSize: '0.8rem',
//                       textTransform: 'uppercase',
//                       letterSpacing: '0.04em',
//                       borderBottom: `1px solid ${theme.palette.divider}`,
//                     }}
//                   >
//                     Company
//                   </TableCell>

//                   <TableCell
//                     sx={{
//                       color: 'text.secondary',
//                       fontWeight: 600,
//                       fontSize: '0.8rem',
//                       textTransform: 'uppercase',
//                       letterSpacing: '0.04em',
//                       borderBottom: `1px solid ${theme.palette.divider}`,
//                     }}
//                   >
//                     Position
//                   </TableCell>

//                   <TableCell
//                     sx={{
//                       color: 'text.secondary',
//                       fontWeight: 600,
//                       fontSize: '0.8rem',
//                       textTransform: 'uppercase',
//                       letterSpacing: '0.04em',
//                       borderBottom: `1px solid ${theme.palette.divider}`,
//                     }}
//                   >
//                     Status
//                   </TableCell>

//                   <TableCell
//                     align="right"
//                     sx={{
//                       color: 'text.secondary',
//                       fontWeight: 600,
//                       fontSize: '0.8rem',
//                       textTransform: 'uppercase',
//                       letterSpacing: '0.04em',
//                       borderBottom: `1px solid ${theme.palette.divider}`,
//                     }}
//                   >
//                     Date
//                   </TableCell>

//                   <TableCell
//                     align="right"
//                     sx={{
//                       color: 'text.secondary',
//                       fontWeight: 600,
//                       fontSize: '0.8rem',
//                       textTransform: 'uppercase',
//                       letterSpacing: '0.04em',
//                       borderBottom: `1px solid ${theme.palette.divider}`,
//                     }}
//                   >
//                     Actions
//                   </TableCell>
//                 </TableRow>
//               </TableHead>


//               {/* Body */}
//               <TableBody>
//                 {displayApplications.map((app) => (
//                   <TableRow
//                     key={app.id}
//                     sx={{
//                       transition: 'background-color 0.15s',

//                       '&:hover': {
//                         backgroundColor:
//                           theme.palette.mode === 'dark'
//                             ? 'rgba(255,255,255,0.03)'
//                             : '#f8fafc',
//                       },

//                       '&:last-child td': {
//                         borderBottom: 0,
//                       },
//                     }}
//                   >

//                     {/* Company */}
//                     <TableCell>
//                       <Box
//                         sx={{
//                           display: 'flex',
//                           alignItems: 'center',
//                           gap: 1.5,
//                         }}
//                       >
//                         <Avatar
//                           sx={{
//                             width: 42,
//                             height: 42,
//                             backgroundColor:
//                               app.logo_color ||
//                               theme.palette.primary.main,
//                             color: '#fff',
//                             fontSize: '0.8rem',
//                             fontWeight: 700,
//                           }}
//                         >
//                           {getInitials(app.company)}
//                         </Avatar>

//                         <Typography
//                           variant="body2"
//                           sx={{
//                             fontWeight: 600,
//                             color: 'text.primary',
//                           }}
//                         >
//                           {app.company}
//                         </Typography>
//                       </Box>
//                     </TableCell>


//                     {/* Position */}
//                     <TableCell>
//                       <Typography
//                         variant="body2"
//                         sx={{
//                           color: 'text.secondary',
//                           fontSize: '0.95rem',
//                         }}
//                       >
//                         {app.position}
//                       </Typography>
//                     </TableCell>


//                     {/* Status */}
//                     <TableCell>
//                       <StatusChip status={app.status} />
//                     </TableCell>


//                     {/* Date */}
//                     <TableCell align="right">
//                       <Typography
//                         variant="body2"
//                         sx={{
//                           color: 'text.secondary',
//                           fontSize: '0.95rem',
//                         }}
//                       >
//                         {formatDate(app.applied_date)}
//                       </Typography>
//                     </TableCell>


//                     {/* Actions */}
//                     <TableCell align="right">
//                       <IconButton
//                         size="small"
//                         onClick={(event) =>
//                           handleMenuOpen(event, app)
//                         }
//                         sx={{
//                           color: 'text.secondary',

//                           '&:hover': {
//                             backgroundColor:
//                               theme.palette.mode === 'dark'
//                                 ? 'rgba(255,255,255,0.06)'
//                                 : 'rgba(15,23,42,0.05)',
//                           },
//                         }}
//                       >
//                         <MoreVertOutlinedIcon fontSize="small" />
//                       </IconButton>
//                     </TableCell>

//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         )}
//       </CardContent>


//       {/* Action menu */}
//       <ActionMenu
//         anchorEl={anchorEl}
//         selectedApp={selectedApp}
//         onClose={handleMenuClose}
//         onEdit={onEdit}
//         onDelete={onDelete}
//         onStatusChange={onStatusChange}
//       />
//     </Card>
//   );
// }


// // ============================================================
// // MOBILE APPLICATION ROW
// // ============================================================

// function MobileApplicationRow({
//   app,
//   onMenuOpen,
// }) {
//   const theme = useTheme();

//   return (
//     <Box
//       sx={{
//         display: 'flex',
//         alignItems: 'center',
//         gap: 1.5,

//         p: 1.25,

//         borderRadius: 2,

//         border: `1px solid ${theme.palette.divider}`,

//         backgroundColor:
//           theme.palette.mode === 'dark'
//             ? 'rgba(255,255,255,0.025)'
//             : '#fafbfc',
//       }}
//     >
//       <Avatar
//         sx={{
//           width: 38,
//           height: 38,
//           backgroundColor:
//             app.logo_color ||
//             theme.palette.primary.main,
//           color: '#fff',
//           fontSize: '0.75rem',
//           fontWeight: 700,
//           flexShrink: 0,
//         }}
//       >
//         {getInitials(app.company)}
//       </Avatar>


//       <Box
//         sx={{
//           flex: 1,
//           minWidth: 0,
//         }}
//       >
//         <Typography
//           variant="subtitle2"
//           sx={{
//             fontSize: '0.875rem',
//             lineHeight: 1.3,
//             color: 'text.primary',
//           }}
//           noWrap
//         >
//           {app.position}
//         </Typography>

//         <Typography
//           variant="caption"
//           sx={{
//             color: 'text.secondary',
//           }}
//           noWrap
//         >
//           {app.company} · {formatDate(app.applied_date)}
//         </Typography>
//       </Box>


//       <StatusChip
//         status={app.status}
//         compact
//       />


//       <IconButton
//         size="small"
//         onClick={(event) => onMenuOpen(event, app)}
//         sx={{
//           color: 'text.secondary',
//           flexShrink: 0,
//         }}
//       >
//         <MoreVertOutlinedIcon fontSize="small" />
//       </IconButton>
//     </Box>
//   );
// }


// // ============================================================
// // STATUS CHIP
// // ============================================================

// function StatusChip({
//   status,
//   compact = false,
// }) {
//   const theme = useTheme();

//   const config =
//     statusConfig[status] ||
//     statusConfig.applied;

//   return (
//     <Chip
//       label={config.label}
//       size="small"
//       sx={{
//         height: compact ? 22 : 24,

//         backgroundColor:
//           theme.palette.mode === 'dark'
//             ? `${config.color}22`
//             : config.background,

//         color: config.color,

//         fontWeight: 600,

//         fontSize: compact
//           ? '0.7rem'
//           : '0.72rem',

//         borderRadius: 1.5,

//         '& .MuiChip-label': {
//           px: compact ? 1 : 1.2,
//         },
//       }}
//     />
//   );
// }


// // ============================================================
// // ACTION MENU
// // ============================================================

// function ActionMenu({
//   anchorEl,
//   selectedApp,
//   onClose,
//   onEdit,
//   onDelete,
//   onStatusChange,
// }) {
//   const theme = useTheme();

//   if (!selectedApp) {
//     return null;
//   }

//   return (
//     <Menu
//       anchorEl={anchorEl}
//       open={Boolean(anchorEl)}
//       onClose={onClose}
//       slotProps={{
//         paper: {
//           sx: {
//             borderRadius: 2,
//             mt: 1,
//             minWidth: 210,

//             backgroundColor:
//               theme.palette.background.paper,

//             border: `1px solid ${theme.palette.divider}`,

//             boxShadow:
//               theme.palette.mode === 'dark'
//                 ? '0 8px 24px rgba(0,0,0,0.35)'
//                 : '0 8px 24px rgba(0,0,0,0.12)',
//           },
//         },
//       }}
//     >

//       {/* Edit */}
//       <MenuItem
//         onClick={() => {
//           onEdit(selectedApp);
//           onClose();
//         }}
//       >
//         <ListItemIcon>
//           <EditOutlinedIcon fontSize="small" />
//         </ListItemIcon>

//         <ListItemText>
//           Edit Application
//         </ListItemText>
//       </MenuItem>


//       {/* Delete */}
//       <MenuItem
//         onClick={() => {
//           onDelete(selectedApp.id);
//           onClose();
//         }}
//         sx={{
//           color: 'error.main',
//         }}
//       >
//         <ListItemIcon>
//           <DeleteOutlineOutlinedIcon
//             fontSize="small"
//             sx={{
//               color: 'error.main',
//             }}
//           />
//         </ListItemIcon>

//         <ListItemText>
//           Delete
//         </ListItemText>
//       </MenuItem>


//       <Divider sx={{ my: 0.5 }} />


//       {/* Change Status Header */}
//       <Box
//         sx={{
//           px: 2,
//           py: 1,
//         }}
//       >
//         <Typography
//           variant="caption"
//           sx={{
//             color: 'text.secondary',
//             fontWeight: 600,
//             textTransform: 'uppercase',
//             letterSpacing: '0.05em',
//           }}
//         >
//           Change Status
//         </Typography>
//       </Box>


//       {/* Status Options */}
//       {statusOrder.map((status) => {
//         const config = statusConfig[status];

//         const isSelected =
//           selectedApp.status === status;

//         return (
//           <MenuItem
//             key={status}
//             onClick={() => {
//               onStatusChange(
//                 selectedApp.id,
//                 status
//               );

//               onClose();
//             }}
//             selected={isSelected}
//             sx={{
//               '&.Mui-selected': {
//                 backgroundColor:
//                   theme.palette.mode === 'dark'
//                     ? `${config.color}18`
//                     : `${config.color}12`,
//               },

//               '&.Mui-selected:hover': {
//                 backgroundColor:
//                   theme.palette.mode === 'dark'
//                     ? `${config.color}25`
//                     : `${config.color}18`,
//               },
//             }}
//           >

//             {/* Status dot */}
//             <Box
//               sx={{
//                 width: 9,
//                 height: 9,
//                 borderRadius: '50%',
//                 backgroundColor: config.color,
//                 mr: 1.5,
//                 flexShrink: 0,
//               }}
//             />


//             {/* Status label */}
//             <ListItemText
//               sx={{
//                 color: isSelected
//                   ? config.color
//                   : 'text.primary',

//                 fontWeight:
//                   isSelected ? 600 : 400,
//               }}
//             >
//               {config.label}
//             </ListItemText>


//             {/* Current status */}
//             {isSelected && (
//               <Typography
//                 variant="caption"
//                 sx={{
//                   color: config.color,
//                   fontWeight: 700,
//                   ml: 1,
//                 }}
//               >
//                 ✓
//               </Typography>
//             )}

//           </MenuItem>
//         );
//       })}
//     </Menu>
//   );
// }


// // ============================================================
// // EMPTY STATE
// // ============================================================

// function EmptyState() {
//   return (
//     <Box
//       sx={{
//         textAlign: 'center',
//         py: 5,
//       }}
//     >
//       <DescriptionOutlinedIcon
//         sx={{
//           fontSize: 42,
//           color: 'text.disabled',
//           mb: 1,
//         }}
//       />

//       <Typography
//         variant="body1"
//         sx={{
//           fontWeight: 600,
//           color: 'text.primary',
//           mb: 0.5,
//         }}
//       >
//         No applications yet
//       </Typography>

//       <Typography
//         variant="body2"
//         sx={{
//           color: 'text.secondary',
//         }}
//       >
//         Your recent job applications will appear here.
//       </Typography>
//     </Box>
//   );
// }


import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Skeleton,
  useMediaQuery,
  useTheme,
  Stack,
} from '@mui/material';

import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';

import { useApplication } from '../../../hooks/useApplication';

// ============================================================
// STATUS CONFIGURATION
// ============================================================
// Real Application.status values (backend enum): applied, shortlisted,
// rejected, hired, withdrawn. ("interview" isn't a real application
// status — interview stage lives on the separate Interview model — but
// the key is harmless to keep here in case it's ever added.)

const statusConfig = {
  applied: {
    label: 'Applied',
    color: '#2563eb',
    background: 'rgba(37, 99, 235, 0.12)',
  },

  shortlisted: {
    label: 'Shortlisted',
    color: '#db2777',
    background: 'rgba(219, 39, 119, 0.12)',
  },

  interview: {
    label: 'Interview',
    color: '#d97706',
    background: 'rgba(245, 158, 11, 0.16)',
  },

  hired: {
    label: 'Hired',
    color: '#059669',
    background: 'rgba(5, 150, 105, 0.12)',
  },

  rejected: {
    label: 'Rejected',
    color: '#dc2626',
    background: 'rgba(220, 38, 38, 0.12)',
  },

  withdrawn: {
    label: 'Withdrawn',
    color: '#64748b',
    background: 'rgba(100, 116, 139, 0.12)',
  },
};

// Cycled through for each company avatar, since the backend doesn't
// store a color per application.
const avatarColors = [
  '#6366f1',
  '#ec4899',
  '#f59e0b',
  '#10b981',
  '#8b5cf6',
  '#3b82f6',
  '#ef4444',
  '#14b8a6',
];

// ============================================================
// HELPERS
// ============================================================

const getInitials = (company = '') => {
  return company
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
};

const formatDate = (date) => {
  if (!date) return '-';

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return '-';
  }

  return parsedDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function RecentApplications() {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  const {
    applications: rawApplications,
    loading,
    error,
    fetchMyApplications,
    removeApplication,
  } = useApplication();

  useEffect(() => {
    fetchMyApplications().catch(() => {});
  }, [fetchMyApplications]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);

  // ----------------------------------------------------------
  // MAP BACKEND SHAPE -> WHAT THIS UI EXPECTS
  // ----------------------------------------------------------
  // getMyApplications populates jobId with title/company/location/employmentType

  const applications = rawApplications.map((app, index) => ({
    id: app._id,
    company: app.jobId?.company || 'Unknown company',
    position: app.jobId?.title || 'Unknown position',
    status: app.status || 'applied',
    applied_date: app.createdAt,
    logo_color: avatarColors[index % avatarColors.length],
  }));

  // ----------------------------------------------------------
  // MENU
  // ----------------------------------------------------------

  const handleMenuOpen = (event, app) => {
    setAnchorEl(event.currentTarget);
    setSelectedApp(app);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedApp(null);
  };

  const handleWithdraw = async (applicationId) => {
    try {
      await removeApplication(applicationId);
    } catch (err) {
      // NOTE: the backend doesn't currently expose a DELETE
      // /applications/:id route, so this will fail until that's added
      // server-side. Logged rather than silently swallowed.
      console.error('Withdraw application error:', err);
    } finally {
      handleMenuClose();
    }
  };

  // ----------------------------------------------------------
  // SORT APPLICATIONS
  // ----------------------------------------------------------

  const sortedApplications = [...applications].sort(
    (a, b) =>
      new Date(b.applied_date).getTime() -
      new Date(a.applied_date).getTime()
  );

  // Desktop = 8
  // Tablet = 6
  const displayApplications = isTablet
    ? sortedApplications.slice(0, 6)
    : sortedApplications.slice(0, 8);

  // ==========================================================
  // MOBILE VIEW
  // ==========================================================

  if (isMobile) {
    return (
      <Card
        sx={{
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          boxShadow: 'none',
          m: 3,
        }}
      >
        <CardContent
          sx={{
            p: 2.5,
            pb: 2,
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1,
              mb: 2,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <DescriptionOutlinedIcon
                sx={{
                  color: 'primary.main',
                  fontSize: 21,
                }}
              />

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
                }}
              >
                Recent Applications
              </Typography>
            </Box>

            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
              }}
            >
              {applications.length}
            </Typography>
          </Box>

          {/* Error state */}
          {error && (
            <Typography
              variant="body2"
              sx={{ color: 'error.main', mb: 2 }}
            >
              {error}
            </Typography>
          )}

          {/* Loading state */}
          {loading && (
            <Stack spacing={1.5}>
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rounded"
                  height={64}
                  sx={{ borderRadius: 2 }}
                />
              ))}
            </Stack>
          )}

          {/* Empty state */}
          {!loading && displayApplications.length === 0 && (
            <EmptyState />
          )}

          {/* Applications */}
          {!loading && (
            <Stack spacing={1.5}>
              {displayApplications.map((app) => (
                <MobileApplicationRow
                  key={app.id}
                  app={app}
                  onMenuOpen={handleMenuOpen}
                />
              ))}
            </Stack>
          )}

          {/* Action menu */}
          <ActionMenu
            anchorEl={anchorEl}
            selectedApp={selectedApp}
            onClose={handleMenuClose}
            onWithdraw={handleWithdraw}
          />
        </CardContent>
      </Card>
    );
  }

  // ==========================================================
  // DESKTOP / TABLET VIEW
  // ==========================================================

  return (
    <Card
      sx={{
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        boxShadow: 'none',
        overflow: 'hidden',
      }}
    >
      <CardContent
        sx={{
          p: 2.5,
          pb: 0,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 1,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <DescriptionOutlinedIcon
              sx={{
                color: 'primary.main',
                fontSize: 21,
              }}
            />

            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
              }}
            >
              Recent Applications
            </Typography>
          </Box>

          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
            }}
          >
            {applications.length} total
          </Typography>
        </Box>

        {/* Error state */}
        {error && (
          <Typography
            variant="body2"
            sx={{ color: 'error.main', mb: 2 }}
          >
            {error}
          </Typography>
        )}

        {/* Loading state */}
        {loading && (
          <Stack spacing={1.5} sx={{ pb: 2.5 }}>
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton
                key={index}
                variant="rounded"
                height={56}
                sx={{ borderRadius: 2 }}
              />
            ))}
          </Stack>
        )}

        {/* Empty state */}
        {!loading && displayApplications.length === 0 && <EmptyState />}

        {/* Table */}
        {!loading && displayApplications.length > 0 && (
          <TableContainer>
            <Table
              size="medium"
              sx={{
                minWidth: 650,
              }}
            >
              {/* Header */}
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      color: 'text.secondary',
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      borderBottom: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    Company
                  </TableCell>

                  <TableCell
                    sx={{
                      color: 'text.secondary',
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      borderBottom: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    Position
                  </TableCell>

                  <TableCell
                    sx={{
                      color: 'text.secondary',
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      borderBottom: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    Status
                  </TableCell>

                  <TableCell
                    align="right"
                    sx={{
                      color: 'text.secondary',
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      borderBottom: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    Date
                  </TableCell>

                  <TableCell
                    align="right"
                    sx={{
                      color: 'text.secondary',
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      borderBottom: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              {/* Body */}
              <TableBody>
                {displayApplications.map((app) => (
                  <TableRow
                    key={app.id}
                    sx={{
                      transition: 'background-color 0.15s',

                      '&:hover': {
                        backgroundColor:
                          theme.palette.mode === 'dark'
                            ? 'rgba(255,255,255,0.03)'
                            : '#f8fafc',
                      },

                      '&:last-child td': {
                        borderBottom: 0,
                      },
                    }}
                  >
                    {/* Company */}
                    <TableCell>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 42,
                            height: 42,
                            backgroundColor:
                              app.logo_color || theme.palette.primary.main,
                            color: '#fff',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                          }}
                        >
                          {getInitials(app.company)}
                        </Avatar>

                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: 'text.primary',
                          }}
                        >
                          {app.company}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Position */}
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          fontSize: '0.95rem',
                        }}
                      >
                        {app.position}
                      </Typography>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <StatusChip status={app.status} />
                    </TableCell>

                    {/* Date */}
                    <TableCell align="right">
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          fontSize: '0.95rem',
                        }}
                      >
                        {formatDate(app.applied_date)}
                      </Typography>
                    </TableCell>

                    {/* Actions */}
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={(event) => handleMenuOpen(event, app)}
                        sx={{
                          color: 'text.secondary',

                          '&:hover': {
                            backgroundColor:
                              theme.palette.mode === 'dark'
                                ? 'rgba(255,255,255,0.06)'
                                : 'rgba(15,23,42,0.05)',
                          },
                        }}
                      >
                        <MoreVertOutlinedIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>

      {/* Action menu */}
      <ActionMenu
        anchorEl={anchorEl}
        selectedApp={selectedApp}
        onClose={handleMenuClose}
        onWithdraw={handleWithdraw}
      />
    </Card>
  );
}

// ============================================================
// MOBILE APPLICATION ROW
// ============================================================

function MobileApplicationRow({ app, onMenuOpen }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,

        p: 1.25,

        borderRadius: 2,

        border: `1px solid ${theme.palette.divider}`,

        backgroundColor:
          theme.palette.mode === 'dark'
            ? 'rgba(255,255,255,0.025)'
            : '#fafbfc',
      }}
    >
      <Avatar
        sx={{
          width: 38,
          height: 38,
          backgroundColor: app.logo_color || theme.palette.primary.main,
          color: '#fff',
          fontSize: '0.75rem',
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {getInitials(app.company)}
      </Avatar>

      <Box
        sx={{
          flex: 1,
          minWidth: 0,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            fontSize: '0.875rem',
            lineHeight: 1.3,
            color: 'text.primary',
          }}
          noWrap
        >
          {app.position}
        </Typography>

        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
          }}
          noWrap
        >
          {app.company} · {formatDate(app.applied_date)}
        </Typography>
      </Box>

      <StatusChip status={app.status} compact />

      <IconButton
        size="small"
        onClick={(event) => onMenuOpen(event, app)}
        sx={{
          color: 'text.secondary',
          flexShrink: 0,
        }}
      >
        <MoreVertOutlinedIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}

// ============================================================
// STATUS CHIP
// ============================================================

function StatusChip({ status, compact = false }) {
  const theme = useTheme();

  const config = statusConfig[status] || statusConfig.applied;

  return (
    <Chip
      label={config.label}
      size="small"
      sx={{
        height: compact ? 22 : 24,

        backgroundColor:
          theme.palette.mode === 'dark'
            ? `${config.color}22`
            : config.background,

        color: config.color,

        fontWeight: 600,

        fontSize: compact ? '0.7rem' : '0.72rem',

        borderRadius: 1.5,

        '& .MuiChip-label': {
          px: compact ? 1 : 1.2,
        },
      }}
    />
  );
}

// ============================================================
// ACTION MENU
// ============================================================
// Only "Withdraw" is offered here — "Edit Application" and "Change
// Status" were removed because neither has a backing endpoint an
// applicant can call: there's no edit-application route at all, and
// status changes are recruiter-only (PUT /applications/:id is gated by
// roleMiddleware("recruiter")).

function ActionMenu({ anchorEl, selectedApp, onClose, onWithdraw }) {
  const theme = useTheme();

  if (!selectedApp) {
    return null;
  }

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            mt: 1,
            minWidth: 210,

            backgroundColor: theme.palette.background.paper,

            border: `1px solid ${theme.palette.divider}`,

            boxShadow:
              theme.palette.mode === 'dark'
                ? '0 8px 24px rgba(0,0,0,0.35)'
                : '0 8px 24px rgba(0,0,0,0.12)',
          },
        },
      }}
    >
      {/* Withdraw */}
      <MenuItem
        onClick={() => onWithdraw(selectedApp.id)}
        sx={{
          color: 'error.main',
        }}
      >
        <ListItemIcon>
          <DeleteOutlineOutlinedIcon
            fontSize="small"
            sx={{
              color: 'error.main',
            }}
          />
        </ListItemIcon>

        <ListItemText>Withdraw Application</ListItemText>
      </MenuItem>
    </Menu>
  );
}

// ============================================================
// EMPTY STATE
// ============================================================

function EmptyState() {
  return (
    <Box
      sx={{
        textAlign: 'center',
        py: 5,
      }}
    >
      <DescriptionOutlinedIcon
        sx={{
          fontSize: 42,
          color: 'text.disabled',
          mb: 1,
        }}
      />

      <Typography
        variant="body1"
        sx={{
          fontWeight: 600,
          color: 'text.primary',
          mb: 0.5,
        }}
      >
        No applications yet
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
        }}
      >
        Your recent job applications will appear here.
      </Typography>
    </Box>
  );
}











