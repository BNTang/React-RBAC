import dva, {connect} from 'dva';

const app = dva();

let homeModel = {
    namespace: 'home',
    state: {
        count: 666
    },
    reducers: {
        add: (state, action) => {
            return {
                count: state.count + action.count
            }
        },
        sub: (state, action) => {
            return {
                count: state.count - action.count
            }
        }
    }
}
let aboutModel = {
    namespace: 'about',
    state: {
        num: 0
    },
    reducers: {
        add: (state, action) => {
            return {
                num: state.num + action.num
            }
        },
        sub: (state, action) => {
            return {
                num: state.num - action.num
            }
        }
    }
}

app.model(homeModel);
app.model(aboutModel);

const mapStateToProps = (state) => {
    return {
        count: state.home.count
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        increment() {
            dispatch({type: 'home/add', count: 1});
        },
        decrement() {
            dispatch({type: 'home/sub', count: 1});
        }
    }
};

function Home(props) {
    return (
        <div>
            <p>{props.count}</p>
            <button onClick={() => {
                props.increment()
            }}>+
            </button>
            <button onClick={() => {
                props.decrement()
            }}>-
            </button>
        </div>
    )
}
const AdvHome = connect(mapStateToProps, mapDispatchToProps)(Home);

function App() {
    return (
        <div>
            <AdvHome/>
        </div>
    );
}

app.router(() => <App/>);
app.start('#root');
