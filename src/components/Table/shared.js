import React from 'react';


const defaultColumns = [
    {
        title: 'ITEMS',
        dataIndex: 'name',
        width: '50%',
        render: (_, record) =>{
            if(record.isService)
                return <span className='service-title' >{ record.name}</span>
            else
                return <span>{ record.name}</span>
        },
        editable: true,
    },
    {
        title: 'QTY',
        dataIndex: 'quantity',
        editable: true,
    },
    {
        title: 'UNIT',
        dataIndex: 'unit',
        editable: true,
    },
    {
        title: 'PRICE',
        dataIndex: 'price',
        editable: true
    },
    {
        title: 'TOTAL',
        dataIndex: 'total',
        editable: true,
    }
];



export { defaultColumns }