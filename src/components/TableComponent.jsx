import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; 

/**
 * A generic reusable table component that uses the render prop pattern
 * for flexible row rendering.
 *
 * @param {object} props - The component props.
 * @param {Array<object>} props.data - The array of data items to display in the table.
 * @param {Array<string>} props.headers - An array of strings for the table header names.
 * @param {string} [props.caption] - Optional caption for the table.
 * @param {function(object, number): React.ReactNode} props.renderRow - A render prop function that takes an item and its index,
 * and should return a <TableRow> component with its content. This function will receive
 * additional context props as specified by the consumer.
 * @param {React.ReactNode} [props.noDataContent] - Content to display when data is empty.
 * @param {number} [props.colSpanForNoData] - The number of columns to span for the noDataContent cell.
 * @param {object} [props.renderRowProps] - Additional props to pass to the renderRow function.
 */

const TableComponent = ({
  data,
  headers,
  caption,
  renderRow,
  noDataContent,
  colSpanForNoData,
  renderRowProps = {},
}) => {
  return (
    <Table>
      {caption && <TableCaption>{caption}</TableCaption>}
      <TableHeader>
        <TableRow>
          {headers.map((header, index) => (
            <TableHead
              key={index}
              className="text-muted-foreground text-center"
            >
              {header.toUpperCase()}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data && data.length > 0 ? (
          data.map((item, index) => renderRow(item, index, renderRowProps))
        ) : (
          <TableRow>
            <TableCell
              colSpan={colSpanForNoData || headers.length}
              className="h-24 text-center"
            >
              {noDataContent || "No data found."}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default TableComponent;
