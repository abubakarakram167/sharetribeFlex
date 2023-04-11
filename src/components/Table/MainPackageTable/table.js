import { Table } from 'antd';
import React from 'react';
import Button from '../../../components/Button/Button';
import css from './table.module.css';

const App = props => {
  const mainTableColumns = [
    {
      title: 'ITEMS',
      dataIndex: 'name',
      width: '50%',
      render: (_, record) => {
        return <span>{record.name}</span>;
      },
      editable: true,
    },
    {
      title: 'QTY',
      dataIndex: 'quantity',
      editable: true,
    },
    {
      title: 'TOTAL',
      dataIndex: 'total',
      editable: true,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      width: '20%',
      render: (_, record) => {
        return (
          <Button
            onClick={() => {
              props.onEdit(record.key);
            }}
            className={css.editButton}
          >
            Edit
          </Button>
        );
      },
    },
  ];

  return <Table columns={mainTableColumns} dataSource={props.data} pagination={false} />;
};

export default App;
