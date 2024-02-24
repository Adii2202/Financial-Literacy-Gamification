import React from "react";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import { Button } from "@mui/material";

function Monetary() {

  const handleButtonClick = async () => {
    try {
      const formData = new FormData();
      formData.append("income", document.getElementById("outlined-adornment-amount").value);
      formData.append("necessities", document.getElementById("outlined-basic1").value);
      formData.append("wants", document.getElementById("outlined-basic2").value);
      formData.append("savings", document.getElementById("outlined-basic3").value);

      const response = await fetch("http://172.16.30.54:5000/api/user/set-income", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("POST request successful");
      } else {
        console.error("POST request failed");
      }
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center flex-col">
      <div className="bg-[#ffd4f7] pr-4">
        <div className="mb-4">
          <FormControl fullWidth sx={{ m: 1 }}>
            <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
            <OutlinedInput
              id="outlined-adornment-amount"
              startAdornment={<InputAdornment position="start">Rs</InputAdornment>}
              label="Amount"
            />
          </FormControl>
        </div>
        <div className="w-full flex items-center justify-center">
          <TextField id="outlined-basic1" label="Necessity" variant="outlined" sx={{ m: 1 }} />
          <TextField id="outlined-basic2" label="Want" variant="outlined" sx={{ m: 1 }} />
          <TextField id="outlined-basic3" label="Savings" variant="outlined" sx={{ m: 1 }} />
          <Button variant="contained" sx={{ p: 2 }} onClick={handleButtonClick}>
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Monetary;
