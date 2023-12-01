import xlsx, { IJsonSheet } from "json-as-xlsx";

export function downloadToExcel(data: any) {
  let columns: IJsonSheet[] = [
    {
      sheet: "Products",
      columns: [
        { label: "Product ID", value: "id" },
        { label: "Product Image", value: "images" },
        { label: "Product Name", value: "title" },
        { label: "Product Description", value: "description" },
        { label: "Product Category", value: "category" },
        { label: "Product Status", value: "productStatus" },
        { label: "Product Inventory", value: "quantity" },
        { label: "Product Price", value: "price" },
      ],
      content: data,
    },
  ];

  let settings = {
    fileName: "Products Excel",
  };

  xlsx(columns, settings);
}
