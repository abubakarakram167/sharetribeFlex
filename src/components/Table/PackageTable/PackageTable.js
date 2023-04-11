import { Form, Input, Table } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import './PackageTable.css';
import { defaultColumns } from '../shared';
import Button from '../../Button/Button';

const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);
  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };
  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };
  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};
const App = props => {
  const [dataSource, setDataSource] = useState(
    props.packages.filter(packageData => packageData.parentKey === props.parentKey)
  );
  const [count, setCount] = useState(2);
  const handleDelete = key => {
    const newData = dataSource.filter(item => item.key !== key);
    setDataSource(newData);
  };

  const handleAdd = () => {
    let newData = {
      key: 12 + Math.floor(Math.random() * 500),
      name: '',
      quantity: 0,
      unit: 0,
      price: 0,
      total: 0,
    };

    if (dataSource.length === 0) {
      newData.isService = false;
      newData.parentKey = newData.key; //this is to check for that item is added as major package or service.
    } else {
      newData.isService = true;
      newData.parentKey = props.parentKey;
    }

    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };
  const handleSave = row => {
    const newData = [...dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const columns = defaultColumns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: record => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <div>
      <Button onClick={() => props.onBack()} type="primary" className="custom-button transparent">
        Back to Packages
      </Button>
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={false}
      />
      <Button onClick={handleAdd} type="primary" className="custom-button transparent">
        + Add a new item
      </Button>
      <div className="footer-button">
        <Button className="custom-button transparent" onClick={() => props.onBack()} type="primary">
          Cancel
        </Button>
        <Button
          onClick={() => {
            props.onSave(dataSource);
          }}
          type="primary"
          className="custom-button save-button"
        >
          Save
        </Button>
      </div>
    </div>
  );
};
export default App;
