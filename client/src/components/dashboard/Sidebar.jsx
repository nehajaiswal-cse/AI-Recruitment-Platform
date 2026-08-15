import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import WorkOutlineRoundedIcon from '@mui/icons-material/WorkOutlineRounded'
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined'
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded'
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined'
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: DashboardRoundedIcon },
  { id: 'jobs', label: 'Manage Jobs', icon: WorkOutlineRoundedIcon },
  { id: 'candidates', label: 'Candidates', icon: GroupOutlinedIcon },
  { id: 'analytics', label: 'Analytics', icon: InsightsRoundedIcon },
  { id: 'interviews', label: 'Interviews', icon: VideocamOutlinedIcon },
  { id: 'company', label: 'Company', icon: ApartmentRoundedIcon },
  { id: 'settings', label: 'Settings', icon: SettingsOutlinedIcon },
]

const SIDEBAR_WIDTH = 216

export default function Sidebar({ active = 'dashboard', onNavigate, mobileOpen = false, onMobileClose }) {
  const navList = (onItemClick) => (
    <List sx={{ px: 1.5, py: 1 }}>
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon
        const isActive = active === item.id
        return (
          <ListItemButton
            key={item.id}
            selected={isActive}
            onClick={() => {
              onNavigate?.(item.id)
              onItemClick?.()
            }}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              color: isActive ? 'text.primary' : 'text.secondary',
              '&.Mui-selected': {
                bgcolor: 'rgba(59, 130, 246, 0.14)',
                '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.18)' },
              },
              '&:hover': { bgcolor: 'rgba(148, 163, 184, 0.08)' },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: isActive ? 'primary.main' : 'text.secondary' }}>
              <Icon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{ fontSize: 14, fontWeight: isActive ? 600 : 500 }}
            />
          </ListItemButton>
        )
      })}
    </List>
  )

  return (
    <>
      {/* Desktop: permanent, always visible */}
      <Box
        component="nav"
        sx={{
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          bgcolor: 'background.default',
          borderRight: '1px solid',
          borderColor: 'divider',
          position: 'sticky',
          top: 72,
          height: 'calc(100vh - 72px)',
          display: { xs: 'none', md: 'block' },
        }}
      >
        {navList()}
      </Box>

      {/* Mobile / tablet: temporary drawer toggled from the navbar menu icon */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: SIDEBAR_WIDTH,
            bgcolor: 'background.default',
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ height: 72 }} />
        {navList(onMobileClose)}
      </Drawer>
    </>
  )
}

export { SIDEBAR_WIDTH }






