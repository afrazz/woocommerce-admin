export interface OrdersListDataType {
    id: number;
    currency: string,
    billing: {
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
    };
    date_created: string;
    total: number;
    status: string;
    line_items: [{}];
  }  