import './App.css';
import React from 'react'
import 'antd/dist/antd.css';
import { Input, Radio, DatePicker, Checkbox } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const BUILD_ENV = process.env.REACT_APP_BUILD_ENV || "any-default-local-build_env"; 

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

  const Enter = e => {
    callAPI()
  }

  const callAPI = () => {
    // instantiate a headers object
    var myHeaders = new Headers();
    // add content type header to object
    myHeaders.append("Content-Type", "application/json");
    // using built in JSON utility package turn object to string and store in a variable
    var raw = JSON.stringify({
      "isPublic": "1",
      "expirationDate": "12.06.000",
      "longLink": "https://www.barnicles.net"
    });
    // create a JSON object with parameters for API call and store in a variable
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    // make API call with parameters and use promises to get response
    fetch(process.env.REACT_APP_DB, requestOptions)
      .then(response => response.text())
      .then(result => alert(JSON.parse(result).body))
      .catch(error => console.log('error', error));
  }

  return (
    <div className="App">
      <div className="center-wrapper">
        <Input onPressEnter={Enter} size="large" placeholder="Paste long URL and shorten it!" prefix={<SearchOutlined />} />
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
