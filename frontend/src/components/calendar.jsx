import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";

import { LoadingSpinner } from "@/components/loading-spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import { updateRow } from "@/reducers/timesheet.reducer";

const DateCell = ({ row, checkboxChangeHandler }) => {
  const dateId = new Date(row?.date)?.toDateString().replace(/\s/g, "-");
  if (!row?.date) {
    return <TableCell className="bg-gray-200" />;
  }

  return (
    <TableCell>
      <p>{new Date(row?.date)?.getDate()}</p>
      <p>{row?.holiday ? row?.holiday_reason : ""}</p>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`present-${dateId}`}
          checked={row.present}
          onCheckedChange={(checked) =>
            checkboxChangeHandler(checked, row.id, "present")
          }
          disabled={row.locked}
        />
        <Label htmlFor={`present-${dateId}`}>Present</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`leave-${dateId}`}
          checked={row.leave}
          onCheckedChange={(checked) =>
            checkboxChangeHandler(checked, row.id, "leave")
          }
          disabled={row.locked}
        />
        <Label htmlFor={`leave-${dateId}`}>Leave</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`holiday-${dateId}`}
          checked={row.holiday}
          onCheckedChange={(checked) =>
            checkboxChangeHandler(checked, row.id, "holiday")
          }
          disabled={row.locked}
        />
        <Label htmlFor={`holiday-${dateId}`}>Holiday</Label>
      </div>
    </TableCell>
  );
};

export const Calendar = () => {
  const timesheet = useSelector((state) => state.timesheet);
  const dispatch = useDispatch();

  const checkboxChangeHandler = (checked, id, type) => {
    if (type === "present") {
      dispatch(updateRow({ id, present: checked, type }));
    } else if (type === "leave") {
      dispatch(updateRow({ id, leave: checked, type }));
    } else if (type === "holiday") {
      dispatch(updateRow({ id, holiday: checked, type }));
    }
  };

  if (!timesheet) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="100" />
      </div>
    );
  }

  if (timesheet.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>No data available</p>
      </div>
    );
  }

  const firstDayOfYear = new Date(timesheet[0]?.date)?.getDay();
  const lastDayOfYear = new Date(
    timesheet[timesheet.length - 1]?.date
  )?.getDay();

  let preMonthPadding = [];
  for (let i = 0; i < firstDayOfYear; i++) {
    preMonthPadding.push({
      date: null,
    });
  }

  let postMonthPadding = [];
  for (let i = lastDayOfYear + 1; i < 7; i++) {
    postMonthPadding.push({
      date: null,
    });
  }

  const calendar = preMonthPadding.concat(timesheet, postMonthPadding);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="1/7">SUN</TableHead>
          <TableHead className="1/7">MON</TableHead>
          <TableHead className="1/7">TUE</TableHead>
          <TableHead className="1/7">WED</TableHead>
          <TableHead className="1/7">THU</TableHead>
          <TableHead className="1/7">FRI</TableHead>
          <TableHead className="1/7">SAT</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {calendar.map((_, index) => {
          if (index % 7 === 0) {
            return (
              <TableRow key={uuidv4()}>
                {calendar.slice(index, index + 7).map((row) => (
                  <DateCell
                    row={row}
                    key={uuidv4()}
                    checkboxChangeHandler={checkboxChangeHandler}
                  />
                ))}
              </TableRow>
            );
          }
          return null;
        })}
      </TableBody>
    </Table>
  );
};
