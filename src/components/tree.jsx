import React from 'react';
import { connect } from 'react-redux';
import SweetAlert from 'sweetalert2-react';
import ReactDOM from 'react-dom';
let JSONPath = require('jsonpath')

export class Tree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tree: {},
            message: '',
            showPopup: false,
            exprResult: null,
            exprPaths: null,
            childernNodes: { parentNode: {}, childern: [] },
            expandedList: []
        }
        this.nodes = [];
        this.handleOnNodeClick = this.handleOnNodeClick.bind(this)
    }

    renderTree(jsonData) {
        let treeView = [];
        let { exprResult, exprPaths } = this.state;

        if (Array.isArray(jsonData)) {
            let propertiesStr = '';
            let highlight = '';
            treeView = jsonData.map(_node => {
                if (Array.isArray(_node)) {
                    return (<><ul>
                        {_node.map(child => {
                            return (
                                this.renderTree(child)
                            )
                        })}
                    </ul></>)
                }
                else {
                    propertiesStr = '';
                    let isExpanded = null;
                    let nodes = Object.keys(_node).map(_key => {
                        isExpanded = (exprResult && exprPaths && this.isJSONPathMatchWithKey(_key));
                        if (Array.isArray(_node[_key]) || (typeof _node[_key] === 'object' && _node[_key].constructor === Object)) {
                            return (<><li Key={_key} ref={(ref) => this.nodes[_key] = ref}
                                onClick={(event) => this.handleOnNodeClick(_node[_key], isExpanded, event)}>
                                <span className={"icon plus" + (isExpanded ? " minus" : "")}></span>
                                {_key}
                            </li>
                                <ul>
                                    {isExpanded && (this.renderTree(_node[_key]))}
                                </ul></>)
                        }
                        else {
                            propertiesStr += `${_key}:${_node[_key]}`
                            propertiesStr += '\n';
                            if ((exprResult, exprPaths) && this.isJSONPathMatch(_node)) {
                                highlight = 'highlight'
                            }
                            else {
                                highlight = '';
                            }
                        }
                    })

                    if (propertiesStr !== '') {
                        nodes.unshift(<li className={`line-break ${highlight}`}>
                            <span className="icon plus"></span>
                            {propertiesStr}
                        </li>)
                        return nodes;
                    }
                }
            })
        }
        else if (typeof jsonData === 'object' && jsonData.constructor === Object) {
            let isExpanded = null;
            treeView = Object.keys(jsonData).map(_node => {
                isExpanded = (exprResult && exprPaths && this.isJSONPathMatchWithKey(_node));
                return (<>
                    <li key={_node} ref={(ref) => this.nodes[_node] = ref}
                        onClick={(event) => this.handleOnNodeClick(jsonData[_node], isExpanded, event)}>
                        <span className={"icon plus" + (isExpanded ? " minus" : "")}></span>
                        {_node}
                    </li>
                    <ul>
                        {isExpanded && (this.renderTree(jsonData[_node]))}
                    </ul>
                </>)
            })
        }
        return treeView;
    }

    handleOnNodeClick(node, isExpanded, event) {
        if (event.currentTarget.firstElementChild.className.endsWith('minus')) {
            event.currentTarget.firstElementChild.className = event.currentTarget.firstElementChild.className.replace('minus', '');
        }
        else {
            event.currentTarget.firstElementChild.className += ' minus'
        }

        if (event.currentTarget.nextElementSibling.className.includes('showChildern')) {
            event.currentTarget.nextElementSibling.className = event.currentTarget.nextElementSibling.className.replace('showChildern', '');
        }
        else {
            event.currentTarget.nextElementSibling.className = 'showChildern';
        }
        
        if (!event.currentTarget.firstElementChild.className.endsWith('minus')) {
            ReactDOM.render(null, event.currentTarget.nextElementSibling);       
        }
        else {
            let nodes = this.renderTree(node);
            ReactDOM.render(nodes, event.currentTarget.nextElementSibling);
        }
    }

    isJSONPathMatchWithKey(key) {
        let { exprPaths } = this.state;
        let isMatch = false;
        if (exprPaths) {
            for (let index = 0; index < exprPaths.length; index++) {
                if (JSON.stringify(exprPaths[index]).includes(key)) {
                    isMatch = true;
                }
            }
        }
        return isMatch;
    }

    isJSONPathMatch(values) {
        let { exprResult } = this.state;
        let isMatch = false;
        if (typeof values === 'string') {
            exprResult.forEach(expr => {
                if (JSON.stringify(expr).includes(values)) {
                    isMatch = true;
                }
            })
        }
        else {
            exprResult.forEach(expr => {
                if (Array.isArray(values)) {
                    let isExist = values.filter(val => JSON.stringify(val) === JSON.stringify(expr));
                    if (isExist.length > 0) {
                        isMatch = true;
                    }
                }
                else {
                    if (JSON.stringify(values) === JSON.stringify(expr)) {
                        isMatch = true;
                    }
                }
            })
        }
        return isMatch;
    }

    render() {
        return (
            <>
                <input className={'search-input'} placeholder=" enter a JSONPath expression" type="text" onKeyDown={(event) => {
                    if (event.key === "Enter") {
                        if (Object.keys(this.props.json).length > 0) {
                            let paths = JSONPath.paths(this.props.json, event.target.value);

                            var response = JSONPath.query(this.props.json, event.target.value)
                            if (response && response.length > 0) {
                                this.setState({
                                    exprResult: response,
                                    exprPaths: paths
                                })
                            }
                            else {
                                this.setState({ message: "No matchs for this expression", showPopup: true })
                            }
                            console.log(JSON.stringify(response))
                        }
                        else {
                            this.setState({ message: "Please upload JSON file first", showPopup: true })
                        }
                    }
                }} />
                <div className={'tree'}>
                    {this.renderTree(this.props.json)}
                </div>

                <SweetAlert
                    show={this.state.showPopup}
                    title="Warning"
                    text={this.state.message}
                    onConfirm={() => this.setState({ showPopup: false })}
                />
            </>
        )
    }
}

function mapStatetoProps({ uploadJSONReducer }) {
    return {
        json: uploadJSONReducer.json
    }
}

export default connect(mapStatetoProps, null)(Tree)