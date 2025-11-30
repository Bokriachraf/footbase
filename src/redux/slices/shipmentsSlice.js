import { createSlice } from '@reduxjs/toolkit'
import { nanoid } from '@reduxjs/toolkit'

const initialState = {
  shipments: [],
}

const shipmentsSlice = createSlice({
  name: 'shipments',
  initialState,
  reducers: {
    addShipment: (state, action) => {
      const newShipment = {
        id: nanoid(),
        name: action.payload.name,
        status: 'en attente',
      }
      state.shipments.push(newShipment)
    },
    removeShipment: (state, action) => {
      state.shipments = state.shipments.filter(s => s.id !== action.payload)
    },
  },
})

export const { addShipment, removeShipment } = shipmentsSlice.actions
export default shipmentsSlice.reducer