import React from "react";
import { Header } from "semantic-ui-react";
import ListItem from "./ListItem/ListItem.jsx";
import './List.scss';

const List = (props) => {
    return (
        <div className="list">
            <Header className="list-header" as="h1">{props.name}</Header>
            <ul>
                {props.items.map(function(item, i){
                    return <ListItem
                        key={`${props.name} ${item.key}`}
                        item={item}
                        value={props.values[item.key]}
                        editable={props.editable}
                        onChange={props.onChange}
                    ></ListItem>;
                })}
            </ul>
        </div>
    );
};

export default List;