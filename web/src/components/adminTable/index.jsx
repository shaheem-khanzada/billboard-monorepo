import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import Form from 'react-bootstrap/Form';

import { useAdvertisement } from '../../hooks/useAdvertisement';
import { useUpdateAdvertisement } from '../../hooks/useUpdateAdvertisement';
import { ImageCellRenderer } from './components/ImageRenderer';
import { WebsiteRenderer } from './components/WebsiteRenderer';
import { Button, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useUpdateTotalSupply } from '../../hooks/useUpdateTotalSupply';


const cellStyle = { display: 'flex', alignItems: 'center' };

const AdminTable = () => {
  const { data } = useAdvertisement();
  const { mutate } = useUpdateAdvertisement();
  const { mutate: updateTotalSupply, isPending: isUpdatingSupply } = useUpdateTotalSupply();
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    if (data?.advertisements) {
      setRowData(data.advertisements);
    }
  }, [data]);

  const columnDefs = useMemo(() => [
    {
      field: "image",
      headerName: "Image",
      cellRenderer: ImageCellRenderer
    },
    {
      field: "tokenId",
      headerName: "Token ID",
      cellStyle
    },
    {
      field: "metadata",
      headerName: "Website",
      cellStyle,
      cellRenderer: WebsiteRenderer
    },
    {
      field: "industry",
      headerName: "Industry",
      cellStyle,
      valueGetter: (params) => params.data.metadata?.attributes?.[0].value || '-',
    },
    {
      field: "name",
      headerName: "Name",
      cellStyle,
      valueGetter: (params) => params.data?.metadata?.name || '-'
    },
    {
      field: "description",
      headerName: "Description",
      cellStyle,
      valueGetter: (params) => params.data?.metadata?.description || '-',
      tooltipValueGetter: (params) => params.data?.metadata?.description || '',
    },
    {
      field: "price",
      headerName: "Price",
      editable: (params) => !params.data.isMinted,
      cellStyle
    },
    {
      field: "isFreeMint",
      headerName: "Free Mint",
      editable: (params) => !params.data.isMinted,
      cellStyle,
      cellEditor: 'agSelectCellEditor',
    },
    {
      field: "isApproved",
      headerName: "Approved",
      editable: (params) => params.data.isMinted,
      cellStyle,
      cellEditor: 'agSelectCellEditor',
    },
    { field: "isMinted", headerName: "Minted", cellStyle },
  ], []);

  const defaultColDef = useMemo(() => ({
    flex: 1,
    resizable: true,
    sortable: true,
  }), []);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({ defaultValues: { totalSupply: '' } });

  useEffect(() => {
    if (data?.totalSupply) {
      setValue('totalSupply', data.totalSupply);
    }
  }, [data, setValue]);

  const getRowId = useCallback(params => params?.data?._id, []);

  const handleCellValueChange = useCallback((e) => {
    const { tokenId, isApproved, isFreeMint, price } = e.data;
    const payload = {
      isApproved,
      isFreeMint,
      price
    };
    mutate({ tokenId, payload });
  }, [mutate]);

  const onSubmit = ({ totalSupply }) => {
    console.log("totalSupply", totalSupply);
    updateTotalSupply(totalSupply);
  }

  return (
    <div className="ag-theme-alpine" style={{ width: '100%', height: 'calc(100vh - 150px)' }}>
      <Form className="mb-3" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }} onSubmit={handleSubmit(onSubmit)}>
        <Form.Group controlId="totalSupply">
          <Form.Control {...register("totalSupply", { required: "TotalSupply is required" })} type="number" placeholder="Total Supply" isInvalid={!!errors.totalSupply} />
        </Form.Group>
        <Button type='submit'>
          {isUpdatingSupply ? (
            <Spinner size='sm' animation="border" role="status" style={{ marginRight: 5 }} />
          ) :
            "Update Supply"
          }
        </Button>
      </Form>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        getRowId={getRowId}
        rowHeight={100}
        onCellValueChanged={handleCellValueChange}
      />
    </div>
  );
};

export default AdminTable;
