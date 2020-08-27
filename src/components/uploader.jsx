import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import uploadJsonActions from '../redux/actions/uploadJSON'


export function Uploader(props) {

    return (
            <div className="container-input">
                <div className='button-wrap'>
                    <label className='new-button' htmlFor='upload'> Upload JSON file  </label>
                    <input id='upload' style={{ marginTop: '25%' }} type="file" accept=".json" onChange={(e) => {
                        console.log(e.target.files[0]);
                        var file = e.target.files[0];
                        if (file) {
                            var fr = new FileReader();
                            fr.onload = () => {
                                props.uploadJsonActions.uploadJSON(JSON.parse(fr.result));
                                console.log(JSON.parse(fr.result));
                            }
                            fr.readAsText(file);
                        }
                    }} title="Upload" />
                </div>
            </div>
    )
}

function mapDispatcherToProps(dispatch) {
    return {
        uploadJsonActions: bindActionCreators(uploadJsonActions, dispatch)
    }

}

export default connect(null, mapDispatcherToProps)(Uploader)