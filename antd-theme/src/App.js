import {Button, Switch} from 'antd';
import {ConfigProvider} from 'antd';

function App() {
    const onChange = (checked: boolean) => {
        console.log(`switch to ${checked}`);
    };
    return (
        <ConfigProvider theme={{
            token: {
                colorPrimary: '#00b96b',
                colorLink: '#00b96b',
            }
        }}>
            <Button type="primary">Primary Button</Button>
            <Button>Default Button</Button>
            <Button type="dashed">Dashed Button</Button>
            <Button type="text">Text Button</Button>
            <Button type="link">Link Button</Button>
            <Switch defaultChecked onChange={onChange}/>
        </ConfigProvider>
    );
}

export default App;
