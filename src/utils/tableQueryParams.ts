

import type { GetProp, TableProps } from "antd";


type ColumnsType<T> = TableProps<T>["columns"];
type TablePaginationConfig = Exclude<
  GetProp<TableProps, "pagination">,
  boolean
>;


export interface TableParams {
    pagination?: TablePaginationConfig;
    sortField?: string;
    sortOrder?: string;
    filters?: Parameters<GetProp<TableProps, "onChange">>[1];
  }



export const getQueryParams = (params: TableParams) => {
    const queryParams = {
      per_page: params.pagination?.pageSize,
      page: params.pagination?.current,
      ...params.filters,
    };
    return queryParams;
    // ...params,
};