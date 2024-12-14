import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
export interface DoctorState {
  doctor: any[];
}

const initialState: DoctorState = {
  doctor: [],
};

export const doctorSlice = createSlice({
  name: "doctor",
  initialState,
  reducers: {
    setDoctorState: (state, action: PayloadAction<any>) => {
      state.doctor = action.payload;
    },
    addDoctorState: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        doctor: [...state.doctor, action.payload],
      };
    },
    editDoctorState: (state, action: PayloadAction<any>) => {
      const index = state.doctor.findIndex(
        (doctor) => doctor._id === action.payload._id
      );
      if (index !== -1) {
        state.doctor[index] = action.payload;
      }
    },
    deleteDoctorState: (state, action: PayloadAction<any>) => {
      state.doctor = state.doctor.filter(
        (doctor) => doctor._id !== action.payload
      );
    },
  },
});

export const {
  setDoctorState,
  addDoctorState,
  editDoctorState,
  deleteDoctorState,
} = doctorSlice.actions;
export default doctorSlice.reducer;
