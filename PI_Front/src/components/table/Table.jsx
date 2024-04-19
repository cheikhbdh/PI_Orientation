import React from 'react';

import './table.css';

const Table = props => (
    <div className="table-wrapper">
        <table>
            {props.headData && props.renderHead && (
                <thead>
                    <tr>
                        {props.headData.map((item, index) => props.renderHead(item, index))}
                    </tr>
                </thead>
            )}
            {props.bodyData && props.renderBody && (
                <tbody>
                    {props.bodyData.map((item, index) => props.renderBody(item, index))}
                </tbody>
            )}
        </table>
    </div>
);

export default Table;
