import { djangoUrl } from "../constants";
import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const columns = [
  { id: "bank", label: "Bank Name", minWidth: 100 },
  {
    id: "min rate",
    label: "Minimum Recurring Rate",
    minWidth: 80,
    align: "center",
  },
  {
    id: "max rate",
    label: "Maximum Recurring Rate",
    minWidth: 80,
    align: "center",
  },
  { id: "Maturity", label: "Maturity", minWidth: 100, align: "center" }, // New column for buttons
];

function getMaturity(bankRate, principle, timeInYears) {
  var rate = bankRate;
  var n = 4;
  var ans = 0;
  var progress = [principle];

  for (var i = 1; i <= timeInYears * 4; i++) {
    ans = ans + principle * Math.pow(1 + rate / (n * 100), n * (i / 12));
    progress.push(Math.round(ans, 2));
  }

  return progress[progress.length - 1];
}

export default function StickyHeadTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState([]);
  const [principalAmount, setPrincipalAmount] = useState("");
  const [numberOfYears, setNumberOfYears] = useState("");
  const [maturityData, setMaturityData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://${djangoUrl}:8000/banks`);
        const newData = await response.json();

        // Check if newData has 'data' property and it is an array
        if (newData.data && Array.isArray(newData.data)) {
          setData(newData.data);
        } else {
          console.error("Invalid API response:", newData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handlePrincipalChange = (event) => {
    setPrincipalAmount(event.target.value);
  };

  const handleYearsChange = (event) => {
    setNumberOfYears(event.target.value);
  };

  const calculateMaturity = (minRate, maxRate) => {
    const minMaturity = getMaturity(minRate, principalAmount, numberOfYears);
   

    return minMaturity.toFixed(2);
  };

  const handleCalculateMaturity = () => {
    const updatedMaturityData = data.map((row) => {
      const maturity = calculateMaturity(row["min rate"], row["max rate"]);
      return { ...row, Maturity: maturity };
    });

    setMaturityData(updatedMaturityData);
  };

  return (
    <div className="p-10 mx-20">
      <TextField
        id="principal-amount"
        label="Principal Amount"
        variant="outlined"
        value={principalAmount}
        onChange={handlePrincipalChange}
        sx={{ marginBottom: 2, marginRight: 2, width: "200px" }}
      />

      <TextField
        id="number-of-years"
        label="Number of Years"
        variant="outlined"
        value={numberOfYears}
        onChange={handleYearsChange}
        sx={{ marginBottom: 2, marginRight: 2, width: "200px" }}
      />

      <Button
        variant="contained"
        onClick={handleCalculateMaturity}
        sx={{
          paddingBottom: 1.5,
          textAlign: "center",
          justifyContent: "center",
          paddingTop: 1.8,
        }}
      >
        Calculate Maturity
      </Button>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {maturityData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.bank}>
                    {columns.map((column) => (
                      <TableCell key={column.id} align={column.align}>
                        {column.id === "Maturity"
                          ? row[column.id]
                          : row[column.id]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={maturityData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
