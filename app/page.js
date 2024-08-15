'use client';
import { Box, Stack, Typography, Button, Modal, TextField, MenuItem, Select, Snackbar, Alert } from "@mui/material";
import { firestore } from "./firebase";
import { collection, getDocs, query, doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import CategoryIcon from '@mui/icons-material/Category';
import RemoveIcon from '@mui/icons-material/Remove';

export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemCategory, setItemCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSnackbarClose = () => setSnackbarOpen(false);

  const updatePantry = async () => {
    try {
      const snapshot = query(collection(firestore, 'pantry'));
      const docs = await getDocs(snapshot);
      const pantryList = [];
      docs.forEach((doc) => {
        pantryList.push({ name: doc.id, ...doc.data() });
      });
      setPantry(pantryList);
    } catch (error) {
      console.error("Error updating pantry:", error);
    }
  };

  useEffect(() => {
    updatePantry();
  }, []);

  const addItem = async (item, category) => {
    try {
      const docRef = doc(collection(firestore, 'pantry'), item);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await setDoc(docRef, { count: docSnap.data().count + 1, category });
      } else {
        await setDoc(docRef, { count: 1, category });
      }

      setSnackbarMessage('Item added successfully!');
      setSnackbarOpen(true);
      await updatePantry();
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const removeItem = async (item) => {
    try {
      const docRef = doc(collection(firestore, 'pantry'), item);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const currentCount = docSnap.data().count;

        if (currentCount > 1) {
          await setDoc(docRef, { count: currentCount - 1, category: docSnap.data().category });
        } else {
          await deleteDoc(docRef);
        }

        setSnackbarMessage('Item removed successfully!');
        setSnackbarOpen(true);
        await updatePantry();
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const filteredPantry = pantry
    .filter(({ name }) => name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(({ category }) => !filterCategory || category === filterCategory);

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: '12px',
    boxShadow: 24,
    backdropFilter: 'blur(10px)',
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    transition: 'transform 0.3s ease-in-out',
  };

  const itemCardStyle = {
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    bgcolor: '#fafafa',
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display='flex'
      justifyContent='center'
      flexDirection='column'
      alignItems='center'
      gap={2}
      bgcolor='#555'
      color='#fff'
    >
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Select
              labelId="category-label"
              id="category"
              value={itemCategory}
              onChange={(e) => setItemCategory(e.target.value)}
              displayEmpty
              fullWidth
            >
              <MenuItem value=""><em>None</em></MenuItem>
              <MenuItem value="Beverages">Beverages</MenuItem>
              <MenuItem value="Snacks">Snacks</MenuItem>
              <MenuItem value="Dairy">Dairy</MenuItem>
              <MenuItem value="Fruits">Fruits</MenuItem>
              <MenuItem value="Vegetables">Vegetables</MenuItem>
            </Select>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                addItem(itemName, itemCategory);
                setItemName('');
                setItemCategory('');
                handleClose();
              }}
              startIcon={<AddIcon />}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Box display='flex' gap={2} mb={2} width="80%">
        <TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <SearchIcon style={{ marginRight: '8px', color: '#888' }} />
            ),
          }}
          fullWidth
        />
        <Select
          labelId="filter-category-label"
          id="filter-category"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          displayEmpty
          fullWidth
          startAdornment={<CategoryIcon style={{ marginRight: '8px', color: '#888' }} />}
        >
          <MenuItem value=""><em>All Categories</em></MenuItem>
          <MenuItem value="Beverages">Beverages</MenuItem>
          <MenuItem value="Snacks">Snacks</MenuItem>
          <MenuItem value="Dairy">Dairy</MenuItem>
          <MenuItem value="Fruits">Fruits</MenuItem>
          <MenuItem value="Vegetables">Vegetables</MenuItem>
        </Select>
      </Box>

      <Button variant="contained" color="secondary" onClick={handleOpen} startIcon={<AddIcon />}>
        Add
      </Button>

      <Box border='1px solid #555' width="80%" borderRadius="10px" p={2} mt={2}>
        <Box width="100%" height="100px" bgcolor='#444' display='flex' justifyContent='center' alignItems='center' borderRadius="10px 10px 0 0">
          <Typography variant='h4' color='#fff' textAlign='center'>
            Pantry Items
          </Typography>
        </Box>
        <Stack width="100%" height="400px" spacing={2} sx={{ overflowY: 'auto', p: 2 }}>
          {filteredPantry.map(({ name, count, category }) => (
            <Box
              key={name}
              sx={itemCardStyle}
              display='flex'
              justifyContent='space-between'
              alignItems='center'
            >
              <Box display="flex" alignItems="center" gap={2}>
                <Box>
                  <Typography variant="h6" color='#333'>{name}</Typography>
                  <Typography variant="subtitle1" color='#777'>Category: {category}</Typography>
                </Box>
              </Box>
              <Stack direction="row" spacing={1} alignItems='center'>
                <Typography variant="h6" color='#555'>{count}</Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => removeItem(name)}
                  startIcon={<RemoveIcon />}
                >
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
