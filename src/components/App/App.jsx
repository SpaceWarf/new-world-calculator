import React from "react";
import { Header, Image } from 'semantic-ui-react';
import List from '../List/List.jsx';
import logo from '../../assets/img/logo-dark.jpg';
import recipes from '../../assets/data/recipes.json';
import './App.scss';

const getRecipes = (isRawMaterial) => recipes.filter(recipe => recipe.isRawMaterial === isRawMaterial);
const getRecipe = (key) => recipes.find(recipe => recipe.key === key);

class App extends React.Component {
    constructor(props) {
        super(props);
        const craftingValues = {};
        const inventoryValues = {};
        const gatheringValues = {};
        recipes.forEach(recipe => {
            if (recipe.isRawMaterial) {
                inventoryValues[recipe.key] = 0;
                gatheringValues[recipe.key] = 0;
            } else {
                craftingValues[recipe.key] = 0;
                inventoryValues[recipe.key] = 0;
            }
        });
        this.state = {
            craftingValues,
            inventoryValues,
            gatheringValues
        };
    }

    onChangeCraftingValue(item, value) {
        const updatedCraftingValues = this.state.craftingValues;
        updatedCraftingValues[item] = value;
        this.setState({ craftingValues: updatedCraftingValues }, this.updateGatheringValues);
    }

    onChangeInventoryValue(item, value) {
        const updatedInventoryValues = this.state.inventoryValues;
        updatedInventoryValues[item] = value;
        this.setState({ inventoryValues: updatedInventoryValues }, this.updateGatheringValues);
    }

    updateGatheringValues() {
        this.setState({ gatheringValues: this.getRequiredRawMaterials() })
    }

    getRequiredRecipes() {
        return getRecipes(false).reduce((required, recipe) => {
            const requiredValue = this.state.craftingValues[recipe.key] - this.state.inventoryValues[recipe.key]
            if (requiredValue > 0) {
                required[recipe.key] = requiredValue;
            }
            return required;
        }, {});
    }
    
    getRequiredRawMaterials() {
        const requiredRecipes = this.getRequiredRecipes();
        const rawMaterialsFromRecipes = this.getRawMaterialsFromRecipes(requiredRecipes);
        return getRecipes(true).reduce((required, rawMaterial) => {
            if (rawMaterialsFromRecipes[rawMaterial.key]) {
                const requiredValue = rawMaterialsFromRecipes[rawMaterial.key] - this.state.inventoryValues[rawMaterial.key]
                required[rawMaterial.key] = requiredValue > 0 ? requiredValue : 0;
            } else {
                required[rawMaterial.key] = 0;
            }
            return required;
        }, {});
    }

    getRawMaterialsFromRecipes(requiredRecipes) {
        return Object.keys(requiredRecipes).reduce((rawMaterials, key) => {
            getRecipe(key).recipe.forEach(rawMaterial => {
                if (rawMaterials[rawMaterial.key]) {
                    rawMaterials[rawMaterial.key] += rawMaterial.quantity * requiredRecipes[key];
                } else {
                    rawMaterials[rawMaterial.key] = rawMaterial.quantity * requiredRecipes[key];
                }
            });
            return rawMaterials;
        }, {});
    }

    render() {
        return (
            <div className="app">
                <div className="header">
                    <Image src={logo}></Image>
                    <Header as='h1'>New World Calculator</Header>
                </div>
                <div className="content">
                    <div className="list-container">
                        <List
                            name="Crafting List"
                            items={getRecipes(false)}
                            values={this.state.craftingValues}
                            editable={true}
                            onChange={(item, value) => this.onChangeCraftingValue(item, value)}
                        ></List>
                        <List
                            name="Inventory"
                            items={recipes}
                            values={this.state.inventoryValues}
                            editable={true}
                            onChange={(item, value) => this.onChangeInventoryValue(item, value)}
                        ></List>
                        <List
                            name="Gathering List"
                            items={getRecipes(true)}
                            values={this.state.gatheringValues}
                            editable={false}
                            onChange={() => {}}
                        ></List>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;