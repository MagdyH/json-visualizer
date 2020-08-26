import React from 'react';
import './App.css';
import Uploader from './components/uploader';
import store from "./redux/store";
import { Provider } from "react-redux";
import Tree from './components/tree';


function App() {
  return (
    <Provider store={store}>
      <div style={{ marginTop: "20px" }} className={'container-fluid'}>
        <div className={'row'}>
          <div className={'col-6'}>
            {<Tree />}
          </div>
          <div className={'col-4'}>
            <Uploader />
          </div>
        </div>
      </div>
    </Provider>

  );
}

export default App;
