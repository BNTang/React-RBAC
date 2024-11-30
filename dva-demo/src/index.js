import dva, {connect} from 'dva';

const app = dva();

let homeModel = {
    namespace: 'home',
    state: {
        count: 666,
        info: {}
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
        },
        // {type: 'changeInfo', info: data}
        changeInfo: (state, action) => {
            return {
                ...state,
                info: action.info
            }
        }
    },
    effects: {
        // {type: 'asyncUserInfo', info: data}
        * asyncUserInfo(state, {put}) {
            // 获取网络数据
            const data = yield fetch('http://localhost:4000/api/data')
                .then((response) => {
                    return response.json();
                })
                .catch((error) => {
                    console.log(error);
                });
            yield put({type: 'changeInfo', info: data.data});
        },
    },
    subscriptions: {
        setup({history, dispatch}) {
            console.log('setup被执行了');
            return history.listen(({pathname}) => {
                document.title = pathname
            });
        },
        change() {
            console.log('change被执行了');
        },
    },
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
        // 需要从传入的 state 的命名空间中拿到对应 Model 保存的数据
        count: state.home.count,
        info: state.home.info
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        increment() {
            dispatch({type: 'home/add', count: 1});
        },
        decrement() {
            dispatch({type: 'home/sub', count: 1});
        },
        getUserInfo() {
            dispatch({type: 'home/asyncUserInfo'});
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
            <hr/>
            <div>dva异步处理</div>
            <p>{props.info.name}</p>
            <p>{props.info.role}</p>
            <button onClick={() => {
                props.getUserInfo()
            }}>获取
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
