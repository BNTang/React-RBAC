import dva, {connect} from 'dva';
import {Router, Route, Link, routerRedux} from 'dva/router'
import createHistory from 'history/createBrowserHistory';
import createLogger from 'redux-logger';

const app = dva({
    history: createHistory(),
    initialState: {
        home: {
            count: 777,
            info: {
                name: 'NEO-IT666'
            }
        },
    },
    onError: (error, dispatch) => {
        console.error('全局错误：', error);
        alert('全局错误：' + error.message);
    },
    onAction: createLogger
});

let homeModel = {
    namespace: 'home',
    state: {
        count: 666,
        info: {}
    },
    reducers: {
        add: (state, action) => {
            return {
                ...state,
                count: state.count + action.count
            }
        },
        sub: (state, action) => {
            return {
                ...state,
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
            try {
                const response = yield fetch('http://localhost:4000/api/data');
                const data = yield response.json();
                yield put({type: 'changeInfo', info: data.data});
            } catch (error) {
                console.log('effects error', error);
                // 如果需要在这里就处理完错误，阻止 onError 触发
                // 可以返回一个默认值
                yield put({type: 'changeInfo', info: {name: '获取数据失败'}});
            }
        },
    },
    subscriptions: {
        setup({history, dispatch}) {
            console.log('setup被执行了');
            return history.listen(({pathname}) => {
                document.title = pathname
            });
        },
        change({history, dispatch}, done) {
            console.log('change被执行了');
            // done(new Error('自定义错误'));
        },
    },
}
let aboutModel = {
    namespace: 'about',
    state: {
        count: 123
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
        },
        goToAbout() {
            dispatch(routerRedux.push('/about'));
        },
    }
};

function Home(props) {
    return (
        <div>
            <p>{props.count}</p>
            <p>{props.info.name}</p>
            <button onClick={() => {
                props.increment()
            }}>+
            </button>
            <button onClick={() => {
                props.decrement()
            }}>-
            </button>
            <hr/>
            <button onClick={() => {
                props.goToAbout()
            }}>
                跳转到 About
            </button>
            <hr/>
            <button onClick={() => {
                props.getUserInfo()
            }}>
                获取
            </button>
        </div>
    )
}

const AdvHome = connect(mapStateToProps, mapDispatchToProps)(Home);

function About(props) {
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
            <button onClick={() => {
                props.goToHome()
            }}>
                返回上一页
            </button>
        </div>
    )
}

const mapStateToPropsAbout = (state) => {
    return {
        // 需要从传入的 state 的命名空间中拿到对应 Model 保存的数据
        count: state.about.count,
    }
};
const mapDispatchToPropsAbout = (dispatch) => {
    return {
        increment() {
            dispatch({type: 'about/add', count: 2});
        },
        decrement() {
            dispatch({type: 'about/sub', count: 2});
        },
        goToHome() {
            dispatch(routerRedux.goBack());
        },
    }
};
const AdvAbout = connect(mapStateToPropsAbout, mapDispatchToPropsAbout)(About);

function App(props) {
    return (
        <Router history={props.history}>
            <>
                <Link to="/home">Home</Link>
                <Link to="/about">About</Link>
                <Route path={'/home'} component={AdvHome}/>
                <Route path={'/about'} component={AdvAbout}/>
            </>
        </Router>
    );
}

app.router(({history}) => <App history={history}/>);
app.start('#root');
