import React, { useEffect } from 'react'
import { Card, Space, Typography, Alert, Skeleton } from 'antd';
import {
    useParams
} from "react-router-dom";
const { Link } = Typography;

export default function RedirectScreen() {
    const [notFound, setNotFound] = React.useState(false);

    let { id } = useParams();

    useEffect(() => {
        callAPIGetLink()
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
                let body = JSON.parse(result).body
                let item = JSON.parse(body).Item
                // setLink(item.longLink)
                window.location.assign(item.longLink)
            })
            .catch(error => {
                console.log('error', error)
                setNotFound(true)
            });
    }

    let errorTxt = "No entry found with the id " + id + "."

    return (
        <>
            {!notFound ? <Skeleton active /> :
                <Card title="Sorry, there is nothing to see!" style={{ width: '100%' }}>
                    <Link href="/" target="_self">
                        Go to Homepage.
                    </Link >
                    <Space direction="vertical" size="large"></Space>
                    <Alert
                        message="Entry not found"
                        description={errorTxt}
                        type="error"
                        showIcon
                    />
                </Card>
            }
        </>
    )
}