// import {
//   type MRT_ColumnFiltersState,
//   type MRT_SortingState,
// } from "material-react-table";
// import { type NextApiRequest, type NextApiResponse } from "next";
// import axios from "axios";

// import { Log } from "@/types";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const { start, size, filters, sorting, globalFilter } = req.query as Record<
//     string,
//     string
//   >;
//   console.log({ start, size, filters, sorting, globalFilter });

//   const response = (await axios.get("")).data;
//   let dbData: Log[] = response.logs;
//   const total = response.total;

//   const parsedColumnFilters = JSON.parse(filters) as MRT_ColumnFiltersState;
//   if (parsedColumnFilters?.length) {
//     parsedColumnFilters.map((filter) => {
//       const { id: columnId, value: filterValue } = filter;
//       dbData = dbData.filter((row) => {
//         return row[columnId as keyof Log]
//           ?.toString()
//           ?.toLowerCase()
//           ?.includes?.((filterValue as string).toLowerCase());
//       });
//     });
//   }

//   if (globalFilter) {
//     dbData = dbData.filter((row) =>
//       Object.keys(row).some((columnId) =>
//         row[columnId as keyof Log]
//           ?.toString()
//           ?.toLowerCase()
//           ?.includes?.((globalFilter as string).toLowerCase())
//       )
//     );
//   }

//   const parsedSorting = JSON.parse(sorting) as MRT_SortingState;
//   if (parsedSorting?.length) {
//     const sort = parsedSorting[0];
//     const { id, desc } = sort;
//     dbData.sort((a, b) => {
//       if (desc) {
//         return a[id as keyof Log] < b[id as keyof Log] ? 1 : -1;
//       }
//       return a[id as keyof Log] > b[id as keyof Log] ? 1 : -1;
//     });
//   }

//   res.status(200).json({
//     data:
//       dbData?.slice(parseInt(start), parseInt(start) + parseInt(size)) ?? [],
//     meta: { totalRowCount: dbData.length },
//   });
// }
