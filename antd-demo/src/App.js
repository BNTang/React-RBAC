import {Button, Switch} from 'antd';

function App() {
    const onChange = (checked: boolean) => {
        console.log(`switch to ${checked}`);
    };
    return (
        <>
            <Button type="primary">Primary Button</Button>
            <Button>Default Button</Button>
            <Button type="dashed">Dashed Button</Button>
            <Button type="text">Text Button</Button>
            <Button type="link">Link Button</Button>
            <Switch defaultChecked onChange={onChange}/>
        </>
    );
}

export default App;
