import React from 'react'
import { Card, Typography, Alert } from 'antd';
const { Paragraph, Link } = Typography;

export default function ResponseScreen(props) {
    const [isClicked, setIsClicked] = React.useState(false);

    const cardStyle = {
        boxShadow: "5px 8px 24px 5px rgba(208, 216, 243, 0.3)",
        width: '100%'
    }

    function clicked() {
        setIsClicked(true)
    }

    return (
        <Card style={cardStyle} title="You did it!">
            <p>Click on the Icon to copy your link.</p>
            <Link href={props.shortlink} target="_blank">
                <Paragraph onClick={clicked} code copyable>
                    {props.shortlink}
                </Paragraph>
            </Link >
            {isClicked && <Alert
                closable
                message="Successfully Copied"
                description="You have successfully copied your link."
                type="success"
                showIcon
            />}
            <Link href="/" target="_self">
                Go to Homepage
            </Link >

        </Card>
    )
}