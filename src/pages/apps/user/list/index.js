// ** React Imports
import { useState, useEffect, useCallback } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { DataGrid } from '@mui/x-data-grid'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import { makeStyles } from '@material-ui/core/styles';

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CardStatsHorizontalWithDetails from 'src/@core/components/card-statistics/card-stats-horizontal-with-details'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Actions Imports
import { fetchData, deleteUser } from 'src/store/apps/user'

// ** Third Party Components
import axios from 'axios'

// ** Custom Table Components Imports
import TableHeader from 'src/views/apps/user/list/TableHeader'
import AddUserDrawer from 'src/views/apps/user/list/AddUserDrawer'


const useStyles = makeStyles({
  ellipsis: {
    maxWidth: 200, // percentage also works
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
});


// ** renders client column
// const renderClient = row => {
//   if (row.avatar.length) {
//     return <CustomAvatar src={row.avatar} sx={{ mr: 2.5, width: 38, height: 38 }} />
//   } else {
//     return (
//       <CustomAvatar
//         skin='light'
//         color={row.avatarColor}
//         sx={{ mr: 2.5, width: 38, height: 38, fontSize: '1rem', fontWeight: 500 }}
//       >
//         {getInitials(row.fullName ? row.fullName : 'John Doe')}
//       </CustomAvatar>
//     )
//   }
// }

const RowOptions = ({ id }) => {
  // ** Hooks
  const dispatch = useDispatch()

  // ** State
  const [anchorEl, setAnchorEl] = useState(null)
  const rowOptionsOpen = Boolean(anchorEl)

  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleDelete = () => {
    dispatch(deleteUser(id))
    handleRowOptionsClose()
  }

  return (
    <>
      <IconButton size='small' onClick={handleRowOptionsClick}>
        <Icon icon='tabler:dots-vertical' />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{ style: { minWidth: '8rem' } }}
      >
        <MenuItem
          component={Link}
          sx={{ '& svg': { mr: 2 } }}
          href='/apps/user/view/account'
          onClick={handleRowOptionsClose}
        >
          <Icon icon='tabler:eye' fontSize={20} />
          View
        </MenuItem>
        <MenuItem onClick={handleRowOptionsClose} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:edit' fontSize={20} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:trash' fontSize={20} />
          Delete
        </MenuItem>
      </Menu>
    </>
  )
}

const columns = [
  {
    flex: 0.1,
    minWidth: 100,
    field: '_id',
    headerName: 'No.',
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* {renderClient(row)} */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <Typography
              noWrap
              component={Link}
              href='/apps/user/view/account'
              sx={{
                fontWeight: 500,
                textDecoration: 'none',
                color: 'black',
                '&:hover': { color: '#655BD3' }
              }}
            >
              {row._id}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.4,
    field: 'viTitle',
    minWidth: 170,
    headerName: 'Title',
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CustomAvatar
            skin='light'
            sx={{ mr: 4, width: 30, height: 30 }}
            color={'primary'}
          >
          </CustomAvatar>
          <Typography className={useStyles().ellipsis} noWrap sx={{ color: 'black', textTransform: 'capitalize' }}>
            {row.viTitle}
          </Typography>
        </Box>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 120,
    headerName: 'Image',
    field: 'image',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap sx={{
          fontWeight: 500, color: 'black', textTransform: 'capitalize'
        }
        } >
          {row.image}
        </Typography >
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 190,
    field: 'view',
    headerName: 'View',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap sx={{ color: 'black' }}>
          {row.view}
        </Typography>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 110,
    field: 'fullname',
    headerName: 'Author',
    renderCell: ({ row }) => {
      return (
        <CustomChip
          rounded
          skin='light'
          size='small'
          label={row.user.fullname}

          sx={{ color: 'black', textTransform: 'capitalize' }}
        />
      )
    }
  },
  {
    flex: 0.3,
    minWidth: 100,
    sortable: false,
    field: 'createdAt',
    headerName: 'Created At',
    renderCell: ({ row }) => {
      const date = new Date(row.createdAt);
      return (
        <Typography noWrap sx={{ color: 'black' }}>
          {new Date(date).toLocaleString()}
        </Typography>
      )
    }
  }
]

