import './App.css';
import React, { useEffect } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams
} from "react-router-dom";
import 'antd/dist/antd.css';
import { Input, Radio, DatePicker, Checkbox, Typography, Card, Alert, Spin } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
const { Paragraph, Link } = Typography;
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
              {isDone ? <ResponseScreen shortlink={shortLink} /> : <Spin spinning={isLoading} delay={500}><form id="myForm" onSubmit={onPressEnter}>
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
              </Spin>}
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

function ResponseScreen(props) {
  const [isClicked, setIsClicked] = React.useState(false);

  const cardStyle = {
    boxShadow: "5px 8px 24px 5px rgba(208, 216, 243, 0.3)"
  }

  function clicked() {
    setIsClicked(true)
  }

  return (
    <Card style={cardStyle} title="You did it!" style={{ width: '100%' }}>
      <p>Click on the Icon to copy your link.</p>
      <Link href={props.shortlink} target="_blank">
        <Paragraph onClick={clicked} code copyable>
          {props.shortlink}
        </Paragraph>
      </Link >
      {isClicked && <Alert
        message="Successfully Copied"
        description="You have successfully copied your link."
        type="success"
        showIcon
      />}

    </Card>
  )
}

function RedirectScreen() {
  const [link, setLink] = React.useState("http://www.google.de");

  let { id } = useParams();

  useEffect(() => {
    callAPIGetLink()
    // window.location.assign(link)
  }, []);

  const callAPIGetLink = () => {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "id": id
    });

    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    }

    fetch(process.env.REACT_APP_DB, requestOptions)
      .then(response => response.text())
      .then(result => {
        console.log("dd")
        console.log(JSON.parse(result).body)
        // console.log(JSON.parse(result).Item.longLink)
        let body = JSON.parse(result).body
        let item = JSON.parse(body).Item
        console.log(item.longLink)
        // setLink(JSON.parse(result).Item.longLink)
      })
      .catch(error => console.log('error', error));
  }

  return (
    <div>hi!</div>
  )
}

export default App;
