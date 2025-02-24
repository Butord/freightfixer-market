
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImagePlus, Pencil, Trash2 } from "lucide-react";

interface DataTableProps<T> {
  data: T[];
  columns: {
    header: string;
    key: keyof T | 'actions';
    render?: (item: T) => React.ReactNode;
  }[];
  onEdit: (item: T) => void;
  onDelete: (id: number) => void;
}

export function DataTable<T extends { id: number }>({ 
  data, 
  columns,
  onEdit,
  onDelete,
}: DataTableProps<T>) {
  return (
    <Card className="p-6">
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th key={String(column.key)} scope="col" className="px-6 py-3">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.map((item) => (
              <tr key={item.id} className="bg-white border-b">
                {columns.map((column) => (
                  <td key={String(column.key)} className="px-6 py-4">
                    {column.key === 'actions' ? (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(item)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => onDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : column.render ? (
                      column.render(item)
                    ) : (
                      String(item[column.key])
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
