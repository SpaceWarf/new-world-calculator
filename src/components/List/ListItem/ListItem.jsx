import React from "react";
import { Input } from 'semantic-ui-react';
import './ListItem.scss';

const validateOnChange = (event, item, callback) => {
    if (!isNaN(event.target.value) && Number(event.target.value) >= 0) {
        callback(item, Number(event.target.value));
    }
};

const ListItem = (props) => {
    return (
        <li className="list-item">
            <p>{props.item.name}</p>
            <div className="input-container">
                {props.editable &&
                    <Input
                        placeholder="Qty"
                        type="number"
                        value={props.value}
                        onChange={(event) => validateOnChange(event, props.item.key, props.onChange)}
                    ></Input>
                }

                {!props.editable &&
                    <p>{props.value}</p>
                }
            </div>
        </li>
    );
};

export default ListItem;