const UserList = ({ apiData }) => {
  // ** State
  const [posts, setPosts] = useState([])
  const [pageSize, setPageSize] = useState(10)
  useEffect(async () => {
    await fetch('https://gw.qc.askany-technology.com/user/discover', {
      method: 'GET',
      mode: 'cors'
    })
      .then(async res => {
        if (res.ok) {
          // const { token } = await res.json();
          const data = await res.json();
          setPosts(data.data.listData)
        } else {
          throw new Error(res.statusText);
        }
      });
  }, [])
  // useEffect(() => {
  //   dispatch(
  //     fetchData({
  //       _id,
  //       enTitle,
  //       image,
  //       view,
  //       fullname,
  //       createdAt
  //     })
  //   )
  // }, [_id, enTitle, image, view, fullname, createdAt])

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)
  function generateRandom() {
    var length = 8,
      charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  }
  return (
    <Grid container spacing={6.5}>
      {/* <Grid item xs={12}>
        {apiData && (
          <Grid container spacing={6}>
            {posts.data.listData.map((item, index) => {
              return (
                <Grid item xs={12} md={3} sm={6} key={index}>
                  <CardStatsHorizontalWithDetails {...item} />
                </Grid>
              )
            })}
          </Grid>
        )}
      </Grid> */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Search Filters' />
          {/* <CardContent>
            <Grid container spacing={6}>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='role-select'>Select Role</InputLabel>
                  <Select
                    fullWidth
                    value={role}
                    id='select-role'
                    label='Select Role'
                    labelId='role-select'
                    onChange={handleRoleChange}
                    inputProps={{ placeholder: 'Select Role' }}
                  >
                    <MenuItem value=''>Select Role</MenuItem>
                    <MenuItem value='admin'>Admin</MenuItem>
                    <MenuItem value='author'>Author</MenuItem>
                    <MenuItem value='editor'>Editor</MenuItem>
                    <MenuItem value='maintainer'>Maintainer</MenuItem>
                    <MenuItem value='subscriber'>Subscriber</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='plan-select'>Select Plan</InputLabel>
                  <Select
                    fullWidth
                    value={plan}
                    id='select-plan'
                    label='Select Plan'
                    labelId='plan-select'
                    onChange={handlePlanChange}
                    inputProps={{ placeholder: 'Select Plan' }}
                  >
                    <MenuItem value=''>Select Plan</MenuItem>
                    <MenuItem value='basic'>Basic</MenuItem>
                    <MenuItem value='company'>Company</MenuItem>
                    <MenuItem value='enterprise'>Enterprise</MenuItem>
                    <MenuItem value='team'>Team</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='status-select'>Select Status</InputLabel>
                  <Select
                    fullWidth
                    value={status}
                    id='select-status'
                    label='Select Status'
                    labelId='status-select'
                    onChange={handleStatusChange}
                    inputProps={{ placeholder: 'Select Role' }}
                  >
                    <MenuItem value=''>Select Role</MenuItem>
                    <MenuItem value='pending'>Pending</MenuItem>
                    <MenuItem value='active'>Active</MenuItem>
                    <MenuItem value='inactive'>Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent> */}
          <Divider sx={{ m: '0 !important' }} />
          {/* <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer} /> */}
          <DataGrid
            rowSpacingType="border"
            autoHeight
            rowHeight={62}
            rows={posts}
            columns={columns}
            pageSize={pageSize}
            getRowId={(row) => generateRandom()}
            disableSelectionOnClick
            rowsPerPageOptions={[10, 25, 50]}
            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
          />
        </Card>
      </Grid >

      {/* <AddUserDrawer open={addUserOpen} toggle={toggleAddUserDrawer} /> */}
    </Grid >
  )
}

export const getStaticProps = async () => {
  const res = await axios.get('/cards/statistics')
  const apiData = res.data

  return {
    props: {
      apiData
    }
  }
}

export default UserList

