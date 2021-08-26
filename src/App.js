import './App.css';
import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import 'antd/dist/antd.css';
import RedirectScreen from './screens/RedirectScreen'
import ResponseScreen from './screens/ResponseScreen'
import { Input, Radio, DatePicker, Checkbox, Spin, Divider, Typography } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
const { Title, Paragraph } = Typography;
// const BUILD_ENV = process.env.REACT_APP_BUILD_ENV || "any-default-local-build_env";

function App() {
  const [isPublic, setIsPublic] = React.useState(1);
  const [expirationDate, setExpirationDate] = React.useState("3000-10-10");
  const [link, setLink] = React.useState("");
  const [shortLink, setShortLink] = React.useState("");
  const [isDatepickerDisabled, setIsDatepickerDisabled] = React.useState(true);
  const [isDone, setIsDone] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const onChangePublic = e => {
    setIsPublic(e.target.value);
  };

  const onChangeHasExpirationDate = e => {
    setIsDatepickerDisabled(e.target.checked)
  }

  const onChange = (e) => {
    setLink(e.target.value)
  }

  const onPressEnter = (e) => {
    setIsLoading(true)
    callAPI()
  }

  const onChangeDatePicker = (date, dateString) => {
    setExpirationDate(dateString)
  }

  const callAPI = () => {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "isPublic": isPublic,
      "expirationDate": expirationDate,
      "longLink": link
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    }

    fetch(process.env.REACT_APP_DB, requestOptions)
      .then(response => response.text())
      .then(result => {
        console.log("xx")
        console.log(JSON.parse(result).body)
        setShortLink(JSON.parse(result).body)
        setIsDone(true)
      })
      .catch(error => console.log('error', error));
  }

  return (
    <Router>
      <div className="App">
        <div className="center-wrapper">
          <Switch>
            <Route path="/:id">
              <RedirectScreen />
            </Route>
            <Route exact path="/">
              {isDone ? <ResponseScreen shortlink={shortLink} /> : <>
                <Typography>
                  <Title>URL SHORTENER</Title>
                  <Paragraph>
                    YEP, that's exactly what this is - a URL shortener service. Simply give us your long link and we give you a shorter one back. It really is that easy.
                  </Paragraph>
                </Typography>
                <Divider />
                <Spin spinning={isLoading} delay={500}><form id="myForm" onSubmit={onPressEnter}>
                  <Input onChange={onChange} onPressEnter={onPressEnter} size="large" placeholder="Paste long URL and shorten it!" prefix={<LinkOutlined />} />
                  <div className="spacer"></div>
                  <div className="settings-wrapper">
                    <div style={{ alignSelf: "center" }}>
                      <Radio.Group onChange={onChangePublic} value={isPublic}>
                        <Radio value={1}>Public</Radio>
                        <Radio value={0}>Private</Radio>
                      </Radio.Group>
                    </div>
                    <div>
                      <Checkbox defaultChecked onChange={onChangeHasExpirationDate}>Never Expire</Checkbox>
                      <DatePicker
                        onChange={onChangeDatePicker}
                        disabled={isDatepickerDisabled}
                        placeholder="Expiration date"
                        disabledDate={(current) => {
                          return current.valueOf() < Date.now();
                        }}
                        bordered={false}
                      />
                    </div>
                  </div>
                </form>
                </Spin></>}
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
