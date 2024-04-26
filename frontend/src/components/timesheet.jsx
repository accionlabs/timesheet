import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { LoadingSpinner } from "./loading-spinner";

import dateService from "@/services/date.service";

import { updateRow } from "@/reducers/timesheet.reducer";

const Row = ({ row, checkboxChangeHandler, textareaChangeHandler }) => {
  const dateId = new Date(row?.date)?.toDateString().replace(/\s/g, "-");

  useEffect(() => {
    if (window.location.hash.substring(1) === dateId) {
      document.getElementById(dateId)?.scrollIntoView();
    }
  }, []);

  return (
    <TableRow id={dateId} className="border-b border-gray-400">
      <TableCell className="font-medium">
        <p>{dateService.getDateAsString(row.date)}</p>
        <p>{row.holiday ? row.holiday_reason : ""}</p>
      </TableCell>
      <TableCell className="grid grid-cols-1 grid-rows-3 gap-4">
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
      <TableCell>
        <Textarea
          id={`notes-${dateId}`}
          className="border-gray-400"
          onBlur={(event) => textareaChangeHandler(event, row.id)}
          defaultValue={row.notes}
          disabled={row.locked}
        />
      </TableCell>
    </TableRow>
  );
};

export const Timesheet = () => {
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

  const textareaChangeHandler = (event, id) => {
    dispatch(updateRow({ id, notes: event.target.value, type: "notes" }));
  };

  if (!timesheet) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="100" />
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-1/4">Date</TableHead>
          <TableHead className="w-1/4">Status</TableHead>
          <TableHead className="w-1/2">Notes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {timesheet.length !== 0 ? (
          timesheet.map((row) => (
            <Row
              key={row.id}
              row={row}
              checkboxChangeHandler={checkboxChangeHandler}
              textareaChangeHandler={textareaChangeHandler}
            />
          ))
        ) : (
          <TableRow>
            <TableCell colSpan="3" className="text-center">
              No data available
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
