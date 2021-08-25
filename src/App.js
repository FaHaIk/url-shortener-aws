import './App.css';
import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";
import 'antd/dist/antd.css';
import { Input, Radio, DatePicker, Checkbox } from 'antd';
import { LinkOutlined } from '@ant-design/icons';

// const BUILD_ENV = process.env.REACT_APP_BUILD_ENV || "any-default-local-build_env";

function App() {
  const [isPublic, setIsPublic] = React.useState(1);
  const [expirationDate, setExpirationDate] = React.useState("3000-10-10");
  const [link, setLink] = React.useState("");
  const [shortLink, setShortLink] = React.useState("");
  const [isDatepickerDisabled, setIsDatepickerDisabled] = React.useState(true);
  const [isDone, setIsDone] = React.useState(false);

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
              <ResponseScreen />
            </Route>
            <Route exact path="/">
              {isDone ? <ResponseScreen shortlink={shortLink} /> : <form id="myForm" onSubmit={onPressEnter}>
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
              </form>}

            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

{/* <ResponseScreen shortlink={shortLink} /> */}
function ResponseScreen(props) {
  return (
    <div>{props.shortlink}</div>
  )
}

function RedirectScreen() {
  let { id } = useParams();
  return (
    <div>{id}</div>
  )
}

export default App;
