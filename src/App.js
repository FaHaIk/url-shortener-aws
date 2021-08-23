import './App.css';
import React from 'react'
import 'antd/dist/antd.css';
import { Input, Radio, DatePicker, Checkbox } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

function App() {
  const [visibility, setVisibility] = React.useState(1);
  const [isDatepickerDisabled, setIsDatepickerDisabled] = React.useState(true);

  const onChangeVisibility = e => {
    console.log('radio checked', e.target.value);
    setVisibility(e.target.value);
  };

  const onChangeHasExpirationDate = e => {
    setIsDatepickerDisabled(e.target.checked)
  }

  return (
    <div className="App">
      <div className="center-wrapper">
        <Input size="large" placeholder="Paste long URL and shorten it!" prefix={<SearchOutlined />} />
        <div className="spacer"></div>
        <div className="settings-wrapper">
          <div style={{ alignSelf: "center" }}>
            <Radio.Group onChange={onChangeVisibility} value={visibility}>
              <Radio value={1}>Public</Radio>
              <Radio value={2}>Private</Radio>
            </Radio.Group>
          </div>
          <div>
            <Checkbox defaultChecked onChange={onChangeHasExpirationDate}>Never Expire</Checkbox>
            <DatePicker
              disabled={isDatepickerDisabled}
              placeholder="Expiration date"
              disabledDate={(current) => {
                return current.valueOf() < Date.now();
              }}
              bordered={false}
            />
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
