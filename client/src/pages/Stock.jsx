import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceArea } from "recharts";
import axios from "axios";
import { djangoUrl } from "../constants";

const columns = [
  { id: "Symbol", label: "Stock Symbol", minWidth: 100 },
  { id: "Name", label: "Stock Name", minWidth: 120 },
  { id: "Last Price", label: "Last Price", minWidth: 100 },
  { id: "Actions", label: "Actions", minWidth: 100, align: "center" }, // New column for buttons
];

const ChartDialog = ({ open, onClose, chartData }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Stock Price Prediction Chart</DialogTitle>
      <DialogContent>
        <LineChart width={600} height={300} data={chartData}>
          <XAxis dataKey="label" />
          <YAxis />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Stock Price Prediction" stroke="rgb(255,0,255)" />

          {/* Add ReferenceArea for background after today */}
          <ReferenceArea
            x1={today.getTime()}
            stroke="none"
            fill="#f7f7f7"
            label={{ position: 'insideTopRight', value: 'Future', fill: '#666' }}
          />
        </LineChart>
      </DialogContent>
    </Dialog>
  );
};

export default function StickyHeadTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState([]);
  const [responseFromApi, setResponseFromApi] = useState({});
  const [chartData, setChartData] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://${djangoUrl}:8000/stocks`);
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

  const handleButtonClick = async (row) => {
    try {
      const formData = new FormData();
      formData.append('symbol', row.Symbol);

      const response = await fetch(`http://${djangoUrl}:8000/stocks`, {
        method: "POST",
        body: formData,
      });

      const responseData = await response.json();
      setResponseFromApi(responseData);

      // Use actual labels from the API response
      const labels = responseData.data.map((_, index) => {
        const dayOffset = index - 14; // Subtracting 14 for the last 15 days
        const date = new Date();
        date.setDate(date.getDate() + dayOffset);
        return date.toLocaleDateString();
      });

      // Create chart data based on the response, adjust as needed
      const chartData = labels.map((label, index) => ({
        label: label.toString(),
        "Stock Price Prediction": responseData.data[index],
      }));

      setChartData(chartData);
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="p-10 mx-20">
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
              {data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.Symbol}
                  >
                    {columns.map((column) => {
                      if (column.id === "Actions") {
                        return (
                          <TableCell key={column.id} align={column.align}>
                            <Button
                              variant="contained"
                              color="success"
                              onClick={() => handleButtonClick(row)}
                            >
                              Predict
                            </Button>
                          </TableCell>
                        );
                      } else {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === "number"
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      }
                    })}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {chartData && (
        <ChartDialog
          open={isDialogOpen}
          onClose={handleCloseDialog}
          chartData={chartData}
        />
      )}
    </div>
  );
}
