import { useState } from 'react';

import {
  Box,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  Card,
  Stack,
  FormControl,
  InputLabel,
  Button,
  useMediaQuery,
} from '@mui/material';

import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import { useTheme } from '@mui/material/styles';


const departments = [
  'Engineering',
  'Design',
  'Marketing',
  'Sales',
  'Human Resources',
  'Finance',
  'Operations',
  'Product',
];

export default function JobFilters() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [search, setSearch] = useState('');

  const [deptFilter, setDeptFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortKey, setSortKey] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        flexDirection: {
          xs: 'column',
          sm: 'row',
        },
        alignItems: 'stretch',
        gap: 2,

        px: {
          xs: 2,
          sm: 3,
          md: 3,
        },

        pt: {
          xs: 2,
          sm: 2,
          md: 2,
        },

        mb: 3,
      }}
    >

     

      <Card
        sx={{
          width: '100%',
          mb: 2.5,
          p: {
            xs: 1.5,
            sm: 2,
          },
        }}
      >

        <Stack
          sx={{
            width: '100%',
          }}
          direction={{
            xs: 'column',
            md: 'row',
          }}
          spacing={1.5}
        >
          {/* Search */}
          <TextField
            placeholder="Search Candidates..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            size="small"
            fullWidth
            sx={{
              flexGrow: 1,
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon
                      size={18}
                      color="#94a3b8"
                    />
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* Desktop Filters */}

          {!isMobile && (
            <>
              <FormControl
                size="small"
                sx={{ minWidth: 140 }}
              >
                <InputLabel>
                  Status
                </InputLabel>

                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) =>
                    setStatusFilter(
                      e.target.value
                    )
                  }
                >
                  <MenuItem value="all">
                    All Status
                  </MenuItem>

                  <MenuItem value="active">
                    Active
                  </MenuItem>

                  <MenuItem value="draft">
                    Draft
                  </MenuItem>

                  <MenuItem value="closed">
                    Closed
                  </MenuItem>
                </Select>
              </FormControl>

              <FormControl
                size="small"
                sx={{ minWidth: 150 }}
              >
                <InputLabel>
                  Department
                </InputLabel>

                <Select
                  value={deptFilter}
                  label="Department"
                  onChange={(e) =>
                    setDeptFilter(
                      e.target.value
                    )
                  }
                >
                  <MenuItem value="all">
                    All Departments
                  </MenuItem>

                  {/* {DEPARTMENTS.map(
                      (department) => (
                        <MenuItem
                          key={department}
                          value={department}
                        >
                          {department}
                        </MenuItem>
                      )
                    )} */}
                  {departments.map((department) => (
                    <MenuItem
                      key={department}
                      value={department}
                    >
                      {department}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl
                size="small"
                sx={{ minWidth: 140 }}
              >
                <InputLabel>
                  Sort By
                </InputLabel>

                <Select
                  value={sortKey}
                  label="Sort By"
                  onChange={(e) =>
                    setSortKey(
                      e.target.value
                    )
                  }
                >
                  <MenuItem value="newest">
                    Newest First
                  </MenuItem>

                  <MenuItem value="applicants">
                    Most Applicants
                  </MenuItem>

                  <MenuItem value="ai_match">
                    Best AI Match
                  </MenuItem>
                </Select>
              </FormControl>
            </>
          )}

          {/* Mobile Filters */}

          {isMobile && (
            <Button
              variant="outlined"
              color="inherit"
              startIcon={
                <TuneRoundedIcon
                  size={16}
                />
              }
              onClick={() =>
                setShowFilters(
                  (value) => !value
                )
              }
              sx={{
                justifyContent:
                  'flex-start',
                borderRadius: 10,
                py: 1,
              }}
            >
              Filters
            </Button>
          )}
        </Stack>

        {/* Mobile Filter Panel */}

        {isMobile &&
          showFilters && (
            <Stack
              spacing={1.5}
              sx={{ mt: 1.5 }}
            >
              {/* Status */}

              <FormControl
                size="small"
                fullWidth
              >
                <InputLabel>
                  Status
                </InputLabel>

                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) =>
                    setStatusFilter(
                      e.target.value
                    )
                  }
                >
                  <MenuItem value="all">
                    All Status
                  </MenuItem>

                  <MenuItem value="active">
                    Active
                  </MenuItem>

                  <MenuItem value="draft">
                    Draft
                  </MenuItem>

                  <MenuItem value="closed">
                    Closed
                  </MenuItem>
                </Select>
              </FormControl>

              {/* Department */}

              <FormControl
                size="small"
                fullWidth
              >
                <InputLabel>
                  Department
                </InputLabel>

                <Select
                  value={deptFilter}
                  label="Department"
                  onChange={(e) =>
                    setDeptFilter(
                      e.target.value
                    )
                  }
                >
                  <MenuItem value="all">
                    All Departments
                  </MenuItem>

                

                  {departments.map((department) => (
                    <MenuItem
                      key={department}
                      value={department}
                    >
                      {department}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Sort */}

              <FormControl
                size="small"
                fullWidth
              >
                <InputLabel>
                  Sort By
                </InputLabel>

                <Select
                  value={sortKey}
                  label="Sort By"
                  onChange={(e) =>
                    setSortKey(
                      e.target.value
                    )
                  }
                >
                  <MenuItem value="newest">
                    Newest First
                  </MenuItem>

                  <MenuItem value="applicants">
                    Most Applicants
                  </MenuItem>

                  <MenuItem value="ai_match">
                    Best AI Match
                  </MenuItem>
                </Select>
              </FormControl>
            </Stack>
          )}

      </Card>
    </Box >




  );
}





