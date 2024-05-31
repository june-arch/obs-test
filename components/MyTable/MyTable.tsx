import {
  Group,
  Select,
  Input,
  Table,
  LoadingOverlay,
  Loader,
  Pagination,
  Text,
  useMatches,
} from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import { RankingInfo, rankItem } from '@tanstack/match-sorter-utils';
import {
  FilterFn,
  ColumnDef,
  PaginationState,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import React, { useEffect } from 'react';

declare module '@tanstack/react-table' {
  //add fuzzy filter to the filterFns
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

function MyTable<T>({
  data,
  columns,
  isPending,
}: {
  data: T[];
  columns: ColumnDef<T>[];
  isPending: boolean;
}) {
  const [search, setSearch] = useDebouncedState('', 500);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    //no need to pass pageCount or rowCount with client-side pagination as it is calculated automatically
    state: {
      pagination,
      globalFilter: search,
    },
    filterFns: {
      fuzzy: fuzzyFilter, //define as a filter function that can be used in column definitions
    },
    onGlobalFilterChange: setSearch,
    globalFilterFn: 'fuzzy',
    // autoResetPageIndex: false, // turn off page index reset when sorting or filtering
  });

  useEffect(() => {
    table.getState().columnFilters;
  }, [search]);

  return (
    <>
      <Group justify={useMatches({ base: 'center', md: 'space-between' })}>
        <Group mb={useMatches({ base: '', md: 'lg' })}>
          <Text mr="2px">Page Limit</Text>
          <Select
            value={table.getState().pagination.pageSize.toString()}
            w={70}
            onChange={(e) => {
              table.setPageSize(Number(e));
            }}
            data={['5', '10', '25', '50']}
          />
        </Group>
        <Input
          placeholder="Input Search .."
          rightSection={<IconSearch size={16} />}
          defaultValue={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          mb="lg"
        />
      </Group>
      <Table.ScrollContainer minWidth={1100}>
        <Table striped highlightOnHover withColumnBorders>
          <Table.Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Table.Th
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      minWidth: header.getSize() ? header.getSize() : 0,
                    }}
                  >
                    <div
                      className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
                      tabIndex={header.column.getCanSort() ? 0 : undefined}
                      role="button"
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: ' 🔼',
                        desc: ' 🔽',
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </Table.Th>
                ))}
              </Table.Tr>
            ))}
          </Table.Thead>
          <Table.Tbody>
            {isPending && (
              <Table.Tr>
                <Table.Th>
                  <LoadingOverlay
                    visible={isPending}
                    loaderProps={{ children: <Loader size={30} /> }}
                  />
                </Table.Th>
              </Table.Tr>
            )}
            {table.getRowModel().rows.map((row) => (
              <Table.Tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Table.Td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Table.Td>
                ))}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      <Group justify={useMatches({ base: 'center', md: 'space-between' })}>
        <div>
          Showing {table.getRowModel().rows.length.toLocaleString()} of{' '}
          {table.getRowCount().toLocaleString()} Rows
        </div>
        <Pagination.Root
          value={table.getState().pagination.pageIndex + 1}
          onChange={(e) => {
            table.setPageIndex(Number(e - 1));
          }}
          total={table.getPageCount()}
        >
          <Group gap={5} justify="center">
            <Pagination.First
              onClick={() => table.firstPage()}
              disabled={!table.getCanPreviousPage()}
            />
            <Pagination.Previous
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            />
            <Pagination.Items />
            <Pagination.Next onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} />
            <Pagination.Last onClick={() => table.lastPage()} disabled={!table.getCanNextPage()} />
          </Group>
        </Pagination.Root>
      </Group>
    </>
  );
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

export default MyTable;
